import request from 'supertest';
import Banner from '../models/Banner';
import app from '../server';
import { generateTestToken } from './utils/auth-helper';

describe('API de Banners', () => {
  let adminToken: string;

  beforeEach(async () => {
    adminToken = generateTestToken();
  });

  describe('GET /api/banners', () => {
    it('debería retornar un array vacío cuando no existen banners', async () => {
      const response = await request(app).get('/api/banners');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('debería retornar todos los banners activos', async () => {
      await Banner.create({
        title: 'Banner de Prueba',
        subtitle: 'Subtítulo de prueba',
        image: 'test-image.jpg',
        order: 1,
        isActive: true
      });

      const response = await request(app).get('/api/banners');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Banner de Prueba');
    });
  });

  describe('POST /api/admin/banners', () => {
    it('debería crear un nuevo banner', async () => {
      const bannerData = {
        title: 'Nuevo Banner',
        subtitle: 'Nuevo Subtítulo',
        image: 'new-image.jpg',
        order: 2,
        isActive: true
      };

      const response = await request(app)
        .post('/api/admin/banners')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(bannerData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(bannerData.title);

      const savedBanner = await Banner.findById(response.body.data._id);
      expect(savedBanner).toBeTruthy();
      expect(savedBanner?.title).toBe(bannerData.title);
    });

    it('debería fallar cuando faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/admin/banners')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Banner Incompleto' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('debería fallar cuando no se proporciona token', async () => {
      const response = await request(app)
        .post('/api/admin/banners')
        .send({ title: 'Test' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/banners/:id', () => {
    it('debería actualizar un banner existente', async () => {
      const banner = await Banner.create({
        title: 'Banner Original',
        subtitle: 'Subtítulo Original',
        image: 'original-image.jpg',
        order: 1,
        isActive: true
      });

      const updateData = {
        title: 'Banner Actualizado',
        isActive: false
      };

      const response = await request(app)
        .put(`/api/admin/banners/${banner._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.isActive).toBe(updateData.isActive);
    });

    it('debería fallar al actualizar un banner inexistente', async () => {
      const response = await request(app)
        .put('/api/admin/banners/64f7b8d76c2c89d123456789')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Update Test' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/banners/:id', () => {
    it('debería eliminar un banner existente', async () => {
      const banner = await Banner.create({
        title: 'Banner a Eliminar',
        subtitle: 'Será eliminado',
        image: 'delete-image.jpg',
        order: 3,
        isActive: true
      });

      const response = await request(app)
        .delete(`/api/admin/banners/${banner._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedBanner = await Banner.findById(banner._id);
      expect(deletedBanner).toBeNull();
    });
  });
});