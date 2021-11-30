import request from 'supertest'
import { Connection } from 'typeorm';
import {app} from '../../../../app'
import createConnection from '../../../../database/index'

const url = '/api/v1/'
let connection: Connection;

describe('Create User Controller', () => {
  beforeAll (async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it ('Should be able to create a new user', async () => {
    const response = await request(app).post(`${url}/users`).send({
      name: "Test",
      email: "test@test.com",
      password: "test"
    })
    expect(response.status).toBe(201)
  })
})
