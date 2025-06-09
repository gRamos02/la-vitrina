import request from 'supertest';
import { Category } from '../models/Category';
import app from '../server';
import { generateTestToken } from './utils/auth-helper';

describe('API de Categorías', () => {
  let adminToken: string;

  beforeEach(() => {
    adminToken = generateTestToken();
  });

  describe('GET /api/categories', () => {
    it('debería retornar un array vacío cuando no existen categorías', async () => {
      const response = await request(app).get('/api/categories');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('debería retornar todas las categorías', async () => {
      await Category.create({
        name: 'Test Category',
        description: 'Test Description'
      });

      const response = await request(app).get('/api/categories');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Category');
    });
  });

  describe('POST /api/admin/categories', () => {
    it('debería crear una nueva categoría', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'New Description'
      };

      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(categoryData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(categoryData.name);

      const savedCategory = await Category.findById(response.body.data._id);
      expect(savedCategory).toBeTruthy();
      expect(savedCategory?.name).toBe(categoryData.name);
    });

    it('debería fallar cuando falta el nombre', async () => {
      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'Test' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('debería fallar cuando no se proporciona token', async () => {
      const response = await request(app)
        .post('/api/admin/categories')
        .send({ name: 'Test' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('debería fallar cuando se proporciona un token inválido', async () => {
      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', 'Bearer invalid-token')
        .send({ name: 'Test' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});