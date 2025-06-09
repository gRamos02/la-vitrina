import request from 'supertest';
import  Product from '../models/Product';
import { Category } from '../models/Category';
import app from '../server';
import { generateTestToken } from './utils/auth-helper';

describe('API de Productos', () => {
  let adminToken: string;
  let testCategory: any;

  beforeEach(async () => {
    adminToken = generateTestToken();
    // Crear una categoría para usar en las pruebas
    testCategory = await Category.create({
      name: 'Categoría de Prueba',
      description: 'Descripción de prueba'
    });
  });

  describe('GET /api/products', () => {
    it('debería retornar un array vacío cuando no existen productos', async () => {
      const response = await request(app).get('/api/products');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('debería retornar todos los productos', async () => {
      await Product.create({
        name: 'Producto de Prueba',
        description: 'Descripción del producto',
        price: 99.99,
        stock: 10,
        categories: [testCategory._id]
      });

      const response = await request(app).get('/api/products');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Producto de Prueba');
    });
  });

  describe('GET /api/products/:id', () => {
    it('debería retornar un producto específico', async () => {
      const product = await Product.create({
        name: 'Producto Individual',
        description: 'Descripción del producto',
        price: 149.99,
        stock: 5,
        categories: [testCategory._id]
      });

      const response = await request(app).get(`/api/products/${product._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Producto Individual');
    });

    it('debería retornar 404 cuando el producto no existe', async () => {
      const response = await request(app).get('/api/products/64f7b8d76c2c89d123456789');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/admin/products', () => {
    it('debería crear un nuevo producto', async () => {
      const productData = {
        name: 'Nuevo Producto',
        description: 'Descripción del nuevo producto',
        price: 199.99,
        stock: 15,
        categories: [testCategory._id.toString()]
      };

      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);

      const savedProduct = await Product.findById(response.body.data._id);
      expect(savedProduct).toBeTruthy();
      expect(savedProduct?.name).toBe(productData.name);
    });

    it('debería fallar cuando faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Producto Incompleto' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('debería fallar cuando no se proporciona token', async () => {
      const response = await request(app)
        .post('/api/admin/products')
        .send({ name: 'Test' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products/category/:categoryId', () => {
    it('debería retornar productos por categoría', async () => {
      await Product.create({
        name: 'Producto Categorizado',
        description: 'Descripción',
        price: 299.99,
        stock: 20,
        categories: [testCategory._id]
      });

      const response = await request(app)
        .get(`/api/products/category/${testCategory._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Producto Categorizado');
    });

    it('debería retornar array vacío cuando la categoría no tiene productos', async () => {
      const emptyCategory = await Category.create({
        name: 'Categoría Vacía',
        description: 'Sin productos'
      });

      const response = await request(app)
        .get(`/api/products/category/${emptyCategory._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });
});