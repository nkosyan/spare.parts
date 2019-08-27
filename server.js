// Import express
let express = require('express');
const path = require('path');
// Import Body parser
let bodyParser = require('body-parser');

let jwt = require('jsonwebtoken');
let config = require('./config');
let middleware = require('./middleware');

// Import Mongoose
let mongoose = require('mongoose');
let cors = require('cors');

class HandlerGenerator {
  login (req, res) {
    console.log(111111111111111111111111111)
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({username: username},
          config.secret,
          { expiresIn: '24h' // expires in 24 hours
          }
        );
        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      } else {
        res.sendStatus(403).json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } else {
      res.sendStatus(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
      });
    }
  }
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}

// Starting point of the server
function main () {
// Initialize the app
  let app = express();
  let handlers = new HandlerGenerator();
  /*Adds the react production build to serve react requests*/
  app.use(express.static(path.join(__dirname, "client", "build")))
// /*React root*/
  app.use(cors());
// Import routes
  let apiRoutes = require("./api-routes");
// Configure bodyparser to handle post requests
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect(process.env.MONGODB_URI ||  'mongodb://localhost/spare-parts');
var db = mongoose.connection;
// Setup server port
  var port = process.env.PORT || 8080;
  console.log(process.env, 777)

  // Routes & Handlers
  app.post('/api/login', handlers.login);
  app.get('/', middleware.checkToken, handlers.index);

// Send message for default URL
  app.get('/', (req, res) => res.send('Hello World with Express and Nodemon'));
// Use Api routes in the App
  app.use('/api', apiRoutes);
// Launch app to listen to specified port
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
  app.listen(port, function () {
    console.log("Running RestHub on port " + port);
  });
}

// Starting point of the server
main();

