var Prefer= require('../models/prefer');
var Profile = require('../models/profile');
var Account = require('../models/account');
/* Get index page of match*/
// will need to use 2D search here
module.exports.index = function(req,res){
  if(req.user){
    Prefer.findOne({email:req.user.username},function(err1,prefer){
      if(err1) throw err1;
      if(prefer){
        var agewant = prefer.age;
        var skillwant = prefer.skill;
        var sex = prefer.sex;
        var sports = prefer.sports;
        Profile.findOne({email:req.user.username},function(err,profile){
          if(err) throw err;
          if(profile){
            var loc = profile.Adress;
            console.log(profile.Adress);
            Profile.aggregate()
              .near(
                {
                  near:loc,
                  distanceField: "dist",
                  spherical: true
                }
              )
              .project(
                {
                  '_id':1,
                  'email':1,
                  'sexdiff':{$eq:["$sex",sex]},
                  'sports':1,
                  'sportsdiff':{$eq:["$sports",sports]},
                  'agediff':{$abs:{$subtract:["$age",agewant]}},
                  'age':1,
                  'sex':1,
                  'skilldiff':{$abs:{$subtract:["$skill",skillwant]}},
                  'skill':1,
                  'Adress':1,
                  'dist':1
                }
              )
              .project(
                {
                  'diff':{$add:["$skilldiff",{$divide:["$agediff",5]},{$multiply:["$dist",200]}]},
                  '_id':1,
                  'email':1,
                  'sexdiff':1,
                  'sex':1,
                  'agediff':1,
                  'age':1,
                  'skilldiff':1,
                  'skill':1,
                  'sportsdiff':1,
                  'sports':1,
                  'Adress':1,
                  'dist':1
                }
              )
              .sort("diff")
              .exec(function(errs,dis){
                if(errs) throw errs;
                console.log(dis);
                if(req.query.map==1){
                // show map
                  res.render('map',{user:req.user,dist:dis,host:profile});
                }
                else{
                // show without map
                  res.render('match',{user:req.user,partners:dis,host:profile});
                }
              })
          }
          else{
            res.redirect('/users/profile');
          }
        });
      }
      else{
        res.redirect('/users/prefer');
      }
    });
  }
  else{
    res.redirect('/login');
  }
};
