#!/usr/bin/env node
const http = require('http');

const CovidHealthTracker = require('./src/CovidHealthTracker');

class Application {

  static main() {
    // Environmental Variables
    const port = process.env.PORT || 3000;

    // Application
    const app = new CovidHealthTracker();
    app.set('port', port);

    // Server
    const server = http.createServer(app);
    server.listen(port);
    server.on('listening', Application.onListening(server));
    server.on('error', Application.onError);
  }

  static onListening(server) {
    return () => console.log(`Listening on port ${server.address().port}`);
  }

  static onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    if (error.code === 'EACCES') {
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
    }
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    }
    throw error;
  };

}

Application.main();
