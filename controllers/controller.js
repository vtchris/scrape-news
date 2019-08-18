var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScrapper", { useNewUrlParser: true });

// Require all models
var db = require("../models");

module.exports = function (app) {
    // Root get route
    app.get("/", function (req, res) {

        var articles = []

        axios.get("https://www.npr.org/sections/news/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            
            
            // Now, find the articles
            $("article").each(function (i, element) {
                // Save an empty result object
                var result = {};
                var summary = $(this).find("p.teaser").find("a").text()
                summary = summary.split("• ")
               
                result.title = $(this)
                    .find("h2").find("a")
                    .text();
                result.summary = summary[1]
                result.link = $(this)
                    .find("h2")
                    .find("a")
                    .attr("href");
                result.date_published = $(this)
                    .find("time")
                    .attr("datetime")

                if (result.link && result.summary && result.title) {
                    articles.push(result)

                }
            });

            // Send a message to the client 
       
            //res.send("Scrape Complete");
        }).then(function(){
            res.render("index",{articles: articles})
        })
        

    });




    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        //axios.get("https://www.nytimes.com/section/world/").then(function (response) {
        axios.get("https://www.npr.org/sections/news/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, find the articles
            $("article").each(function (i, element) {
                // Save an empty result object
                var result = {};

                result.title = $(this)
                    .find("h2").find("a")
                    .text();
                result.summary = $(this)
                    .find("p.teaser")
                    .find("a")
                    .text();
                result.link = $(this)
                    .find("h2")
                    .find("a")
                    .attr("href");
                result.date_published = $(this)
                    .find("time")
                    .attr("datetime")

                if (result.link && result.summary && result.title) {

                    //Create a new Article using the `result` object built from scraping
                    db.Article.create(result)
                        .then(function (dbArticle) {
                            // View the added result in the console
                            console.log(dbArticle);
                        })
                        .catch(function (err) {
                            if (err.code !== 11000) {
                                console.log(err);
                            }
                        });
                }
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
    });


}