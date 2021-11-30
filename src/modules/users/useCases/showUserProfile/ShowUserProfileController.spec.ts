import request from 'supertest'
import { Connection } from 'typeorm';
import {app} from '../../../../app'
import createConnection from '../../../../database/index'

const url = '/api/v1/'
let connection: Connection;

describe('Show User Profile Controller', () => {
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

  it ('Should be able to show a user profile', async () => {
    const responseToken = await request(app).post(`${url}/sessions`).send({
      email: "test@test.com",
      password: "test"
    })
    const {token} = responseToken.body
    const {id} = responseToken.body.user
    const {email} = responseToken.body.user

    const response = await request(app).get(`${url}/profile`).set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(id)
    expect(response.body.email).toBe(email)

  })
})
