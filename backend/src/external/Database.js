const mysql = require("mysql");

const Encryption = require("../util/Encryption");

class Database {
  constructor(configuration) {
    // State
    this.SALT = configuration.DB_SECRET;
    this.DB_HOST = configuration.DB_HOST;
    this.DB_USER = configuration.DB_USER;
    this.DB_PASSWORD = configuration.DB_PASSWORD;
  }

  createGetUserQuery(username) {
    return `
            SELECT
                BIN_TO_UUID(id) id,
                username,
                password,
                admin
            FROM users
            WHERE username = '${username}'
        `;
  }

  createInsertUserQuery(username, encryptedPassword, body) {
    return `
            INSERT INTO users (
                username,
                password,
                id,
                admin,
                first_name,
                last_name,
                age,
                atRisk,
                city,
                state
            )
            VALUES (
                '${username}',
                '${encryptedPassword}',
                UUID_TO_BIN(UUID()),
                FALSE,
                '${body.first_name}',
                '${body.last_name}',
                ${body.age},
                FALSE,
                '${body.city}',
                '${body.state}'
            )
        `;
  }

  getUser(username) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
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

  getAllUsers() {
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
        const selectQuery = `SELECT * FROM users WHERE admin = '0'`;
        connection.query(selectQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          if (rows.length === 0) {
            return resolve(null);
          }
          return resolve(rows);
        });
      });
    });
  }

  buildPatchArgs(prev, next) {
    // Build SET query based on differences in current row and arguments
    const query = [];
    for (const key of Object.keys(prev)) {
      // If empty input or unchangeable field
      if (
        prev[key] === next[key] ||
        next[key] === "" ||
        next[key] === null ||
        next[key] === undefined ||
        key === "admin" ||
        key === "id"
      ) {
        continue;
      }
      // Encrypt password
      if (key === "password") {
        const encrypted = Encryption.encrypt(next[key], this.SALT);
        if (prev[key] !== encrypted) {
          query.push(`${key} = '${encrypted}'`);
        }
        // Convert age
      } else if (key === "age") {
        if (prev[key] !== Number(next[key])) {
          query.push(`${key} = ${Number(next[key])}`);
        }
        // Convert atRisk
      } else if (key === "atRisk") {
        if ((prev[key] === 1) !== next[key]) {
          query.push(`${key} = ${Boolean(next[key])}`);
        }
        // Otherwise, build
      } else {
        query.push(`${key} = '${next[key]}'`);
      }
    }
    return query.join(", ");
  }

  patchUser(user, args) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const builtArgs = this.buildPatchArgs(user, args);
        if (builtArgs === "") {
          connection.end();
          return resolve("no op");
        }

        const updateQuery = `
                    UPDATE users
                    SET ${builtArgs}
                    WHERE username = '${user.username}';
                `;
        connection.query(updateQuery, (err) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve("success");
        });
      });
    });
  }

  matchUser(username, password) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        connection.query(this.createGetUserQuery(username), (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          if (rows.length === 0) {
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

  insertUser(username, password, body) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        return this.getUser(username)
          .then(user => {
            if (user !== null) {
              connection.end();
              return resolve(null);
            }
            connection.query("USE cht");
            const encryptedPassword = Encryption.encrypt(password, this.SALT);
            connection.query(
              this.createInsertUserQuery(username, encryptedPassword, body),
              (err) => {
                connection.end();
                if (err) {
                  return reject(err);
                }
                return this.getUser(username)
                  .then(user => {
                    return resolve({
                      username,
                      password: encryptedPassword,
                      id: user.id,
                      admin: user.admin,
                    });
                  })
                  .catch(error => reject(error));
              }
            );
          })
          .catch(error => {
            connection.end();
            return reject(error);
          });
      });
    });
  }

  deleteUser(data) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
        multipleStatements: true,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const updateQuery = `
            DELETE FROM symptoms WHERE username = ?;
            DELETE FROM travels WHERE username = ?;
            DELETE FROM tests WHERE username = ?;
            DELETE FROM users WHERE username = ?;`;
        connection.query(updateQuery, [data.username, data.username, data.username, data.username], (err) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve("Delete Successful");
        });
      });
    });
  }

  getSymptoms(username) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const selectQuery = `SELECT BIN_TO_UUID(id) textid, symptoms.* FROM symptoms WHERE username = '${username}'`;
        connection.query(selectQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  insertSymptoms(symptoms) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const insertQuery = `INSERT INTO symptoms (username, id, date, temperature, cough, shortBreath, fatigue,
            bodyAche, tasteLoss, soreThroat, congest, nausea, other)
            VALUES ('${symptoms.username}',
              UUID_TO_BIN(UUID()),
              curdate(),
              '${symptoms.temperature}',
              ${symptoms.cough},
              ${symptoms.shortBreath},
              ${symptoms.fatigue},
              ${symptoms.bodyAche},
              ${symptoms.tasteLoss},
              ${symptoms.soreThroat},
              ${symptoms.congestion},
              ${symptoms.nausea},
              '${symptoms.other}')`;
        connection.query(insertQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  deleteSymptom(data) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const deleteQuery = `DELETE FROM symptoms WHERE id=(UUID_TO_BIN('${data.id}'))`;
        connection.query(deleteQuery, (err) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve('Delete Successful');
        });
      });
    });
  }

  editSymptom(data) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const updateQuery = `
                    UPDATE symptoms
                    SET temperature='${data.temperature}',
                      cough=${data.cough},
                      shortBreath=${data.shortBreath},
                      fatigue=${data.fatigue},
                      bodyAche=${data.bodyAche},
                      tasteLoss=${data.tasteLoss},
                      soreThroat=${data.soreThroat},
                      congest=${data.congestion},
                      nausea=${data.nausea},
                      other='${data.other}'
                    WHERE id = (UUID_TO_BIN('${data.id}'))
                `;
        connection.query(updateQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  getTestResults(username) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const selectQuery = `SELECT BIN_TO_UUID(id) textid, tests.* FROM tests WHERE username = '${username}'`;
        connection.query(selectQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  insertTestResults(data) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const insertQuery = `INSERT INTO tests (username, date, test, result, id)
            VALUES ('${data.username}', '${data.date.substring(0, 10)}', '${data.type
          }', '${data.result}', UUID_TO_BIN(UUID()))`;
        connection.query(insertQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  deleteTestResult(data) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const deleteQuery = `DELETE FROM tests WHERE id=(UUID_TO_BIN('${data.id}'))`;
        connection.query(deleteQuery, (err) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve('Delete Successful');
        });
      });
    });
  }

  editTestResult(data) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const updateQuery = `
                    UPDATE tests
                    SET date='${data.date.substring(0, 10)}',
                      test='${data.test}',
                      result='${data.result}'
                    WHERE id = (UUID_TO_BIN('${data.id}'))
                `;
        connection.query(updateQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  getAgeAndRisk(username) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const selectQuery = `SELECT age, atRisk FROM users WHERE username = '${username}'`;
        connection.query(selectQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  getUserCounts() {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
        multipleStatements: true,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const selectQuery = `
            SELECT COUNT(*) AS userCount FROM users;
            SELECT COUNT(*) AS adminCount FROM users WHERE admin=1;
            SELECT COUNT(*) AS atRiskCount FROM users WHERE atRisk=1;`;
        connection.query(selectQuery, [], (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  getTickets(username) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
        multipleStatements: true,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const selectQuery =
          `SELECT * FROM tickets WHERE username = '${username}';`;
        connection.query(selectQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  getPendingTickets() {
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
        const selectQuery = `SELECT * FROM tickets WHERE answered = '0'`;
        connection.query(selectQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          if (rows.length === 0) {
            return resolve([]);
          }
          return resolve(rows);
        });
      });
    });
  }

  getAnsweredTickets() {
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
        const selectQuery = `SELECT * FROM tickets WHERE answered = '1'`;
        connection.query(selectQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          if (rows.length === 0) {
            return resolve([]);
          }
          return resolve(rows);
        });
      });
    });
  }

  insertTicket(username, question) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
        multipleStatements: true,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const insertQuery = `
          INSERT INTO tickets (
            username,
            date,
            answered,
            question,
            answer,
            ticket_id
          )
          VALUES (
            '${username}',
            curdate(),
            false,
            '${question}',
            '',
            UUID_TO_BIN(UUID())
          )`;
        connection.query(insertQuery, (err, rows) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve(rows);
        });
      });
    });
  }

  updateTicket(data) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: this.DB_HOST,
        user: this.DB_USER,
        password: this.DB_PASSWORD,
        multipleStatements: true,
      });
      connection.connect((err) => {
        if (err) {
          connection.end();
          return reject(err);
        }
        connection.query("USE cht");
        const updateQuery = `UPDATE tickets SET answer=?, answered=1 WHERE username=? AND question=?;`;
        connection.query(updateQuery, [data.answer, data.username, data.question], (err) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          return resolve("Update Successful");
        });
      });
    });
  }
}

module.exports = Database;
