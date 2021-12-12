import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from 'socket.io'

import { passport } from "./core/passport";
import { uploader } from "./core/uploader";
import AuthController from "./controllers/AuthController";
import UploadController from "./controllers/UploadController";
import RoomController from "./controllers/RoomController";
import { createServer } from 'http';
import { SocketRoom } from '../utils/getUsersFromRoom';

dotenv.config({
  path: "./server/.env",
});

const app = express();
const server =  createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const rooms: SocketRoom = {};

io.on('connection', socket => {
  console.log('connection SOCKET');

  socket.on('CLIENT@ROOMS:JOIN', ({user, roomId}) => {
    socket.join(`room/${roomId}`);
    rooms[socket.id] = { roomId, user };
    socket.to(`room/${roomId}`).emit(
      'SERVER@ROOMS:JOIN',
      Object.values(rooms).filter(obj => obj.roomId === roomId)
      .map((obj) => obj.user)
    );
  })

  socket.on('disconnect', () => {
    if (rooms[socket.id]) {
      const { roomId, user } = rooms[socket.id]
      io.to(`room/${roomId}`).emit('SERVER@ROOMS:LEAVE', user);
      delete rooms[socket.id];
    }
  })
})

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get(
  "/rooms",
  passport.authenticate("jwt", { session: false }),
  RoomController.index
);
app.post(
  "/rooms",
  passport.authenticate("jwt", { session: false }),
  RoomController.create
);
app.get(
  "/rooms/:id",
  passport.authenticate("jwt", { session: false }),
  RoomController.show
);
app.delete(
  "/rooms/:id",
  passport.authenticate("jwt", { session: false }),
  RoomController.delete
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  AuthController.authCallback
);
app.get(
  "/auth/me",
  passport.authenticate("jwt", { session: false }),
  AuthController.getMe
);
app.post(
  "/auth/sms/activate",
  passport.authenticate("jwt", { session: false }),
  AuthController.activate
);
app.get(
  "/auth/sms",
  passport.authenticate("jwt", { session: false }),
  AuthController.sendSMS
);

app.post("/upload", uploader.single("photo"), UploadController.upload);

server.listen(3001, () => {
  console.log("SERVER RUNNED");
});
