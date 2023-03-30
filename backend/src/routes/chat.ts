import { Config as C, logger } from '../init';
import express from "express";
import { ask } from "../libs/ChatManager";
import { getPersonalityDefineFullString } from '../libs/TransactionParser';
import { HistoryAskRequestBody, InclusiveHistoryMessage } from '../../types';

export const chat = express.Router();
chat.use(express.json());

chat.route('/ask').get(async (req: express.Request, res: express.Response) => {
    try {
        const prompt: string = req.query.prompt as string;
        logger.info(prompt, "prompt");
        const personality: string = await getPersonalityDefineFullString();
        const messages: InclusiveHistoryMessage[] = [
            { role: "system", content: personality },
            { role: "user", content: prompt },
        ];
        logger.info("-----askMessage-----")
        logger.info(messages);
        const askRes: string = await ask(messages) as string;
        logger.info("-----askRes-----")
        logger.info(askRes);
        res.send({ response: askRes })
    } catch (error) {
        res.status(501).send({ error: 'Impl error' });
        logger.error(error);
    }
    res.end();
});

chat.route('/history-ask').post(async (req: express.Request, res: express.Response) => {
    try {
        const body: HistoryAskRequestBody = req.body;
        const messageHistory: InclusiveHistoryMessage[] = body.messageHistory;
        const prompt: string = body.prompt;

        // 履歴件数のチェック
        // 20件以上ある場合は最新の20件になるように古いのを消す
        const prevMessages: InclusiveHistoryMessage[] = messageHistory.slice(1).slice(-20);

        const personality: string = await getPersonalityDefineFullString();
        const messages: InclusiveHistoryMessage[] = [
            { role: "system", content: personality },
            ...prevMessages,
            { role: "user", content: prompt },
        ];

        logger.info("-----historyAskMessage-----");
        logger.info(messages);
        const askRes: string = await ask(messages) as string;
        logger.info("-----historyAskRes-----");
        logger.info(askRes);
        res.send({ response: askRes })
    } catch (error) {
        res.status(501).send({ error: 'Impl error' });
        logger.error(error);
    }
    res.end();
});

export default chat;
