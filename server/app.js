import express from "express";
import { dbConnection } from "./database/dbconnection.js";
// import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js"
// import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import http from 'http';  // To create HTTP server
import { WebSocketServer } from 'ws';




const app = express();
config({ path: "./.env" }); 

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    // Handle messages from Redis PubSub
    ws.on('message', (message) => {
        console.log('Received message: ', message);
    });
});

// Attach WebSocket server to HTTP server (for the 'upgrade' event)
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use('/api/v1/schemes', schemeRoutes);

// app.use("/api/v1/job", jobRouter);
// app.use("/api/v1/application", applicationRouter);
dbConnection();

app.use(errorMiddleware);
export default app;
