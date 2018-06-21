var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models/");

router.get("/", function (req, res) {

  db.Article.find().then(function (articles) {

    res.render("index", {articles: articles});

  })

});

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.lifewithcats.tv/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article.format-standard").each(function(i, element) {
      // Save an empty result object
      var result = {};

      result.link = $(element).find(".alignnone").attr("href");

      if (result.link == undefined) {

        result.link = $(element).find(".aligncenter").attr("href");

      }
      result.title = $(element).find(".entry-title").find("a").text();

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

router.get("/saved", function (req, res) {

  db.Article.find({where: {saved: true}}).then(function (articles) {

    res.render("index", {articles: articles});

  })

});

// Route for saving/updating an Article's associated Note
router.post("/api/togglearticle", function(req, res) {

  console.log(req.body);

  db.Article.findById(req.body.id, function (err, article) {
    if (err) return handleError(err);

    console.log(req.body);
  
    article.saved = req.body.val;
    article.save(function (err, updatedArticle) {
      if (err) return handleError(err);
      res.send(updatedArticle);
    });
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
