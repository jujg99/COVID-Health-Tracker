const http = require('http');

class Server {

    constructor(app, configuration) {

        // Server State
        this.server = http.createServer(app);
        this.port = configuration.PORT;

        // this Bind
        this.onListening = this.onListening.bind(this);
        this.onError = this.onError.bind(this);
        this.onExit = this.onExit.bind(this);

    }

    run() {
        this.server.listen(this.port);
        this.server.on('listening', this.onListening);
        this.server.on('error', this.onError);
        process.on('exit', this.onExit);
        process.on('SIGINT', this.onExit);
        process.on('SIGTERM', this.onExit);
    }

    onListening() {
        console.log(`Listening on port ${this.port}`);
    }

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        if (error.code === 'EACCES') {
            console.error(`Port ${this.port} requires elevated privileges`);
            process.exit(1);
        }
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${this.port} is already in use`);
            process.exit(1);
        }
        throw error;
    }

    onExit() {
        console.log('Exiting Application!');
    }

}

module.exports = Server;
