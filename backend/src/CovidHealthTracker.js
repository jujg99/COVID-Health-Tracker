const path = require("path");

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const IndexRouter = require("./routers/IndexRouter");
const AuthRouter = require("./routers/AuthRouter");
const UserRouter = require("./routers/UserRouter");
const ErrorRouter = require("./routers/ErrorRouter");
const LocationRouter = require("./routers/LocationRouter");
const AdminRouter = require("./routers/AdminRouter");
const ProfileRouter = require("./routers/ProfileRouter");
const DataRouter = require("./routers/DataRouter");
const TicketRouter = require("./routers/TicketRouter");

class CovidHealthTracker extends express {
  constructor(database, configuration) {
    super();

    // Database
    this.database = database;

    // Port
    this.set("port", configuration.PORT);

    // Middleware
    this.use(cors());
    this.use(logger("dev"));
    this.use(express.json());
    this.use(express.urlencoded({ extended: false }));
    this.use(cookieParser());
    this.use(express.static(path.join(__dirname, "..", "public")));

    // Routers
    this.use("/auth", new AuthRouter(database, configuration));
    this.use("/user", new UserRouter(database));
    this.use("/location", new LocationRouter(configuration));
    this.use("/admin", new AdminRouter(database));
    this.use("/profile", new ProfileRouter(database));
    this.use("/data", new DataRouter());
    this.use("/tickets", new TicketRouter(database));
    this.use("*", new IndexRouter());
    this.use(new ErrorRouter(configuration));
  }
}

module.exports = CovidHealthTracker;
