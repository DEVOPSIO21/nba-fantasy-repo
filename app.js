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
nba.stats.playerClutchStats({ Season: '2017-18' }, (err, res) => {
  if (err) {
    console.error(err);
    return;
  }
  var x = JSON.stringify(res)
  var q = JSON.parse(x)
  console.log(q)

  for (iloop = 0; iloop < x.length; iloop++) {
    var arr = {}
    arr.group_set = x[iloop]
    //console.log(arr)
  }

//  console.log(q);
});

