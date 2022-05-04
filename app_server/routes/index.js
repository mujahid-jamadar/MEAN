require('../models/db');
var express = require('express');
var router = express.Router();
// var ctrlmain = require('../controller/main');
var passport = require('passport');
var Account = require('../models/account');
// var adduser = require('../controller/register');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {username:req.body.username,user:req.user});
});
// get about page
router.get('/about',function(req,res){
  res.render('about',{user:req.user});
});

// Get register page
router.get('/register', function(req, res) {
  res.render('register', {});
});

// Post to register new accounts
router.post('/register', function(req, res, next) {
  console.log('registering user');
  if ((req.body.password == req.body.repassword)&&(req.body.password.length!=0))
  {
  Account.register(new Account({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      // console.log(err);
      res.render('register',{namerror:'User Already Exist'});
    }
    else{
    // After registered, redirect to login page with username and password
    console.log('user registered!');
    res.render('login',{username:req.body.username,password:req.body.password});
  }
    });
  }
  else{
    console.log('Password Not Match');
    res.render('register',{errors:'Password not match'});
  }
});

// Get login page
router.get('/login', function(req, res) {
  res.render('login', {user: req.user});
});


//Post to login: need to deal with error information
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { console.log('1');res.render('login',{message:"Username or Password Wrong"});  }
    else if (!user) { console.log('2');res.render('login',{message:info.message}); }
    else{
      req.logIn(user, function(err) {
        if (err) {
          res.render('login',{message:'Username and Password not match'});
        }
        else{
          res.redirect('/users/');
        }
        // res.render('index',{username:req.body.username,user:user});
    });
  }
  })(req, res,next);

});

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// Get reset password page
router.get('/reset',function(req,res) {
  res.render('reset',{user:req.user});
});

// Post to change the password
router.post('/reset',function(req,res) {

  if(req.user){
  if(req.user.username==req.body.username){
  Account.findByUsername(req.body.username).then(function(sanitizedUser){
      if (sanitizedUser){
          sanitizedUser.setPassword(req.body.newpassword, function(){
              sanitizedUser.save();
              console.log('successful reset');
              res.redirect('/logout');

          });
      } else {
          // res.status(500).json({message: 'This user does not exist'});
          console.log('no such user');
          res.render('reset',{error:"No such a User"});
      }
  },function(err){
      console.error(err);
    })
  }
  else{
      res.render('reset',{error:"Username is not right!",user:req.user});
  }

  }
  else{
      res.render('reset',{error:"Please Login First"});
  }
});


module.exports = router;
