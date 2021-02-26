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

    createGetUserQuery(username) {
        return (`
            SELECT
                BIN_TO_UUID(id) id,
                username,
                password
            FROM users
            WHERE username = '${username}'
        `);
    }

    createInsertUserQuery(username, password) {
        const encryptedPassword = Encryption.encrypt(password, this.SALT);
        return (`
            INSERT INTO users ( id, username, password )
            VALUES ( UUID_TO_BIN(UUID()), '${username}', '${encryptedPassword}')
        `);
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
                    connection.end();
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
                    connection.end();
                    return reject(err);
                }
                connection.query('USE cht');
                connection.query(this.createGetUserQuery(username), (err, rows) => {
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
                    connection.end();
                    return reject(err);
                }
                try {
                    const user = await this.getUser(username);
                    if (user === null) {
                        connection.end();
                        return resolve(null);
                    }
                    connection.query('USE cht');
                    connection.query(this.createInsertUserQuery(username, password), function (err, rows) {
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
                    connection.end();
                    return reject(error);
                }
            });
        });
    }

}

module.exports = Database;
