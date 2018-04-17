process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect  = require('chai').expect;
const request = require('request');
const App = require('../src/server');
chai.use(chaiHttp);

describe('Login', function() {
  describe('/login?username=john&password=doe', function() {
    it('login response with 200', function(done) {
      request('http://localhost:3009/login?username=john&password=doe' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('login response with 400', function(done) {
      request('http://localhost:3009/login' , function(error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });

    it('login without password response with 400', function(done) {
      request('http://localhost:3009/login?username=john' , function(error, response, body) {
        expect(response.statusCode).to.equal(400);
        done();
      });
    });
  });
});
