var express = require('express');
var router = express.Router();
var viewhandle = require('../controller/views');
var commenthandle = require('../controller/comments');
/* GET view other guys index page */
router.get('/', viewhandle.index);

/* GET show list of visitor and hosts */
router.get('/list',viewhandle.list);

/* Get Comments page*/
router.get('/comment',commenthandle.index);

/* Store comments*/
router.post('/comment',commenthandle.comments);

module.exports = router;
