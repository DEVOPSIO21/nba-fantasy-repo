var dotenv = require('dotenv');
dotenv.load();

module.exports = {
    OrientDB: {
        database: {
            host: process.env.db,
            port: process.env.db_port,
            username: process.env.db_admin,
            password: process.env.db_pass
        },
        credentials: {
            name: process.env.db_name,
            username: process.env.db_user,
            password: process.env.db_pass
        }
    }, Oracle: {
        user:'nba',
        password: 'ddadmr12',
        connectString: 'oracle.dorasnaturals.net:1521/erp'
    }
};

module.exports.doReleaseOracle = function (conn) {
    conn.release(
        function (err) {
            if (err) {
                console.error(err.message);
            }
        });
}