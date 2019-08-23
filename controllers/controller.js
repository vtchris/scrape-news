var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper"

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Require all models
var db = require("../models");

module.exports = function (app) {

    var articles = []
    // Root get route
    app.get("/", function (req, res) {

        axios.get("https://www.npr.org/sections/news/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            let savedArticles = []

            db.Article.find({}).then(function (saved) {
                savedArticles = saved.map(x => x.link);
                //console.log(savedArticles)
            }).then(function () {

                // Now, find the articles
                $("article").each(function (i, element) {
                    // Save an empty result object
                    var result = {};
                    var summary = $(this).find("p.teaser").find("a").text()
                    summary = summary.split("• ")
                    var link = $(this).find("h2").find("a").attr("href");

                    //Do not scrape duplicate articles
                    if (articles.find(x => x.link === link) === undefined && savedArticles.find(x => x === link) === undefined) {

                        result.title = $(this)
                            .find("h2").find("a")
                            .text();
                        result.summary = summary[1];
                        result.link = link;
                        result.date_published = $(this)
                            .find("time")
                            .attr("datetime");
                        result.source = "scrape";

                        if (result.link && result.summary && result.title) {
                            //Get article id from the link
                            var linkParts = link.split("/")
                            result.id = linkParts[linkParts.length - 2];

                            articles.push(result);

                        }
                    }
                });

            }).then(function () {
                res.render("index", { articles: articles })
            })
        })
    });
    app.get("/articles", function (req, res) {

        db.Article.find({}).then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client

            dbArticle.forEach(function (article) {
                article.source = "db";
            })

            res.render("partials/savedArticlesPartial", { articles: dbArticle });
        })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });
    // Save an article
    app.post("/articles/:id", function (req, res) {

        // Find the article in the array based on the id
        var id = req.params.id;
        const article = articles.find(article => article.id === id);

        // Save new record using the article
        db.Article.create(article)
            .then(function (dbArticle) {
                // View the added result in the console
                //console.log(dbArticle);
                res.json({ "success": true })
            })
            .catch(function (err) {
                // Suppress duplicate errors 
                if (err.code !== 11000) {
                    console.log(err);
                }
            });
    })
    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
    // Save an article
    app.delete("/articles/:id", function (req, res) {
        
        const articleId = req.params.id
        console.log(articleId)

        db.Note.deleteMany({"articleId": articleId})
        .then(function(){
            db.Article.deleteOne({"_id": articleId})
            .then(function(){
                res.status(200).end()
            })
        })
        .then(function(){            
            res.status(200).end()
        })
    })
    // Save a note
    app.post("/notes/:articleId", function (req, res) {

        const id = req.params.articleId
        const data = req.body

        db.Note.create(data)
            .then(function (dbNote) {
                // Add note reference to the appropriate article record 
                return db.Article.findOneAndUpdate({ _id: id }, { $push: { note: dbNote._id } }, { new: true });
            })
            .then(function (dbNote) {
                // View the added result in the console
                //console.log(dbNote);
                res.json({ "success": true })
            })
            .catch(function (err) {

                console.log(err);

            });
    })
    app.delete("/notes/:noteId", function (req, res) {

        // Remove a note using the objectID
        db.Note.findByIdAndRemove(
            req.params.noteId,
            function (error, removed) {
                // Log any errors from mongojs
                if (error) {
                    console.log(error);
                    res.send(error);
                }
                else {
                    // Otherwise, send the mongojs response to the browser
                    // This will fire off the success function of the ajax request

                    //console.log(removed);
                    //console.log(removed.articleId)
                    //console.log(removed._id)
                    db.Article.findOneAndUpdate({ _id: removed.articleId }, { $pull: { note: removed._id } }).then(function (resp) {

                        //console.log(resp)

                    }).then(function () {
                        console.log("Sending Response")
                        res.send(removed);
                    }).catch(function (err) {

                        console.log(err);

                    });
                }
            }
        )
    })
}
