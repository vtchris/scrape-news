var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScrapper", { useNewUrlParser: true });

module.exports = function (app) {
    // Root get route
    app.get("/", function (req, res) {

    })
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.nytimes.com/section/world/").then(function (response) {
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
                    .find("p")
                    .text();
                result.link = $(this)
                    .find("h2")
                    .find("a")
                    .attr("href");

                if (result.link && result.summary && result.title) {
                    console.log(result)
                }


                // Create a new Article using the `result` object built from scraping
                // db.Article.create(result)
                //   .then(function(dbArticle) {
                //     // View the added result in the console
                //     console.log(dbArticle);
                //   })
                //   .catch(function(err) {
                //     // If an error occurred, log it
                //     console.log(err);
                //   });
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
    });


}