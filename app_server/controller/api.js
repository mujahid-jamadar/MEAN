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

module.exports.match = function(req,res){
  if(req.user){
    console.log(req.body);
    console.log(req.user);

    var agewant = parseInt(req.body.age);
    var skillwant = parseInt(req.body.skill);
    var sex = req.body.sex;
    if(sex=="Any"){
      var querysex =1;
    }
    else{
      var querysex = {$eq:["$sex",sex]};
    }
    var sports = req.body.sport;
    if(sports=="Any"){
      var querysport = 1;
    }
    else{
      var querysport ={$eq:["$sports",sports]};
    }
    var address = req.body.address;
    if(address){
      geocoder.geocode(address, function(err, result) {
        if(err) throw err;
        var loc = [result[0].longitude, result[0].latitude];
        console.log(loc);
        if(loc){
          console.log(agewant,sex,skillwant,sports,loc);
          if((agewant)&&(skillwant)&&(sex)&&(sports)&&(address)){
            // if online, and all the information are correct
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
                      'sexdiff':querysex,
                      'sports':1,
                      'sportsdiff':querysport,
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
                    console.log(errs);
                    if(errs) throw errs;
                    console.log(dis);
                    res.json({user:req.user,partners:dis});
                  });
          }
          else{
            res.json({error:'match conditions'});
          }
        }
        else{
          res.json({error:'address'});
        };
      })
    }else{
      res.json({error:'address'});
    };
  }else{
    res.json({error:'login'});
  }
};
