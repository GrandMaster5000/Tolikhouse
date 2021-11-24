import express from "express";
import { Code, User } from "../../models";
import axios from "axios";
import { randomCode } from "../../utils/generateRandomCode";

class AuthController {
  getMe(req: express.Request, res: express.Response) {
    res.json(req.user);
  }

  authCallback(req: express.Request, res: express.Response) {
    res.send(
      `<script>window.opener.postMessage('${JSON.stringify(
        req.user
      )}', '*');window.close();</script>`
    );
  }

  async activate(req: express.Request, res: express.Response) {
    const userId = req.user.id;
    const smsCode = req.query.code;

    if (!smsCode) {
      return res.status(400).json({
        message: "Enter activation code",
      });
    }

    const whereQuery = { code: smsCode, user_id: userId };

    try {
      const findCode = await Code.findOne({
        where: whereQuery,
      });

      if (findCode) {
        await Code.destroy({
          where: whereQuery,
        });

        await User.update({ isActivate: 1 }, { where: { id: userId } });

        return res.send();
      } else {
        res.status(400).json({
          message: "Code not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        message: "Error activate account",
      });
    }
  }

  async sendSMS(req: express.Request, res: express.Response) {
    const phone = req.query.phone;
    const userId = req.user.id;
    const smsCode = randomCode();

    if (!phone) {
      return res.status(400).json({
        message: "Phone number not specified",
      });
    }

    try {
      // axios.get(
      //   `https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=79996321474,74993221627&msg=${smsCode}`
      // );

      const findCode = await Code.findOne({
        where: {
          user_id: userId,
        },
      });

      if (findCode) {
        return res.status(400).json({ message: "Сode has already been sent" });
      }

      await Code.create({
        code: smsCode,
        user_id: userId,
      });

      res.status(201).send();
    } catch (e) {
      res.status(500).json({
        message: "Error when sending SMS",
      });
    }
  }
}

export default new AuthController();
