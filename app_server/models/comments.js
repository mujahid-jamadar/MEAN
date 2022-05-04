var mongoose = require('mongoose');

var comment = new mongoose.Schema(
    {
      sender_id:  { type: String, required: true,unique: false},
      sender:{ type: String, required: true,unique: false},
      reciever:{type:String, required: true,unique: false},
      commentbody:{type: String,required:true,unique:false},
      created_time: {type:Date, default: Date.now}
    }
  );

module.exports = mongoose.model('Comments', comment, 'comment');
