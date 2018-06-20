var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// var axios = require("axios");
// var cheerio = require("cheerio");

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/catscrap");

// var db = require("./models");

var PORT = 3000;

var routes = require("./controllers/indexController.js");

app.use(routes);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  