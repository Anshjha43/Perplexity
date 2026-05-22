import { Server } from "socket.io";

let io;

export function initSocket(httpserver) {
  io = new Server(httpserver, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected" + socket.id);
    });
  });
}

export { io };
