# News Scraper
News Scrapping app

This application was designed to reinforce MongoDB skills and data scraping with Axios and Cheerio. The application allows users to view current news stories, save stories of interest, and add/delete comments about the stories.

Visit: https://whats-new-scraper.herokuapp.com"

# Technology
<ul>    
    <li>Axios - https://www.npmjs.com/package/axios</li>
    <li>Bootstrap - https://getbootstrap.com/docs/4.3/getting-started/introduction/</li>
    <li>Cheerio - https://cheerio.js.org</li>
    <li>Express - https://www.npmjs.com/package/express</li>
    <li>Handlebars - http://handlebarsjs.com/</li>
    <li>MongoDB - https://www.mongodb.com</li>    
    <li>Mongoose - https://mongoosejs.com</li>    
</ul>

# Requirements
# All the News That's Fit to Scrape

### Overview

In this assignment, you'll create a web app that lets users view and leave comments on the latest news. But you're not going to actually write any articles; instead, you'll flex your Mongoose and Cheerio muscles to scrape news from another site.

* Create an app that accomplishes the following:

  1. Whenever a user visits your site, the app should scrape stories from a news outlet of your choice and display them for the user. Each scraped article should be saved to your application database. The app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

  2. Users should also be able to leave comments on the articles displayed and revisit them later. The comments should be saved to the database as well and associated with their articles. Users should also be able to delete comments left on articles. All stored comments should be visible to every user.
