const http = require('http');
const app = require('../app');

describe('Backend health endpoint', () => {
  let server;
  let port;

  beforeAll((done) => {
    server = app.listen(0, () => {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('GET /api/health returns status OK', (done) => {
    http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      expect(res.statusCode).toBe(200);

      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        const json = JSON.parse(body);
        expect(json.status).toBe('OK');
        expect(json.environment).toBe(process.env.NODE_ENV || 'development');
        done();
      });
    }).on('error', done);
  });
});
