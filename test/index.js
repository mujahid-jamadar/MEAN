var assert = require('chai').assert;
var expect = require('chai').expect;
var should=require('chai').should();
require('../app_server/models/db');
var app = require('../app');
var request = require('supertest')(app);
var Account = require('../app_server/models/account');

describe('Index Page Test', function(){
/*
    before(function() {
      Account.register(new Account({username:'test1admin@test.com',password:"123456"}));
    // runs before all tests in this block
    });
  after(function(){
      Account.remove({username:'test1admin@test.com'});
    // runs after all tests in this block
  });
  beforeEach(function(){
    // runs before each test in this block
  });
  afterEach(function(){
    // runs after each test in this block
  });
*/

  // index page test
  describe('Index',function(){
    it('Get index page',function(done){
      request.get('/')
        .expect(200,function(err,res){
          // if(err) throw err;
          res.text.should.contain('Find the best Sport Partner for your health');
          done(err);
        });
    });
    it('Post to index 404',function(done){
      request.post('/')
      .field({'username':'test1@test.com'})
      .expect(404,function(err,res){
        // if(err) throw err;
        res.text.should.contain('404');
        done(err);
      });
    });
  });

  // about page test
  describe('About',function(){
    it('Get About page',function(done){
      request.get('/about')
        .expect(200,function(err,res){
          res.text.should.contain('git');
          done(err);
        });
    });
  });

  // register
  describe('Register',function(){

      it('Get register Page',function(done){
          request.get('/register')
            .expect(200,function(err,res){
                res.text.should.contain('register');
                done(err);
            });
      });
      describe('register exist user', function () {
          this.timeout(20000);
          it('Register not allowed when username exists', function(done) {
              this.timeout(20000);
              setTimeout(done, 20000);
              request.post('/register')
                  .send({
                      username: "admin@admin.com",
                      password: "admin1",
                      repassword: "admin1"
                  })
                  .expect(200, function (err, res) {
                      should.not.exist(err);
                      res.text.should.contain('User Already Exist');
                      done();
                  });
          });
      });
      describe('register with different passwords', function () {
          this.timeout(20000);
          it('Register not allowed when two passwords are different', function(done) {
              this.timeout(20000);
              setTimeout(done, 20000);
              request.post('/register')
                  .send({
                      username: "admin@admin.com"+Math.random(1),
                      password: "admin1",
                      repassword: "admin2"
                  })
                  .expect(200, function (err, res) {
                      should.not.exist(err);
                      res.text.should.contain('Password not match');
                      done();
                  });
          });
      });
  });


  //login function
  describe('Login', function() {
    it('should get login page successfully',function(done){
      request.get('/login')
        .expect(200,function(err,res){
          res.text.should.contain('Login');
          done(err);
        });
      });
      describe('login with incorrect password', function () {
          this.timeout(20000);
          it('should not login with incorrect password', function (done) {
              this.timeout(20000);
              setTimeout(done, 20000);
              request.post('/login')
                  .send({
                      username:"admin@admin.com",
                      password:"someRandomPassword"+Math.random(1)
                  })
                  .expect(200, function (err, res) {
                      should.not.exist(err);
                      res.text.should.contain('Password or username are incorrect');
                      done();
                  });
          });
      });
      describe('login with correct password', function () {
          this.timeout(20000);
          it('should login with correct password', function (done) {
              this.timeout(20000);
              setTimeout(done, 20000);
              request.post('/login')
                  .send({
                      username:"admin@admin.com",
                      password:"admin1"
                  })
                  .expect('Location','/users/')
                  .end(done);
          });
      });
  });

  // Reset
  describe('Reset',function(){
    it('Get reset page',function(done){
      request.get('/reset')
        .expect(200,function(err,res){
          res.text.should.contain('reset');
          done(err);
        });
    });
    it('Reset without logged in',function(done){
        request.post('/reset')
            .send({
                username:"admin@admin.com",
                oldpassword:"admin123",
                password:"admin2",
                repassword:"admin2"
            })
            .expect(200,function(err,res){
                res.text.should.contain('Please Login First');
                done(err);
            });
      });
  });

  // Logout
  describe('Logout',function(){
    it('Logout Function',function(done){
      request.get('/logout')
        .expect(302,function(err,res){
          res.header['location'].should.include('/');
          done(err);
        });
    });
  });

  // 404 page
  describe('404',function(){
      it("Get no exist page",function(done){
        request.get('/xxxxx')
          .expect(404,function(err,res){
            if (err) throw err;
            res.text.should.contain('wrong');
            done(err);
          });
      });

      let users = {
            "username":"admin@admin.com",
            "password": "admin1"
        };
        //need to fix

      it('Post 404',function(done){
          request.post('/login')
          .type('form')
          .field(users)
          .redirects()
          .expect(200)
          .end(function(err, res){
              if(err) return done(err);
              // console.log(res);
              res.text.should.contain('Missing credentials');
              return done();
          });
        });
  });
});
