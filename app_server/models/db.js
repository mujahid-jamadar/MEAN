var mongoose = require('mongoose');
// Connect to mlab here, just use to do some experiment now
// mongodb://pascalsun:sunQIANG9337@ds137891.mlab.com:37891/pascalsun

// local environment
// var dbURI = 'mongodb://localhost:27017/sportpartner';

/*cloud platform for mongoose, mLab*/
var dbURI = "mongodb://pascalsun:sunQIANG9337@ds137891.mlab.com:37891/pascalsun";
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg,callback){
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through '+msg);
            callback();
    });
};

require('./profile.js');
require('./prefer.js');
require('./comments.js');
