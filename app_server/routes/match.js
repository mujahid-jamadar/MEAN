var express = require('express');
var router = express.Router();
var handlematch = require('../controller/match');

/* GET home page of match */
router.get('/',handlematch.index);

module.exports = router;
