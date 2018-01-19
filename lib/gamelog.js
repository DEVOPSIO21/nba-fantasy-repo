
config = require('../config/database');
urls = require('../config/urls');
var OrientDB = require('orientjs');
var server = OrientDB(config.database);
var db = server.use(config.credentials);
var nba = require('nba.js').default;
var data = require('nba.js').data;
var stats = require('nba.js').stats;
var ASQ = require('asynquence');
var rp = require('request-promise')
var _constants = '';
var api = urls.endpoints;

db.query('select from players')
    .then(function (data) {
        for (i=0; i < data.length; i++) {
            var personId = data[i].personId;
            
            nba.stats.playerGamelog({  PlayerID: personId, Season: '2017-18' }, (err, res) => {
                if (err) {
                  console.error(err);
                  return;
                }
                var x = JSON.stringify(res)
                var q = JSON.parse(x)
                var data = []
                data.push(q)
                console.log(data)    
                // for(i=0; i < games.length; i++) {
                //   addcnt++
                //   var gameid = games[i].game_id;
                //   var vtx = 'UPDATE games content ' + JSON.stringify(games[i]) + ' upsert where game_id = "' + gameid  + '"'
                //       db.query(vtx)
                //       .then(function (updated) {
                //       })
                //       if(addcnt >= games.length) {
                //         console.log('added all games: played in ' + addcnt)
                //         done('a')
                //       }
                // }
              });
        }
    })

