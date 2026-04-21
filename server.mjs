import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((req, res) => {
  handle(req, res);
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

globalThis._io = io;

io.on("connection", (socket) => {
//   console.log("socket connected:", socket.id);

  socket.on("join-notifications", (userId) => {
    if (!userId) return;
    socket.join(`user:${userId}`);
    // console.log(`user ${userId} joined room user:${userId}`);
  });

  socket.on("leave-notifications", (userId) => {
    if (!userId) return;
    socket.leave(`user:${userId}`);
  });

  socket.on("disconnect", () => {
    // console.log("socket disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`> Ready on http://${hostname}:${port}`);
});