var Views = require('../models/views');
var Account = require('../models/account');
var ObjectId = require('mongodb').ObjectID;
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

module.exports.index = function(req,res){
  // Check whether login or not
    if(req.user){
      var id = req.query.id;
      // check include a paramters or not
      if(id){
        // check, if it is the user itself, then redirect
        if(id==req.user._id){
          res.redirect('/users/profile');
        }
        // else, check the database for the user
        else{
          // if the id is not hex, then throw error, and deal with it
          try{
            ids = ObjectId(id);
          }
          catch(err){
            console.log(err);
            console.log('catched');
            res.render('profile',{user:req.user,viewerror:'Please input correct paramters',view:'error'});
          }
          Account.find({_id:ObjectId(id)},function(err,user) {

            if (err) throw err;
            // develop mode
            console.log(user[0].username);
            // If the user exists, then check the profile data
            if(user[0]){
              Profile.find({email:user[0].username},function(errs,profiles){
                if (errs) throw errs;
                console.log(profiles);
                // decode the address
                if(profiles[0]){
                  geocoder.reverse({lat:profiles[0].Adress[1], lon:profiles[0].Adress[0]}, function(err, location) {
                    console.log(location[0].formattedAddress);
                    var formaladdress;
                    formaladdress = location[0].formattedAddress;
                    if(formaladdress){
                      res.render('profile',{user:req.user,view:profiles[0],address:formaladdress});
                    }
                    // if decode fail, then show unknow address
                    else{
                      res.render('profile',{user:req.user,view:profiles[0],address:'Unknown'});
                    }
                  });
                }
                // If there is no profile, then tell the visitor
                else{
                  res.render('profile',{user:req.user,viewerror:'The partner have not editted profile',view:'error'});
                }
              });

            // If the user exists, then count they meet once

            var newview = new Views({
                host_username:user[0].username,
                vistor_username:req.user.username,
                host_id:user[0]._id,
                vistor_id:req.user._id
            })

            newview.save(function(err){
              if(err) throw err;
              console.log('New Visit');
            });

            }
            // else tell the user, no such users
            else{
              res.render('profile',{user:req.user,viewerror:'No Such User',view:'error'});
            }
          });
        }
      }
      else{
        res.render('profile',{user:req.user,viewerror:'Please input some paramters',view:'error'});
      }
    }
    else{
      res.redirect('/login');
    }
};

module.exports.list = function(req,res){
  if(req.user){
    var listid = req.query.listid;
    if(listid == 1){
      // /* show who the user visit*/
      //  Views.find({vistor_username:req.user.username},function(err,visitor){
      //   // find all the hosts and the username
      //   console.log(visitor);
      //   res.render('view',{users:visitor,listid:1});
      //
      // });

      var q = Views.find({vistor_username:req.user.username}).sort({visit_time:-1}).limit(10);
      q.exec(function(err,visitor){
        console.log(visitor);
        res.render("view",{users:visitor,listid:1,user:req.user});
      });

    }
    else
    {
      /* show who the user visit*/
      //  Views.find({host_username:req.user.username},function(err,visitor){
      //   // find all the hosts and the username
      //
      //   res.render('view',{users:visitor,listid:2});
      //
      // });

      var q = Views.find({host_username:req.user.username}).sort({visit_time:-1}).limit(10);
      q.exec(function(err,visitor){
        res.render("view",{users:visitor,listid:2,user:req.user});
      });
    }
  }
  else{
    res.redirect('/login');
  }
};
