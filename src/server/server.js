var async = require("async");
var express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const path = require("path");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
var cors = require("cors");
var fileUpload = require("express-fileupload");
var app = express();

const server = http.createServer(app);
const io = socketIo(server);

var secretKey = "08970a0d-8fAA08-1234994-9d6b-1732f7e14942";
var routes = require("./routes");
var mdb = require("./db");

mdb.connect("mongodb://localhost:27017", "testengine", function (err) {
  if (err) {
    process.exit(1);
  }
  console.log("Mongo Database connected...");
});

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
app.use(express.static(__dirname + "/public"));
app.use("/routes", routes);

// Socket.io event handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("offer", (data) => {
    console.log("Received offer from:", data.id);
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    console.log("Received answer from:", data.id);
    socket.broadcast.emit("answer", data);
  });

  socket.on("candidate", (data) => {
    console.log("Received ICE candidate from:", data.id);
    socket.broadcast.emit("candidate", data);
  });

  socket.on("joinRoom", (data) => {
    socket.join(data.room);
    console.log(`Client joined room: ${data.room}`);
  });
});

//app.listen(3000);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
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
