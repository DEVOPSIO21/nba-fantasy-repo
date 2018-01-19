
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

function teams() {
    rp(api.teams)
        .then(function (teams) {
            var teams = JSON.parse(teams).league.standard
            for (team_loop = 0; team_loop < teams.length; team_loop++) {
                if (teams[team_loop].isNBAFranchise == true) {
                    var upsertQry = 'update teams merge ' + JSON.stringify(teams[team_loop]) + ' upsert where teamId =' + teams[team_loop].teamId
                    db.query(upsertQry)
                        .then(function (updated) {
                            console.log(updated)
                        })
                }
            }
        })
};


function players() {
rp(api.players)
    .then(function (players) {
        players = JSON.parse(players).league.standard
        for(player_loop=0; player_loop < players.length; player_loop++) {
            var upsertQry = 'update players merge ' + JSON.stringify(players[player_loop]) + ' upsert where personId =' + players[player_loop].personId;
            db.query(upsertQry)
                .then(function (created) {
                    console.log(created)
                })
        }
    })
};

function edges() {
db.query('select from teams')
    .then((players) => {
        for (i=0;i<players.length;i++) {
            var teamId = players[i].teamId;
            var edgeQry='create edge Members from (select from teams where teamId='+teamId+') to (select from players where teamId='+teamId+')'
            console.log(edgeQry)
            db.query(edgeQry)
                .then((edge) => {
                    console.log('edge created: ', edge)
                })

        }
    })
}

function games() {
    rp(api.schedules)
    .then(function (schedules) {
        schedules = JSON.parse(schedules).league.standard;
        for (s_loop=0; s_loop < schedules.length; s_loop++) {
            var arr={};
            arr.gameId = schedules[s_loop].gameId;
            arr.start_date = schedules[s_loop].startDateEastern;
            arr.start_time = schedules[s_loop].startTimeEastern;
            arr.home_team = schedules[s_loop].hTeam.teamId;
            arr.away_team = schedules[s_loop].vTeam.teamId;
            var createGames = 'update Games merge ' + JSON.stringify(arr) + " upsert where gameId = '" + arr.gameId +"'"
            db.query(createGames)
                .then(function (games) {
                    console.log(games)
                })        
        }
    })
}


// db.query('select from games')
//     .then(function (getGames) {
        
//             var gameId= getGames[0].gameId;
//             console.log(gameId)    
//             nba.stats.boxscoreAdvanced({ GameID: gameId }, (err, res) => {
//                 if (err) {
//                   console.error(err);
//                   return;
//                 }
//                 var x = JSON.stringify(res)
//                 var q = JSON.parse(x)
//                 var data = []
//                 data.push(q)
//                 var players = data[0].PlayerStats;
//                 console.log(players)
//                 // for(x=0; x < players.length; x++) {
//                 //   if(playerid == players[x].player_id) {
//                 //     var playername= players[x].player_name
//                 //     playername=playername.replace(/\s/g, "")
//                 //     //console.log(playername)
//                 //     var arr = {}
    
//                 //     arr = players[x]
//                 //     arr['@class'] = 'Stats'
//                 //     arr['@type'] = 'd'
                    
//                 //     var updateQry='Update Games ADD ' + playername + ' = [' + JSON.stringify(arr) + '] upsert RETURN AFTER @this where game_id = "' + gid + '"'
    
//                 //     // db.query(updateQry)
//                 //     // .then(function (updated) {
//                 //     //   var rid= '#' + updated[0]['@rid'].cluster + ':' +updated[0]['@rid'].position
//                 //     //   var record='#' + updated[0][playername][0].cluster + ':' + updated[0][playername][0].position
//                 //     //   //console.log(record)
//                 //     //   console.log('updated game with player stats')
//                 //     //   done(record)
//                 //     // })
//                 //   }
//                 // }
//               });
        
//     })
rp('http://data.nba.net/data/10s/prod/v1/20171003/0011700012_boxscore.json')
    .then(function (data) {
        console.log(data)
    })