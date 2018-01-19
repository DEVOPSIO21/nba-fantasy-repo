var glenn = require('../lib/fetch')
config = require('../config/database');
var OrientDB = require('orientjs');
var server = OrientDB(config.database);
var db = server.use(config.credentials);
const nba = require('nba.js').default;
const data = require('nba.js').data;
const stats = require('nba.js').stats;
var ASQ = require('asynquence');
var _constants = ''
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

var _got = require("got");
var _got2 = _interopRequireDefault(_got);


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


function fetch() {
  var endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var opts = arguments[1];

  opts = Object.assign({
    headers: {
      "accept-encoding": "Accepflate, sdch",
      "accept-language": "he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4",
      "cache-control": "max-age=0",
      connection: "keep-alive",
      host: "stats.nba.com",
      referer: "http://stats.nba.com/",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
    },
    json: false
  }, opts || {});

  var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  var url = re.test(endpoint) ? endpoint : "" + _constants.URL + endpoint;

  return (0, _got2.default)(url, opts);
}


var playerids='select distinct(player_id) as pid from playerBioStats'
var team_id='select team_id from teams'
var games=''

// playerDefenseStats - playerGamelog(all games) - playerInfo(main info) - playerProfile(has next game)
function prototypes() {
  db.query('update games remove player_id')
      .then((sanitize) => {
        console.log(sanitize)
      })
}


function playerstats(playerid, gid) {

  db.query(playerids)
    .then(function (playerstats) {

      ASQ()
        .then(function player(created) {
          nba.stats.playerInfo({ PlayerID: playerid, Season: '2017-18' }, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
            var x = JSON.stringify(res)
            var q = JSON.parse(x)
            var data = []
            data.push(q)
            var pinfo = data[0].CommonPlayerInfo;
            var pid = pinfo[0].person_id


            db.query('update Players merge  ' + JSON.stringify(pinfo[0]) + ' upsert where person_id =' + pid)
              .then(function (updated) {
                console.log('created / updated player')
                created('done')
              })

          });
        }).then(function nextgame(done) {
          nba.stats.playerProfile({ PlayerID: playerid, Season: '2017-18' }, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
            var x = JSON.stringify(res)
            var q = JSON.parse(x)
            var data = []
            data.push(q)


            var nextgame = data[0].NextGame[0]

            db.query('update Players SET NextGame= ' + JSON.stringify(nextgame) + ' upsert where person_id =' + playerid)
              .then(function (updated) {
                console.log('added next game')
                done('done')
              })

          });
        }).then(function games(done) {
          nba.stats.playerGamelog({ PlayerID: playerid, Season: '2017-18' }, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
            var x = JSON.stringify(res)
            var q = JSON.parse(x)
            var data = []
            data.push(q)
            var games = data[0].PlayerGameLog
            
            var addcnt=0;
            
            for(i=0; i < games.length; i++) {
              addcnt++
              var gameid = games[i].game_id;
              var vtx = 'UPDATE games content ' + JSON.stringify(games[i]) + ' upsert where game_id = "' + gameid  + '"'
                  db.query(vtx)
                  .then(function (updated) {
                  })
                  if(addcnt >= games.length) {
                    console.log('added all games: played in ' + addcnt)
                    done('a')
                  }
            }
          });
        }).then(function defense(done,crid) {
          nba.stats.boxscoreAdvanced({ GameID: gid }, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
            var x = JSON.stringify(res)
            var q = JSON.parse(x)
            var data = []
            data.push(q)
            var players = data[0].PlayerStats;
            for(x=0; x < players.length; x++) {
              if(playerid == players[x].player_id) {
                var playername= players[x].player_name
                playername=playername.replace(/\s/g, "")
                //console.log(playername)
                var arr = {}

                arr = players[x]
                arr['@class'] = 'Stats'
                arr['@type'] = 'd'
                
                var updateQry='Update Games ADD ' + playername + ' = [' + JSON.stringify(arr) + '] upsert RETURN AFTER @this where game_id = "' + gid + '"'

                db.query(updateQry)
                .then(function (updated) {
                  var rid= '#' + updated[0]['@rid'].cluster + ':' +updated[0]['@rid'].position
                  var record='#' + updated[0][playername][0].cluster + ':' + updated[0][playername][0].position
                  //console.log(record)
                  console.log('updated game with player stats')
                  done(record)
                })
              }
            }
          });
        }).then(function periods(quarter,crid) {
          // period loop for game
          var pl = 0;
          for (period_loop=1; period_loop < 5; period_loop++) {
            var options ={ GameID: gid, StartPeriod: period_loop, EndPeriod: period_loop,  RangeType:1};
            console.log(options)
            nba.stats.boxscoreUsage(options, (err, res) => {
              var x = JSON.parse(JSON.stringify(res))
              
              pl++
              var datas = []
              datas.push(x)
              var arr = {}
              arr = datas[0].sqlPlayersUsage[0]
              arr['@class'] = 'stat_details'
              arr['@type'] = 'd'
              arr.period = pl
              
              var updateQry='UPDATE ' + crid + ' ADD Period'+ pl + ' = [' + JSON.stringify(arr) + ']'

              console.log(updateQry)
              db.query(updateQry)
              .then(function (sd) {
                console.log(sd)
                
              })
            })
          }        
          prototypes()
        })
    })
}

playerstats(202323,'0021700608')

//glenn.resetdb()
// glenn.allPlayers()
// glenn.playerClutchStats()
// glenn.playerBioStats()
// glenn.Lineups()
// glenn.playerCareerStats()
// glenn.gameLog()

// boxscoreTraditional has points, minutes, fieldgoals , . 
// boxscoreHustleStats contested 
// boxscoreAdvanced rebound percentage. 
// playeropponentstats
// teamDetails (teamid)


// 485 players
//http://stats.nba.com/stats/boxscoreadvancedv2?StartPeriod=1&EndPeriod=14&GameID=0021700608&StartRange=1&EndRange=10
