var glenn = require('./lib/fetch')
config = require('./config/database');
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
var playerid='202323'
var gid = '0021700608'


db.query('select from players where teamId='+1610612760)
    .then((players) => {
        console.log(players)
    });


    
nba.stats.boxscoreAdvanced({ GameID: '0021700608' }, (err, res) => {
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
        //console.log(updateQry)
        // db.query(updateQry)
        // .then(function (updated) {
        //   var rid= '#' + updated[0]['@rid'].cluster + ':' +updated[0]['@rid'].position
        //   var record='#' + updated[0][playername][0].cluster + ':' + updated[0][playername][0].position
        //   //console.log(record)
        //   console.log('updated game with player stats')
        //   done(record)
        //})
      }
    }
  });