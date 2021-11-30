import request from 'supertest'
import { Connection } from 'typeorm';
import {app} from '../../../../app'
import createConnection from '../../../../database/index'

const url = '/api/v1/'
let connection: Connection;

describe('Create Statment Controller', () => {
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

  it ('Should be able to create a new deposit statement', async () => {
    const responseToken = await request(app).post(`${url}/sessions`).send({
      email: "test@test.com",
      password: "test"
    })
    const token = responseToken.body.token

    const response = await request(app).post(`${url}/statements/deposit`).send({
      amount: 300,
      description: "Money Test"
    }).set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(300)
    expect(response.body.type).toEqual("deposit")
    expect(response.body).toHaveProperty("id")
  })

  it ('Should be able to create a new withdraw statement', async () => {
    const responseToken = await request(app).post(`${url}/sessions`).send({
      email: "test@test.com",
      password: "test"
    })
    const token = responseToken.body.token

    const response = await request(app).post(`${url}/statements/withdraw`).send({
      amount: 100,
      description: "Money Test Withdraw"
    }).set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.status).toBe(201);
    expect(response.body.amount).toBe(100)
    expect(response.body.type).toEqual("withdraw")
    expect(response.body).toHaveProperty("id")
  })
})
