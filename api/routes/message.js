'use strict'

var express = require('express');
var MessageController = require ('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticate');

api.get('/probando-md', md_auth.ensureAuth, MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmitMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviwedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);


module.exports = api;