var Comments = require('../models/comments');
var Account = require('../models/account');
var nodemailer = require("nodemailer");


module.exports.index = function(req,res){
  if(req.user){
    var host = req.query.username;
    if(host){
      // if the host is not empty
      Account.findOne({username:host},function(err,hosts){
        if (err) throw err;
        // if there is such guy, then check if there is the comments
        if(hosts){
          console.log(hosts);
          var q = Comments.find({$or:[{sender:host,reciever:req.user.username},{sender:req.user.username,reciever:host}]}).sort({created_time:-1});
          q.exec(function(err,comment){
            if(comment[0]){
              console.log(comment);
              res.render('comments',{user:req.user,host:hosts,messages:comment});
            }
            else{
              res.render('comments',{user:req.user,host:hosts});
            }
          });
        }
        else{
          res.render('profile',{user:req.user,viewerror:'No Such User',view:'error'});
        }
      });
    }
    else{
      // List all the people who send messsage to you
      if(req.query.id!=1){
        Comments.aggregate()
          .match({reciever:req.user.username})
          .sort("-created_time")
          .project(
            {
            '_id':1,
            "sender_id":1,
            "sender":1,
            "commentbody":1,
            "created_time":1
          })
          .group({
             _id:"$sender_id",
             sender:{$first:"$sender"},
             created_time: {$first:"$created_time"}, // we need some stats for each group (for each district)
             commentbody: {$first:'$commentbody'},
             Count: { $sum: 1 }
           }
          )
          .exec(function(errs,doc){
            if(errs) throw errs;
            // sort the outcome, so the latest will show on the first one
            doc.sort(function(a,b){
                  var c = new Date(a.created_time);
                  var d = new Date(b.created_time);
                  return d-c;
                  });

            res.render('comments',{user:req.user,all:doc,who:1});
          });

      }
      else{
        Comments.aggregate()
          .match({sender:req.user.username})
          .sort("-created_time")
          .project(
            {
            '_id':1,
            "reciever":1,
            "commentbody":1,
            "created_time":1
          })
          .group({
             _id:"$sender_id",
             reciever:{$first:"$reciever"},
             created_time: {$first:"$created_time"}, // we need some stats for each group (for each district)
             commentbody: {$first:'$commentbody'},
             Count: { $sum: 1 }
           }
          )
          .exec(function(errs,doc){
            if(errs) throw errs;
            // sort the outcome, so the latest will show on the first one
            doc.sort(function(a,b){
                  var c = new Date(a.created_time);
                  var d = new Date(b.created_time);
                  return d-c;
                  });
            console.log(doc);

            res.render('comments',{user:req.user,all:doc,who:null});
          });
      }
    }

  }
  else{
    res.redirect('/login');
  }

}

// Store Comments
module.exports.comments = function(req,res){
  if(req.user){
    console.log(req.body.comments);
    console.log(req.body.host_username);


    var host = req.body.host_username;
    var commentbody = req.body.comments;
    if(commentbody){
        // host reply
        var newcomments = new Comments({
            sender_id:req.user._id,
            sender:req.user.username,
            reciever:host,
            commentbody:commentbody
        })

        newcomments.save(function(err){
          if(err) throw err;
          console.log('New Comments');
        });

        var transporter = nodemailer.createTransport( {
            service:  'Mailgun',
            auth: {
             user: 'postmaster@email.chinawhver.net',
             pass: '70ae1d0e60febe4365e6882d6913b45a'
            }
        });
        var mailOpts = {
            from: 'SportPartner@sportpartner.com',
            to: host,
            subject: 'Some Leave You a Message',
            text : commentbody,
            html : '<p>Message From: '+req.user.username+'</p><p><b>'+commentbody+'</b></p>'
        };
        transporter.sendMail(mailOpts, function (err, response) {
            if (err) {
              console.log(err);
            } else {
              console('send');
            }
        });

      res.redirect('/view/comment/'+'?username='+host);
    }
    else{
      res.render('comments',{user:req.user,error:'Comments can not be empty',host:{username:host}});
    }
  }
  // if not login, go to login
  else{
    res.redirect('/login');
  }
}
