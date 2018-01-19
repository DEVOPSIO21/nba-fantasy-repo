config = require('../../config/database');
var OrientDB = require('orientjs');
var server = OrientDB(config.database);
var db = server.use(config.credentials);
var date = require('date-and-time');
var now = new Date();
var ts = now.toISOString().replace(/T/, ' ').replace(/\..+/, '');
var parsed_date = now.toISOString().slice(0,10).replace(/-/g,"");
var ASQ = require('asynquence');

exports.get = (req, res) => {
    
}