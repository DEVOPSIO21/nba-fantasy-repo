var dotenv = require('dotenv');
dotenv.load();

module.exports = {
    database:{
        host: process.env.db,
        port: process.env.db_port,
        username: process.env.db_admin,
        password: process.env.db_pass
    },

    credentials:{
        name: process.env.db_name,
        username: process.env.db_user,
        password: process.env.db_pass
    }
};
