var express = require('express');
var router = express.Router();
var api = require('../controller/api');



router.post('/match',api.match);


module.exports = router;
