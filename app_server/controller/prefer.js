var Prefer= require('../models/prefer');

// get the prefer page
module.exports.index = function(req,res){
    if(req.user){

      Prefer.find({ email:req.user.username }, function(err, user) {
          if (err) throw err;
          if(user[0]){
            console.log(user);
            if(req.query['edit']!='1'){
            res.render('prefer',{user:req.user,prefer:user[0]});
            }
            else{
            res.render('prefer',{user:req.user,prefers:user[0]});
            }
          }
          else{
            console.log('edit');
            res.render('prefer',{user:req.user});
          }
        });
    }
    else{
      res.redirect('/login');
    }
};

// Post to store the data
module.exports.storeprefer = function(req,res){
  if(req.user){
    console.log(req.body);


    /* pre clean the data*/
    var username = req.user.username;
    var sex = req.body.sex;
    var age = req.body.age;
    var skill = req.body.skill;
    var sport = req.body.sports;
    // add check with all the value
    if((username)&&(sex)&&(skill)&&(age)&&(sport)){
      Prefer.findOneAndUpdate({email:username},{
          email:username,
          sex:sex,
          age:age,
          skill:skill,
          sports:sport,
        },
        function(err, user) {
          if (err) throw err;

          if(user){
            console.log('Updated');
          }
          else{
            var newprefer = new Prefer({
                email:username,
                sex:sex,
                age:age,
                skill:skill,
                sports:sport,
            });
            newprefer.save(function(errs) {
            if (errs) throw errs;
              console.log('User created!');
            });
          }
      res.redirect('/users/prefer');
      });
    }
    else{
      res.render('prefer',{user:req.user,error:'Invalid Input'});
    }
  }
  else{
    res.redirect('/login');
  }
};
