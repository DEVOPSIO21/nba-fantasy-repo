config = require('./config/database');
var OrientDB = require('orientjs');
var server = OrientDB(config.database);
var db = server.use(config.credentials);
const nba = require('nba.js').default;
const data = require('nba.js').data;
const stats = require('nba.js').stats;
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
/**
 * 
 * Working endpoints
 * - lineups
 * - leagueLeaders
 * - playerBioStats
 * - 
 * MIN, FG, FGA, 3P 3PA, FT, FTA, OR, DR, TOT, A , PF, ST, TO BL PTS
 */
function playerClutchStats() {
  nba.stats.playerClutchStats({ Season: '2017-18' }, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    var x = JSON.stringify(res)
    var q = JSON.parse(x)
    var data=[]
    data.push(q)
  
    console.log()
  
    for (iloop = 0; iloop < data[0].LeagueDashPlayerClutch.length; iloop++) {
      var arr = {}
      arr.group_set = x[iloop]
      var content = data[0].LeagueDashPlayerClutch[iloop]
      
      db.query('insert into playerClutchStats content ' + JSON.stringify(content))
        .then(function (inserted) {
          console.log(inserted)
        })
    }
  });
  
}



function Lineups() {
nba.stats.lineups({ Season: '2017-18' }, (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  var x = JSON.stringify(res)
  var q = JSON.parse(x)
  var data=[]
  data.push(q)

  console.log()

  for (iloop = 0; iloop < data[0].Lineups.length; iloop++) {

    var content = data[0].Lineups[iloop]
    
    db.query('insert into Lineups content ' + JSON.stringify(content))
      .then(function (inserted) {
        console.log(inserted)
      })
  }
});
}






function playerBioStats() {
nba.stats.playerBioStats({ Season: '2017-18' }, (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  var x = JSON.stringify(res)
  var q = JSON.parse(x)
  var data=[]
  data.push(q)

  

  for (iloop = 0; iloop < data[0].LeagueDashPlayerBioStats.length; iloop++) {
    var arr = {}
    arr.group_set = x[iloop]
    var content = data[0].LeagueDashPlayerBioStats[iloop]
    
    db.query('insert into playerBioStats content ' + JSON.stringify(content))
      .then(function (inserted) {
        console.log(inserted)
      })
  }
});
}


function playerCareerStats() {
//get player id's from orientdb
var playerids='select distinct(player_id) as pid from playerBioStats'

db.query(playerids)
  .then(function (playerstats) {
      // loop through results to pass as param
      console.log(playerstats.length)
      for (id =0; id < playerstats.length; id++) {
        var id = playerstats[id].pid;
       
        //pass playerid as a param to endpoints
          nba.stats.playerCareerStats({ PlayerID: id }, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
            var x = JSON.stringify(res)
            var q = JSON.parse(x)
            var data=[]
            data.push(q)
            console.log(data[0].SeasonTotalsRegularSeason.length)

            
            // second loop within loop to parse data and insert into db. 
            for (iloop = 0; iloop < data[0].SeasonTotalsRegularSeason.length; iloop++) {
              var arr = {}
              arr.group_set = x[iloop]
              var content = data[0].SeasonTotalsRegularSeason[iloop]
              
              db.query('insert into playerCareerStats content ' + JSON.stringify(content))
                .then(function (inserted) {
                  console.log(inserted)
                })
            }
          });
      }
    
  })

}

function resetdb() {
  db.query('select cleardb()')
    .then((cleared) => {
      console.log('database reset complete')
    })
}


//resetdb()
//playerClutchStats()
//playerBioStats()
//Lineups()
//playerCareerStats()



