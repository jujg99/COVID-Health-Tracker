const path = require('path');

const dotenv = require('dotenv');

class Configuration {

    constructor() {

        // Load .env based on NODE_ENV
        const envFile = process.env.NODE_ENV === 'development'
            ? '.env.local'
            : '.env';
        const { parsed } = dotenv.config({
            path: path.resolve(__dirname, '..', '..', envFile)
        });

        // Set every attribute of .env to this
        for (const [key, value] of Object.entries(parsed)) {
            this[key] = value;
        }

    }

}

module.exports = Configuration;
