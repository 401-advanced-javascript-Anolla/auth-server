'use strict';

const {server} = require('../src/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe('testing the server',()=>{

  it('respond with 500 on Internal error',()=>{
    return mockRequest.get('/err')
      .then(results=> {
        expect(results.status).toBe(500);
      }).catch(err => console.log(''));
  });

  it('respond with 404 when using invalid route',() => {

    return mockRequest
      .get('/abcd')
      .then(results => {
        expect(results.status).toBe(404);
      }).catch(console.log);
  });

  it('respond with data when using /users', ()=> {
    return mockRequest
      .get('/users')
      .then(results => {
        expect(results.status).toBe(200);
      });
  });

  it('POST  /signup ', async() => {
    let test = { 
      'username': 'a name',
      'password':'0000',
    };
    return  mockRequest
      .post('/signup')
      .send(test)
      .then(results => {
        expect(results.status).toBe(200);
      });
  });


});