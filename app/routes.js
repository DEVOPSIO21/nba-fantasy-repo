var express = require('express');
var router = express.Router();

var gamesCtrl = require('./controllers/games');
var playersCtrl = require('./controllers/players');
var statsCtrl = require('./controllers/stats');


router.get('/nba/games', gamesCtrl.get)
        .get('/nba/players', playersCtrl.get)
        .get('/nba/stats/:pid/:gid', statsCtrl.get);

module.exports = router;
