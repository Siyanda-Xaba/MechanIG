import app from "./app.js";
import http from "node:http";
import { Server } from "socket.io";
import registerTrackingSockets from "./sockets/trackingSockets.js";

const PORT = Number(process.env.PORT) || 5001;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN
      .split(",")
      .map((origin) => origin.trim())
  : true;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
  },
});

registerTrackingSockets(io);

server.listen(PORT, () => {
  console.log(
    `MechanIQ backend running on http://localhost:${PORT}`
  );
});