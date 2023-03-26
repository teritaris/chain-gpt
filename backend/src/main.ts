import { Config as C, logger } from "./init";
import express from "express";
import cors from "cors";
import "dotenv/config";
import {chat} from "./routes/chat";
import * as path from "path"

// とりあえず落ちないようにする
process.on('uncaughtException', function(err) {
  console.log(err);
});

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());
app.listen(C.conf.web.port, C.conf.web.listen, () => {
  logger.info(`Server ready at: http://${C.conf.web.listen}:${C.conf.web.port}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../frontend/index.html"))
});
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../frontend/ask/chat.html"))
});
app.get("/training", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../frontend/personality/setting.html"))
});

app.use('/chat', chat);

// 画像読むのに必要
app.use(express.static('../frontend'));