const { scryptSync } = require("crypto");

class Encryption {

    static encrypt(payload, salt) {
        return scryptSync(payload, salt, 32).toString("hex");
    }

}

module.exports = Encryption;
