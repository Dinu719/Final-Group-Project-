const express = require("express"); //creating object express from express module
const bodyParser = require('body-parser');
const routes = require("./routes/routes"); //import the routes file
const app = express(); //create app object that has the express methods

app.use(bodyParser.urlencoded({ extended: true })); //parse URL-encoded bodies


require("dotenv").config();

app.set("view engine", "ejs");


app.use('/', routes);
app.use(express.static("public")); //define the path of the folder that allows you to serve static files from the server, from the "public" folder



app.listen(5001);

