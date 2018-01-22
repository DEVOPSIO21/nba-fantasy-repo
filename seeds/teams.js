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





  rp(api.teams)
      .then(function (teams) {
          var teams = JSON.parse(teams).league.standard
          Oracle.getConnection(
            config.Oracle 
           , function (err, connection) {
              if (err) {
                done.fail("Error getting Oracle DB Connection");
              }
          
              for (team_loop = 0; team_loop < teams.length; team_loop++) {
                if (teams[team_loop].isNBAFranchise == true) {
                    
                    var id = "'" +  teams[team_loop].teamId + "'";
                    var name = "'" + teams[team_loop].fullName + "'";
                    var city = "'" + teams[team_loop].city + "'";
                    var code = "'" + teams[team_loop].tricode + "'";
                    var conference = "'" + teams[team_loop].confName + "'";
                    var division = "'" + teams[team_loop].divName + "'";
                    var insertStatement = 'INSERT INTO TEAMS (id, name, city, code, conference, division) values ';
                    var insertQry= '(' + id + ', ' + name + ', ' + city + ', ' + code + ', ' + conference + ', ' + division + ')' 
                    query = insertStatement + insertQry
                    console.log(team_loop,query)
                    connection.execute(query ,{},{autoCommit: true},
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
            
            

            }
            }); 
      })


      