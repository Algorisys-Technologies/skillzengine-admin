var async = require('async');
var express = require('express');
var http = require('http');
const path = require("path");
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var crypto = require('crypto');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var app = express();
var secretKey = '08970a0d-8fAA08-1234994-9d6b-1732f7e14942'; 
var routes = require('./routes');
var mdb = require('./db');

mdb.connect('mongodb://localhost:27017','testengine', function (err) {
  if (err) {
    process.exit(1)
  }
  console.log("Mongo Database connected...");
})


// server deployment part start
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// if (environment.production) {
//   app.use(express.static(path.join(__dirname, '../../dist/testengine')));

//   app.use('/routes', routes);
//   app.get('*', (req, res) => {

//     res.sendFile(path.join(__dirname, '../../dist/testengine/index.html'));
//   });
//   app.listen(8080);

//   // server deployment part end
// } else {
  app.use(express.static(__dirname + '/public'));
  app.use('/routes', routes);
  app.listen(3000);
//}

//LOCAL START
// app.use(fileUpload());
// app.use(express.static(__dirname + '/public'));

//  app.use(cors());
//  app.use(bodyParser.json());
//  app.use(bodyParser.urlencoded({ extended: false }));

//  app.use('/routes', routes);

//  //http.createServer(app).listen(3000);
// app.listen(3000);
 

//LOCAL END