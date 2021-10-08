const app = require("express")();
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const cors = {
  origin: ["http://localhost:3000"],
};
const io = new Server(httpServer, {
  cors,
});
// const io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
  console.log("[DEBUG] SOCKET ID", socket.id);
  socket.on("send_login_form", (body, callback) => {
    console.log("[DEBUG] BODY", body);
    callback({
      status: "OK",
      msg: "Body sudah diterima",
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
