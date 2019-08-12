// Import express
let express = require('express');
const path = require('path');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
let cors = require('cors');
// Initialize the app
let app = express();

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

