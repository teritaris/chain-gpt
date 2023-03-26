import { Config as C, logger } from '../init';
import express from "express";
import {ask} from "../libs/ChatManager";
import { getPersonalityDefineFullString } from '../libs/TransactionParser';

export const chat = express.Router();
chat.use(express.json());

chat.route('/ask').get(async (req: express.Request, res: express.Response) => {
    try {
        const prompt: string = req.query.prompt as string;
        logger.info(prompt, "PROMPT");
        const personality: string = await getPersonalityDefineFullString();
        const messages: any = [
                { role: "system", content: personality},
                { role: "user", content: prompt},
            ];
        const askRes: string = await ask(messages) as string;
        res.send({response: askRes})
    } catch (error) {
        res.status(501).send({ error: 'Impl error' });
        logger.error(error);
    }
    res.end();
});

export default chat;