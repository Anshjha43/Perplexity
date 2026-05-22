import 'dotenv/config';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { app } from "./src/app.js";
import { DB_CONNECTION } from "./src/config/database.js";
import http from "http";
import { initSocket } from './socket.io.js';




const httpServer = http.createServer(app);

initSocket(httpServer);
DB_CONNECTION();
httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT} || 3000`);
});

