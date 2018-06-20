var express = require("express");

var router = express.Router();

var router = express.Router();
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Require all models
var db = require("../models/");

router.get("/", function (req, res) {

  res.render("index");

})

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});
  
// Route for getting all Articles from the db
router.get("/articles", function(req, res) {

  db.Article.find().then(function (result) {

    res.json(result);


  });
  // TODO: Finish the route so it grabs all of the articles
});
  
// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {

  db.Article.findById(req.params.id).populate("note").then(function (result) {

    console.log(result);
    res.json(result);

  }).catch(function(error) {

    res.json(error);
  });
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
});
  
// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {

  db.Note.create(req.body).then(function(dbNote) {

    return db.Article.findOneAndUpdate({_id: req.params.id}, { $set: { note: dbNote._id } }, {new: true});

  })
  .then(function (dbArticle) {

    res.json(dbArticle);

  })
  .catch(function (err) {

    res.json(err);

  })
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// Export routes for server.js to use.
module.exports = router;
