import request from 'supertest'
import { Connection } from 'typeorm';
import {app} from '../../../../app'
import createConnection from '../../../../database/index'

const url = '/api/v1/'
let connection: Connection;

describe('Get Statement Operation Controller', () => {
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

  it ('Should be able to get statement operation by id', async () => {
    const responseToken = await request(app).post(`${url}/sessions`).send({
      email: "test@test.com",
      password: "test"
    })
    const token = responseToken.body.token
    const user_id = responseToken.body.user.id

    const statement = await request(app).post(`${url}/statements/deposit`).send({
      amount: 250,
      description: "Money Test"
    }).set({
      Authorization: `Bearer ${token}`,
    })
    const id = statement.body.id
    const response = await request(app).get(`${url}/statements/${id}`).set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.status).toBe(200);
    expect(response.body.amount).toEqual("250.00")
    expect(response.body.type).toEqual("deposit")
    expect(response.body.user_id).toBe(user_id)
  })
})
