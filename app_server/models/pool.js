const { Pool, Client } = require('pg');
let pool = null;
///*
pool = new Pool({user: "azeez",
database: 'standardcomp',
host: "localhost",
password: "Spider5050",
port: 5432
});
if(process.env.NODE_ENV === 'production'){
    pool = new Pool({
        connectionString:process.env.DATABASE_URL,
        ssl:{rejectUnauthorized: false}
    });
}
module.exports = pool;