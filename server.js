//dependencies

var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");


var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

// Routes
require("./controllers/controller.js")(app);


app.listen(PORT, function(){
    console.log(`Listening on port: ${PORT}`);
})