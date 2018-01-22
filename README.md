### nba fetch

#### active non-routed functions
- glenn.resetdb()
- glenn.allPlayers()
- glenn.playerClutchStats()
- glenn.playerBioStats()
- glenn.Lineups()
- glenn.playerCareerStats()
- glenn.gameLog()

#### routed endpoints
- app/routes.js

#### endpoint controllers
- app/controllers/*.js

### function example

```js

function playerstats(player_id, game_id, callback) {              // function to fetch endpoint
          nba.stats.playerGamelog({ PlayerID: player_id, Season: '2017-18' }, (err, res) => {
            if (err) {
              console.error(err);
              return;
            }
            var x = JSON.stringify(res) //convert response to string
            var q = JSON.parse(x)       //convert string to json
            var data = []
            data.push(q)                //push json to array
            var games = data[0].PlayerGameLog
            
            var addcnt=0;     //variable to keep track of loop iteration
            
            for(i=0; i < games.length; i++) { // loop through games
              addcnt++
              var gameid = games[i].game_id;
              var vtx = 'UPDATE games content ' + JSON.stringify(games[i]) + ' upsert where game_id = "' + game_id  + '"'   //variable for inserting into orientdb
                  db.query(vtx)           // orientdb function
                  .then(function (updated) {
                    return updated
                  })
                  if(addcnt >= games.length) { // case to confirm object end, print to console. 
                    console.log('added all games: played in ' + addcnt)
                    
                  }
            }
          });
}
          playerstats(202323,'0021700608')      // call sample function. 

```

### graph examples
- data example, confirm for CSV export. i will need to pass params to url request. 
- examples
  - get csv for home games will be something like `http://someurl.com/games/home/1610612741`
  - get csv for periods in a game. will be something like `http://someurl.com/games/statistics/1610612741/period1`



```sql
select from teams
select expand(out(Members)) from teams where tricode='BKN'   ;
select expand(Home) from games where home_team='1610612741'  ;
select expand(Home) from games where away_team='1610612741'  ;
select from games where gameId='0021700608';
select expand(in(PlayedIn)) from games where gameId='0021700608';
select expand(in(PlayedIn)) from games where gameId='0021700608';
select from stats;
select flatten(out(Statistics)['Period1']) from games where gameId='0021700608';
select flatten(out(Statistics)['Period2']) from games where gameId='0021700608';
select flatten(out(Statistics)['Period3']) from games where gameId='0021700608';
select flatten(out(Statistics)['Period4']) from games where gameId='0021700608';
```