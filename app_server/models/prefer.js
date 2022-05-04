var mongoose = require('mongoose');

var detail = new mongoose.Schema(
    { email:  { type: String, index: true },
      sex: String,
      age: Number,
      skill: {type:Number},
      sports: String
    }
  );

module.exports = mongoose.model('Prefer', detail, 'prefer');
