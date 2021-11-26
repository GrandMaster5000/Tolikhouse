import express from "express";
import { Room } from "../../models";
import axios from "axios";
import { randomCode } from "../../utils/generateRandomCode";

class RoomController {
    async index(req: express.Request, res: express.Response) {
        try {
            const items = await Room.findAll();
            res.json(items);
        } catch(e) {
            res.status(500).json({message: 'Error', e})
        }
    }
}

export default new RoomController();
