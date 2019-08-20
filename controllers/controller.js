var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScrapper", { useNewUrlParser: true });

// Require all models
var db = require("../models");

module.exports = function (app) {

    var articles = []
    // Root get route
    app.get("/", function (req, res) {

        axios.get("https://www.npr.org/sections/news/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, find the articles
            $("article").each(function (i, element) {
                // Save an empty result object
                var result = {};
                var summary = $(this).find("p.teaser").find("a").text()
                summary = summary.split("• ")
                var link = $(this).find("h2").find("a").attr("href");               

                result.title = $(this)
                    .find("h2").find("a")
                    .text();
                result.summary = summary[1];
                result.link = link; 
                result.date_published = $(this)
                    .find("time")
                    .attr("datetime");

                

                if (result.link && result.summary && result.title) {
                    //Get article id from the link
                    var linkParts = link.split("/")
                    result.id = linkParts[linkParts.length-2];
                    
                    articles.push(result)

                }
            });
     
        }).then(function () {
            res.render("index", { articles: articles, source: "scrape" })
        })
    });
    app.get("/articles", function (req, res) {

        db.Article.find({}).then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client

            dbArticle.forEach(function(article){
                article.source = "db";
            })
            
            res.render("partials/articlesPartial", {articles: dbArticle,source1: "db"});
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });

    });

    // Save an article
    app.post("/articles/:id", function (req, res) {

        // Find the article in the array based on the id
        var id = req.params.id
        const article = articles.find( article => article.id === id );
        
        // Save new record using the article
        db.Article.create(article)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                res.json({"success": true})
            })
            .catch(function (err) {
                // Suppress duplicate errors 
                if (err.code !== 11000) {
                    console.log(err);
                }
            });
    })

}
