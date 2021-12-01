import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { passport } from "./core/passport";
import { uploader } from "./core/uploader";
import AuthController from "./controllers/AuthController";
import UploadController from "./controllers/UploadController";
import RoomController from "./controllers/RoomController";

dotenv.config({
  path: "./server/.env",
});

const app = express();

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
app.get(
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

app.listen(3001, () => {
  console.log("SERVER RUNNED");
});
