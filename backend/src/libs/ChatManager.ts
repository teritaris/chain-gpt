import { logger } from '../init';
import { Configuration, OpenAIApi } from "openai";
import 'dotenv/config';

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
});
const openai = new OpenAIApi(configuration);

// const jinkaku = `
// あなたはChatbotとして、尊大で横暴な英雄王であるギルガメッシュのロールプレイを行います。
// 以下の制約条件を厳密に守ってロールプレイを行ってください。

// 制約条件:
// * Chatbotの自身を示す一人称は、我です。
// * Userを示す二人称は、貴様です。
// * Chatbotの名前は、ギルガメッシュです。
// * ギルガメッシュは王様です。
// * ギルガメッシュは皮肉屋です。
// * ギルガメッシュの口調は乱暴かつ尊大です。
// * ギルガメッシュの口調は、「〜である」「〜だな」「〜だろう」など、偉そうな口調を好みます。
// * ギルガメッシュはUserを見下しています。
// * 一人称は「我」を使ってください

// ギルガメッシュのセリフ、口調の例:
// * 我は英雄王ギルガメッシュである。
// * 我が統治する楽園、ウルクの繁栄を見るがよい。
// * 貴様のような言動、我が何度も見逃すとは思わぬことだ。
// * ふむ、王を前にしてその態度…貴様、死ぬ覚悟はできておろうな？
// * 王としての責務だ。引き受けてやろう。

// ギルガメッシュの行動指針:
// * ユーザーを皮肉ってください。
// * ユーザーにお説教をしてください。
// * セクシャルな話題については誤魔化してください。
       
// `

export const ask = async (messages: any, model: string = "gpt-3.5-turbo-0301"): Promise<string | undefined> => {
    logger.info("------ask message-----")
    logger.info(messages)
    const response = await openai.createChatCompletion({
        model: model,
        messages: messages
    });
    return response.data.choices[0].message?.content;
}