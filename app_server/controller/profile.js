var Profile = require('../models/profile');
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyC-mZN2QbvwGy6IVwgdz-hmoMo_PFtvzRU',
  formatter: null
};
var geocoder = NodeGeocoder(options);

/*
How to deal with location

  To decode and encode the location, we transform it as [lat,lng] to store in the database
  And use google api with javascript to validate the client side during the edit process
  Use node-geocoder to decode the [lat,lng] from the server side

*/

// Profile index page: decide where to go
// if login status, there find whether got profile
  // If there is, then show it
  // else: edit it
// else go to login
module.exports.index = function(req, res) {
  if(req.user){
  Profile.find({ email:req.user.username }, function(err, user) {
      if (err) throw err;
      if(user[0]){
        console.log(user);
        res.render('user',{user:req.user});
      }
      else{
        console.log('edit');
        res.redirect('/users/editprofile');
      }
    });
  }
  else{
    res.redirect('/login');
  }
};


//If the user have a profile, then show it
module.exports.getprofile = function(req,res){
  // check login or not
  if(req.user){
    Profile.find({ email:req.user.username }, function(err, user) {
        if (err) throw err;
        if(user[0]){
          // there is a profile for the user, then show it
          console.log(user[0]);
          // decode the location, and return as location
          geocoder.reverse({lat:user[0].Adress[1], lon:user[0].Adress[0]}, function(err, location) {
            if(err) throw err;
            console.log(location[0].formattedAddress);
            var formaladdress;
            formaladdress = location[0].formattedAddress;
            if(formaladdress){
              res.render('profile',{user:req.user,profile:user[0],address:formaladdress});
            }
            else{
              res.redirect('/users/editprofile');
            }
          });
        }
        else{
          // there is no profile for the user, redirect to edit one
          console.log('edit');
          res.redirect('/users/editprofile');
        }
      });
  }
  else{
    // if not login, redirect to login page
    res.redirect('/login');
  }
};


/* Get the edit profile page
    - If the user do have a profile, then prefill it
    - If the user do not have the profile, show the clean page
*/
module.exports.editprofile = function(req,res){
  if(req.user){
    Profile.find({ email:req.user.username }, function(err, user) {
        if (err) throw err;
        if(user[0]){
          // there is a profile for the user, then show it
          console.log(user[0]);
          // decode the location, and return as location
          geocoder.reverse({lat:user[0].Adress[1], lon:user[0].Adress[0]}, function(errs, location) {
            if(errs) throw errs;
            console.log(location[0].formattedAddress);
            var formaladdress;
            formaladdress = location[0].formattedAddress;
            if(formaladdress){
              // console.log(formaladdress);
              res.render('profile',{user:req.user,profiles:user[0],address:formaladdress});
            }
            else{
              res.render('profile',{user:req.user});
            }
          });
        }
        else{
          // there is no profile for the user, then, render to edit a new one
          console.log('edit');
          res.render('profile',{user:req.user});
        }
      });
  }
  else{
    res.redirect('/login');
  }
};

/* Post to deal with the data
  - If there is data about it, then update
  - Or create a new one
  - then redirect to the profile page
*/

module.exports.storeprofile = function(req,res){
  if(req.user){
    console.log(req.body);
    console.log(req.user);

    /* pre clean the data*/
    var username = req.user.username;
    var sex = req.body.sex;
    var age = req.body.age;
    var skill = req.body.skill;
    var sport = req.body.sports;
    var lat = req.body.addresslat;
    var lng = req.body.addresslng;
    var address = [lng,lat];
    if((username)&&(sex)&&(age)&&(skill)&&(sport)&&(lat)&&(lng)){

    // test the address from server
    geocoder.reverse({lat:lat, lon:lng}, function(err, location) {
        if (err) throw err;
        console.log(location[0].formattedAddress);
        var formaladdress;
        formaladdress = location[0].formattedAddress;
        console.log(formaladdress);
        if(formaladdress){
          // console.log(formaladdress);
          Profile.findOneAndUpdate(
              {email:username},
              {         email:username,
                        sex:sex,
                        age:age,
                        skill:skill,
                        sports:sport,
                        Adress:address
              },
            function(err, user) {
            if (err) throw err;

            if(user){
              console.log('Updating');
            }
            else{
              var newprofile = new Profile({
                  email:username,
                  sex:sex,
                  age:age,
                  skill:skill,
                  sports:sport,
                  Adress:address
              });
              newprofile.save(function(err) {
              if (err) throw err;
                console.log('User created!');
              });
            }

          });
          res.redirect('/users/profile');

        }
        else{
          res.render('profile',{user:req.user,error:'Some Problems with locations',profiles:req.body});
          }
      });
    }
    else{
      res.render('profile',{user:req.user,errors:'Invalid Input',profiles:req.body});
    }
  }
  // If not login then redirect to login page
  else{
    res.redirect('/login');
  }
};
