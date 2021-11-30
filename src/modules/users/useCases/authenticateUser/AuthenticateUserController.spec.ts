import request from 'supertest'
import { Connection } from 'typeorm';
import {app} from '../../../../app'
import createConnection from '../../../../database/index'

const url = '/api/v1/'
let connection: Connection;

describe('Authenticate User Controller', () => {
  beforeAll (async () => {
    connection = await createConnection();
    await connection.runMigrations();
    await request(app).post(`${url}/users`).send({
      name: "Test",
      email: "test@test.com",
      password: "test"
    })
  })
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it ('Should be able to authenticate a user', async () => {
    const response = await request(app).post(`${url}/sessions`).send({
      email: "test@test.com",
      password: "test"
    })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
    expect(response.body).toHaveProperty("user")
    expect(response.body.user.email).toEqual("test@test.com")
  })
})
