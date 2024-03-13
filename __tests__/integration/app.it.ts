import request from 'supertest';
import * as http from 'http';
import { App } from '../../src/app';
import path from "path";

describe('App integration test', () => {
  let app: App;
  let server: http.Server;
  const agent = request.agent('http://localhost:8000/api/messenger');
  let cookies: string;
  const randomNumber = Math.floor(Math.random() * 99999)
  const formData = {
    userName: randomNumber +' testuser',
    email: randomNumber +'.test@example.com',
    password: 'test_password@123A',
    confirmPassword: 'test_password@123A',
  };

  beforeEach(async () => {
    app = new App();
    server = app.server;
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('should respond with "This is from backend server" on root path', async () => {
    const response = await request(app.app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('This is from backend server');
  });

  test('should respond with 404 on unknown path', async () => {
    const response = await request(app.app).get('/unknown');
    expect(response.status).toBe(404);
  });

  test('should respond with status 201 up on user registration', async () => {
    const imagePath = path.join(__dirname, 'resource', 'image', 'it-sample.jpeg');
    const response = await agent
        .post('/user-register')
        .field('userName', formData.userName)
        .field('email', formData.email)
        .field('password', formData.password)
        .field('confirmPassword', formData.confirmPassword)
        .attach('image', imagePath);
    expect(response.status).toBe(201);
  });

  test('should respond with status 201 when logging in with valid credentials', async () => {
    // Prepare a mock user login request body
    const requestBody = {
      email: formData.email,
      password: formData.password,
    };

    const response = await agent.post('/user-login').send(requestBody);
    cookies = response.headers['set-cookie'][0];
    expect(response.status).toBe(201);
  });

  test('should respond with status 400 when logged in credentials are wrong', async () => {
    // Prepare a mock user login request body
    const requestBody = {
      email: 'wrong' + formData.email,
      password: formData.password,
    };
    const response = await agent.post('/user-login').send(requestBody);
    expect(response.status).toBe(400);
  });

  test('should respond with status 200 when updating the user details  valid data', async () => {
    const requestBody = {
      email: 'updateEmail@gmail.com',
      userName: 'update userName',
    };

    const response = await agent.patch('/user/65ed7fac57bdfe7745df1ec9')
        .set('Cookie', cookies)
        .send(requestBody);
    expect(response.status).toBe(200);
  });
});
