import express from "express";
import fs from "fs";
import sharp from "sharp";

class UploadController {
  upload(req: express.Request, res: express.Response) {
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
  }
}

export default new UploadController();
