const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Server started on port 3000!"));

// Begin Websocket server
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log(`Client connected. Total clients: ${numClients}`);

  wss.broadcast(`A new client joined. Total clients: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on("close", () => {
    console.log("Client disconnected");
    wss.broadcast(`A client left. Total clients: ${numClients}`);
  });
});

wss.broadcast = function broadcast(msg) {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};
