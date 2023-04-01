import express from "express";
import bodyParser, { json } from "body-parser";
import cors from "cors";
import multer, { diskStorage } from "multer";
import fs from "fs";

import { exec } from "child_process";
import { join } from "path";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(join(__dirname, "static")));
app.use(express.static(__dirname + "/public"));

const upload = multer({ dest: "data/" });

app.get("/script_file", (req, res) => {
  exec(join(__dirname, "main.sh"), (error, stdout, stderr) => {
    if (error) {
      return res.status(400).json({ output: null, error: error.message });
    }

    res.status(200).json({ output: stdout, error: null });
  });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json("No file");

  const uploadedFile = req.file;

  const file = {
    filename: uploadedFile.originalname,
    size: uploadedFile.size,
    type: uploadedFile.mimetype,
    favorite: 0,
    dateaccess: new Date(),
  };

  const data = JSON.stringify(file);
  fs.writeFileSync("data.json", data);

  return res.status(200).send(file);
});

app.listen(port, () => console.log(`Server Running on port ${port}`));
