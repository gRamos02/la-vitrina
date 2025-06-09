import mongoose from 'mongoose';

beforeAll(async () => {
  // Conectar a una base de datos de prueba
  await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/la-vitrina-test');
});

afterAll(async () => {
  // Cerrar la conexión después de las pruebas
  await mongoose.connection.close();
});

afterEach(async () => {
  // Limpiar la base de datos después de cada prueba
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});