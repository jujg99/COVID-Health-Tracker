const mysql = require('mysql');

const Encryption = require('../util/Encryption');

class Database {

    constructor(configuration) {

        // State
        this.SALT = configuration.DB_SECRET;
        this.DB_HOST = configuration.DB_HOST;
        this.DB_USER = configuration.DB_USER;
        this.DB_PASSWORD = configuration.DB_PASSWORD;

    }

    getUser(username) {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection({
                host: this.DB_HOST,
                user: this.DB_USER,
                password: this.DB_PASSWORD
            });
            connection.connect((err) => {
                if (err) {
                    return reject(err);
                }
                connection.query('USE cht');
                const selectQuery = `SELECT * FROM users WHERE username = '${username}'`;
                connection.query(selectQuery, (err, rows) => {
                    connection.end();
                    if (err) {
                        return reject(err);
                    }
                    if (rows.length === 0) {
                        return resolve(null);
                    }
                    return resolve(rows[0]);
                });

            });
        });
    }

    matchUser(username, password) {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection({
                host: this.DB_HOST,
                user: this.DB_USER,
                password: this.DB_PASSWORD
            });
            connection.connect((err) => {
                if (err) {
                    return reject(err);
                }
                connection.query('USE cht');
                const matchQuery = `SELECT * FROM users WHERE username = '${username}'`;
                connection.query(matchQuery, (err, rows) => {
                    connection.end();
                    if (err) {
                        return reject(err);
                    }
                    if (rows.length !== 1) {
                        return resolve(null);
                    }
                    if (rows[0].password !== Encryption.encrypt(password, this.SALT)) {
                        return resolve(null);
                    }
                    return resolve(rows[0]);
                });
            });
        });
    }

    insertUser(username, password) {
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection({
                host: this.DB_HOST,
                user: this.DB_USER,
                password: this.DB_PASSWORD
            });
            connection.connect(async (err) => {
                if (err) {
                    return reject(err);
                }
                try {
                    const user = await this.getUser(username);
                    if (user === null) {
                        return resolve(null);
                    }
                    connection.query('USE cht');
                    const encryptedPassword = Encryption.encrypt(password, this.SALT);
                    const insertQuery = `INSERT INTO users ( username, password ) values ('${username}', '${encryptedPassword}')`;
                    connection.query(insertQuery, function (err, rows) {
                        connection.end();
                        if (err) {
                            return reject(err);
                        }
                        return resolve({
                            username,
                            password: encryptedPassword,
                            id: rows[0].id
                        });
                    });
                } catch (error) {
                    return reject(error);
                }
            });
        });
    }

}

module.exports = Database;
