import express from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import * as Log4js from "log4js";

const logger = Log4js.configure('logger.json').getLogger("default");
export const admin = express.Router();
admin.use(express.json());

export const jwtSecret = "nakao-secretttttttttttttt";

// $ curl localhost:3333/token  | curl -v -X GET http://localhost:3333/admin/state -H "Authorization: Bearer $(jq '.token' | sed -e 's/\"//g')"
admin.use(
    expressjwt({ secret: jwtSecret, algorithms: ["HS256"] }), (req: JWTRequest, res: express.Response, next) => {
        // ここでtoken確認。
        logger.info(req.auth);
        if (!req.auth?.admin) return res.sendStatus(401);
        next();
    }
);

admin.route('/state').get((req: JWTRequest, res: express.Response) => {
    res.json({ message: 'OK Token', req: req.auth });
    res.end();
});


// export class admin;