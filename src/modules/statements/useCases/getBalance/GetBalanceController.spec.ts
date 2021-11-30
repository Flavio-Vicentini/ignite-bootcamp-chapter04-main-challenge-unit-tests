import request from 'supertest'
import { Connection } from 'typeorm';
import {app} from '../../../../app'
import createConnection from '../../../../database/index'

const url = '/api/v1/'
let connection: Connection;

describe('Get Balance Controller', () => {
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

  it ('Should be able to get balance', async () => {
    const responseToken = await request(app).post(`${url}/sessions`).send({
      email: "test@test.com",
      password: "test"
    })
    const token = responseToken.body.token

    await request(app).post(`${url}/statements/deposit`).send({
      amount: 250,
      description: "Money Test"
    }).set({
      Authorization: `Bearer ${token}`,
    })
    await request(app).post(`${url}/statements/withdraw`).send({
      amount: 100,
      description: "Money Test Withdraw"
    }).set({
      Authorization: `Bearer ${token}`,
    })

    const response = await request(app).get(`${url}/statements/balance`).set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(150)
    expect(response.body.statement).toHaveLength(2)
  })
})
