const express = require("express"); //creating object express from express module
const bodyParser = require('body-parser');
const routes = require("./routes/routes"); //import the routes file
const app = express(); //create app object that has the express methods

app.use(bodyParser.urlencoded({ extended: true })); //parse URL-encoded bodies


require("dotenv").config();

app.set("view engine", "ejs");


app.use('/', routes);
app.use(express.static("public")); //define the path of the folder that allows you to serve static files from the server, from the "public" folder

app.post('/create', async (req, res)  => {
    const {fullName, email, phoneN, password} = req.body;

    try{
        console.log("Recieved a request to /create");
        console.log ("Request Body: ", req.body);

        const hashedPassword = await bcrypt.hash (password, 10);
        console.log(" Hashed Password:", hashedPassword);

        await insertUser (fullName, email, phoneN, password);
        res.redirect("/");

    }
    catch(error){
        console.error ("X Error: ", error);
        res.status(500).send("X Error: " + error.message);

    }
});

const{insertUser} = require('.models/queries');

app.listen(5001);

