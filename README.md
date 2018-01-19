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

          nba.stats.playerGamelog({ PlayerID: 202323, Season: '2017-18' }, (err, res) => {
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
                    
                  }
            }
          });

          //playerstats(202323,'0021700608')

```

### graph examples
```sql
select from teams
select expand(out(Members)) from teams where tricode='BKN'
select expand(Home) from games where home_team='1610612741'  
select expand(Home) from games where away_team='1610612741'  
select from games where gameId='0021700608'
select expand(in(PlayedIn)) from games where gameId='0021700608'
select expand(in(PlayedIn)) from games where gameId='0021700608'
select from stats
select flatten(out(Statistics)['Period1']) from games where gameId='0021700608'
select flatten(out(Statistics)['Period2']) from games where gameId='0021700608'
select flatten(out(Statistics)['Period3']) from games where gameId='0021700608'
select flatten(out(Statistics)['Period4']) from games where gameId='0021700608'
```