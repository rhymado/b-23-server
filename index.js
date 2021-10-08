const app = require("express")();
const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidV4 } = require("uuid");
const jwt = require("jsonwebtoken");

const httpServer = createServer(app);
const cors = {
  origin: ["http://localhost:3000"],
};
const io = new Server(httpServer, {
  cors,
});
// const io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
  // console.log("[DEBUG] SOCKET QUERY", socket.handshake.query.id);
  if (socket.handshake.query.id) {
    socket.join(socket.handshake.query.id);
  }
  socket.on("send_login_form", (body, callback) => {
    // console.log("[DEBUG] BODY", body);
    callback({
      status: "OK",
      msg: "Body sudah diterima",
    });
    setTimeout(() => {
      const newBody = {
        ...body,
        id: uuidV4(),
        token: jwt.sign(body, "SECRET_KEY", { expiresIn: "5h" }),
      };
      socket.broadcast.emit("process_done", newBody);
    }, 1000);
  });
  socket.on("send_message", (payload) => {
    socket.to(payload.receiver).emit("send_message_to_receiver", {
      msg: "Hello",
    });
  });
});

httpServer.listen(8000, () => {
  console.log("Server is on");
});

app.get("/", (_, res) => {
  res.json({
    msg: "Hello World",
  });
});

module.exports = io;
