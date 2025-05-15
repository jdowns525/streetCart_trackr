const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cartRoutes = require('../routes/cartRoutes');
const Cart = require('../models/Cart');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/carts', cartRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Cart.deleteMany();
});

describe('Cart API', () => {
  it('should create a cart', async () => {
    const res = await request(app)
      .post('/api/carts')
      .send({
        name: 'Taco Truck',
        notes: 'Open 10am-4pm',
        lat: 40.7,
        lng: -74.0,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Taco Truck');
  });

  it('should get all carts', async () => {
    await Cart.create({
      name: 'Pizza Cart',
      notes: 'Daily',
      lat: 40.8,
      lng: -73.9,
    });

    const res = await request(app).get('/api/carts');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Pizza Cart');
  });

  it('should update a cart', async () => {
    const cart = await Cart.create({
      name: 'Sushi',
      notes: '',
      lat: 40,
      lng: -73,
    });

    const res = await request(app)
      .put(`/api/carts/${cart._id}`)
      .send({
        name: 'Sushi Roll',
        notes: 'Updated note',
        lat: cart.lat,
        lng: cart.lng,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Sushi Roll');
  });

  it('should delete a cart', async () => {
    const cart = await Cart.create({
      name: 'Ice Cream',
      notes: '',
      lat: 40,
      lng: -73,
    });

    const res = await request(app).delete(`/api/carts/${cart._id}`);

    expect(res.statusCode).toBe(204);
    const check = await Cart.findById(cart._id);
    expect(check).toBeNull();
  });
});