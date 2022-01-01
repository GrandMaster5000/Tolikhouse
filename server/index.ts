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
import { getUsersFromRoom, SocketRoom } from '../utils/getUsersFromRoom';
import { Room } from '../models'

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
    const speakers = getUsersFromRoom(rooms, roomId);
    io.emit('SERVER@ROOMS:HOME', { roomId: +roomId, speakers });
    io.in(`room/${roomId}`).emit('SERVER@ROOMS:JOIN', speakers);
    Room.update({ speakers }, { where: { id: roomId } });
  });

  socket.on('CLIENT@ROOMS:CALL', ({targetUserId, callerUserId, roomId, signal}) => {
    socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:CALL', {
      targetUserId,
      callerUserId,
      signal
    });
  });

  socket.on('CLIENT@ROOMS:ANSWER', ({ targetUserId, callerUserId, roomId, signal}) => {
    socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:ANSWER', {
      targetUserId,
      callerUserId,
      signal
    });
  })

  socket.on('disconnect', () => {
    console.log('USERS:' + rooms);
    if (rooms[socket.id]) {
      const { roomId, user } = rooms[socket.id];
      socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:LEAVE', user);
      delete rooms[socket.id];
      const speakers = getUsersFromRoom(rooms, roomId);
      socket.emit('SERVER@ROOMS:HOME', { roomId: Number(roomId), speakers });
      Room.update({ speakers }, { where: { id: roomId } });
    }
  });


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
