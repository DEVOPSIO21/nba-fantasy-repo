config = require('../config/database');
var OrientDB = require('orientjs');
var Oracle = require('oracledb')
var server = OrientDB(config.OrientDB.database);
var db = server.use(config.OrientDB.credentials);
var nbadb = config.Oracle;
var request = require('request');
var rp = require('request-promise');
var ASQ = require('asynquence');
var nba = require('nba.js').default;
var data = require('nba.js').data;
var stats = require('nba.js').stats;
var ASQ = require('asynquence');
var _constants = ''
"use strict";


urls = require('../config/urls');
var api = urls.endpoints;


rp(api.players)
    .then(function (players) {
        players = JSON.parse(players).league.standard;
        console.log(players.length)
        Oracle.getConnection(
            config.Oracle 
           , function (err, connection) {
              if (err) {
                done.fail("Error getting Oracle DB Connection");
              }
          
              
                for(player_loop=0; player_loop < players.length; player_loop++) {
            
                    var id =  players[player_loop].personId;
                    var team_id = players[player_loop].teamId;
                    var first_name = players[player_loop].firstName;
                    var last_name  = players[player_loop].lastName;
                    var full_name = players[player_loop].firstName + ' ' + players[player_loop].lastName;
                    var jersey = players[player_loop].jersey;
                    var is_active = players[player_loop].isActive;
                    var height_feet = players[player_loop].heightFeet;
                    var height_inches = players[player_loop].heightInches;
                    var weight = players[player_loop].weightPounds;
                    var birthday = players[player_loop].dateOfBirthUTC;
                    var debut_year = players[player_loop].nbaDebutYear;
                    var years_pro = players[player_loop].yearsPro;
                    var college = players[player_loop].collegeName;
                    var values = "select '" + id +"','" + team_id + "','" + first_name +"','" + last_name +"','" + full_name +"','" + jersey +"','" + is_active +"','" + height_feet +
                    "','" + height_inches +"','" + weight +"','" + birthday +"','" + debut_year +"','" + years_pro +"','" + college +"' from dual"; 
                    var insertQry = 'insert into players ' +  values;
                    console.log(player_loop,insertQry)

                    connection.execute(insertQry ,{},{autoCommit: true},
                        function (err, result) {
                              config.doReleaseOracle(connection);
                              if (err) {
                                 console.error(err.message);
                                 
                                 return;
                              }
                              else{
                                var resultRows = result.rows;
                                var data =[];
                                resultRows.forEach(function(rows) {
                                   console.log(rows)
                               });
                                
                                console.log(data)
                              }
                       });
                }
                    

            
            
            

            
            }); 
        
  
    })