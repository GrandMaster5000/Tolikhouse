import express from "express";
import { Room } from "../../models";
import axios from "axios";
import { randomCode } from "../../utils/generateRandomCode";

class RoomController {
  async index(req: express.Request, res: express.Response) {
    try {
      const items = await Room.findAll();
      res.json(items);
    } catch (e) {
      res.status(500).json({ message: "Error", e });
    }
  }

  async create(req: express.Request, res: express.Response) {
    try {
      const data = {
        title: req.body.title,
        type: req.body.type,
      };

      if (!data.title || !data.type) {
        return res.status(404).json({ message: "Missing title or room type" });
      }

      const room = await Room.create(data);
      res.status(201).json(room);
    } catch (e) {
      res.status(500).json({ message: "Error", e });
    }
  }

  async show(req: express.Request, res: express.Response) {
    try {
      const roomId = req.params.id;
      
      if (isNaN(+roomId)) {
        return res.status(404).json({ message: "Wrong room id" });
      }

      const room = await Room.findByPk(roomId);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.json(room);
    } catch (e) {
      res.status(500).json({ message: "Error", e });
    }
  }

  async delete(req: express.Request, res: express.Response) {
    try {
      const roomId = req.params.id;
      
      if (isNaN(+roomId)) {
        return res.status(404).json({ message: "Wrong room id" });
      }

      await Room.destroy({
        where: { id: roomId }
      });
      
     

      res.send();
    } catch (e) {
      res.status(500).json({ message: "Error", e });
    }
  }
}

export default new RoomController();
