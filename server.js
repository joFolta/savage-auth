// TO DO
// 1) add thumbs down
// 2) USE OWN DATABASE

// ======================================================================

// x1 database
// x2 collections
// one collection for USERS (username, passwords)
// one collection for MESSAGES (messages, thumbsCount)

//API no longer inside Server.JS
// API in app/routes.js

// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
// port use environmental port OR 8080
var port     = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient
//mongoose to interact with DB (list of methods)
var mongoose = require('mongoose');
//authentication = passport (encription, passwords, username)
var passport = require('passport');
//flash for errors ("wrong password", "already existing user")
var flash    = require('connect-flash');
//morgan, server LOGGER onto terminal (GETS/POSTS/404's/TIME)
var morgan       = require('morgan');
//cookieParser, puts cookies on machine, to keep track of who you are and don't need to log in again.
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
//keeps track of your session, you don't have to keep signing in when changing pages
var session      = require('express-session');
//configDB, to keep mongoDB password hidden
//configDB
// .gitignore, put CONFIG here
var configDB = require('./config/database.js');

var db

// configuration ===============================================================
// configDB object and url property
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  // we are requiring a function
  // ./app/routes.js is function
  // (app, passport, db) are parameters
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

//app.listen(port, () => {
    // MongoClient.connect(configDB.url, { useNewUrlParser: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(configDB.dbName);
    //     console.log("Connected to `" + configDB.dbName + "`!");
    //     require('./app/routes.js')(app, passport, db);
    // });
//});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

//MVC, model view controller
app.set('view engine', 'ejs'); // set up ejs for templating


// required for passport
app.use(session({
    secret: 'rcbootcamp2019a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
