var express = require("express");
let app = express();
let http = require("http");
let socketIO = require("socket.io");
var path = require("path");
const { exec } = require("child_process");

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/../public/index.html"));
});

let server = http.Server(app);
server.listen(3000);

let io = socketIO(server);

io.on("connection", function (socket) {
  socket.on("client-connected", function (message) {
    console.log(message);
  });

  socket.on("client-command", function (command) {
    console.log(command.data);
    exec(String(command.data), (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return; 
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      socket.emit("command-response", { data: stdout });
      console.log(`stdout: ${stdout}`);
    });
  });
});
