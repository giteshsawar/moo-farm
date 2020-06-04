const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const https = require("https");

const port = 3001;
const globalPath = process.cwd();
const { corsConfig } = require("./config/cors");

// creating server
const app = express();
const server = http.createServer(app);

app.use(cors(corsConfig));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

/**
 * Initialize Database
 */
const mongoPath = require("./config/db");
mongoose.connect(mongoPath.url, { useNewUrlParser: true });
const db = mongoose.connection;
const schema = require(path.resolve(globalPath, "schema"));

const appRouter = require(path.resolve(globalPath, "routes"));
app.use("/", appRouter);

// start listening for requests on specifc port
server.listen(port, () => {
  console.log("server running on port", port);
});
