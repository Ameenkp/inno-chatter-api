import request from 'supertest';
import * as http from 'http';
import { App } from '../../src/app';

describe('App integration test', () => {
  let app: App;
  let server: http.Server;

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
});
