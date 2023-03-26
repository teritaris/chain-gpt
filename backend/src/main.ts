import { Config as C, logger } from "./init";
import express from "express";
import cors from "cors";
import "dotenv/config";
import {chat} from "./routes/chat";

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
  res.json({ j: "<●>_<●>" });
});

app.use('/chat', chat);

app.use(express.static('frontend'));