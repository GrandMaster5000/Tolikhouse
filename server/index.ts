import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import sharp from "sharp";
import { nanoid } from "nanoid";
import fs from "fs";
import { passport } from "./core/passport";
import { Code } from "../models";
import { UserData } from "../pages";
import axios from "axios";

declare global {
  namespace Express {
    interface User extends UserData {}
  }
}

dotenv.config({
  path: "./server/.env",
});

const app = express();
const uploader = multer({
  storage: multer.diskStorage({
    destination: function (_, __, cb) {
      cb(null, "public/avatars");
    },
    filename: function (_, file, cb) {
      cb(
        null,
        file.fieldname +
          "-" +
          nanoid(6) +
          "." +
          file.originalname.split(".").pop()
      );
    },
  }),
});
const randomCode = (max: number = 9999, min: number = 1000) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user
      )}', '*');window.close();</script>`
    );
  }
);

app.get(
  "/auth/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

app.post(
  "/auth/sms/activate",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.user.id;
    const smsCode = req.query.code;

    if (!smsCode) {
      return res.status(400).send();
    }

    const whereQuery = { code: smsCode, userId: userId };

    try {
      const findCode = await Code.findOne({
        where: whereQuery,
      });

      if (findCode) {
        await Code.destroy({
          where: whereQuery,
        });
        //TODO: Activate user isActive = 1
        return res.send();
      } else {
        throw new Error("User not found");
      }
    } catch (e) {
      res.status(500).json({
        message: "Error activate account",
      });
    }
  }
);

app.post(
  "/auth/sms",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const phone = req.body.phone;
    const userId = req.user.id;
    const smsCode = randomCode();

    if (!phone) {
      return res.status(400).send();
    }

    try {
      // const data = axios.get(
      //   `https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=79996321474,74993221627&msg=${smsCode}`
      // );

      await Code.create({
        code: smsCode,
        uder_id: userId,
      });

      res.status(201).send();
    } catch (e) {
      res.status(500).json({
        message: "Error when sending SMS",
      });
    }
  }
);

app.post("/upload", uploader.single("photo"), (req, res) => {
  const filePath = req.file.path;
  const filePathSplit = filePath.split(".");
  const fileFormat = filePathSplit[filePathSplit.length - 1];

  if (fileFormat === "png") {
    sharp(filePath)
      .resize(150, 150)
      .toFormat("jpeg")
      .toFile(filePath.replace(".png", ".jpeg"), (err) => {
        if (err) {
          throw err;
        }

        fs.unlinkSync(filePath);

        res.json({
          url: `/avatars/${req.file.filename.replace(".png", ".jpeg")}`,
        });
      });
  } else {
    res.json({
      url: `/avatars/${req.file.filename}`,
    });
  }
});

app.listen(3001, () => {
  console.log("SERVER RUNNED");
});
