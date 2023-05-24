const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Server started on port 3000!"));

process.on("SIGINT", () => {
  console.log("sigint");
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    console.log("Process terminated");
    shutdownDB();
  });
});

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

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${numClients}, datetime('now'))
  `);

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

// end websockets

// Begin Database
const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`CREATE TABLE visitors (
    count INTEGER,
    time TEXT

  )`);
});

function getCounts() {
  db.each(`SELECT * FROM visitors`, (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();
  console.log("Shutting down, goodbye!");
  db.close();
}
