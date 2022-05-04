var assert = require('chai').assert;
var expect = require('chai').expect;
var should=require('chai').should();
require('../app_server/models/db');
var app = require('../app');
var request = require('supertest')(app);
var Account = require('../app_server/models/account');

describe('Index Page Test', function(){

// users profile
describe('Users',function(){
      it('should not get profile page when not logged in',function(done){
          request.get('/users')
              .expect('Location','/login')
              .end(done);
      });
  });

// match
describe('match',function(){
      it('should not get match page when not logged in',function(done){
          request.get('/match')
              .expect('Location','/login')
              .end(done);
      });
  });
});