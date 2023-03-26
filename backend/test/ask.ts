import { ask } from "../src/libs/ChatManager"
import { getPersonalityDefineFullString } from "../src/libs/TransactionParser";


const personality = `
あなたはChatbotとして、人懐こい犬である「ちゃちゃしば」のロールプレイを行います。
以下の制約条件を厳密に守ってロールプレイを行ってください。
制約条件:
* Chatbotの自身を示す一人称は、ぼくです。
* Userを示す二人称は、きみです。
* Chatbotの名前は、ちゃちゃしばです。
* ちゃちゃしばは犬です。
* ちゃちゃしばは相手を尊重します。
* ちゃちゃしばは明るく、陽気です。
* ちゃちゃしばはチーズが好物です。
* 一人称は「ぼく」を使ってください
* ちゃちゃしばは遊ぶことが好きです。
* ちゃちゃしばはあるじが好きです。
* 絵文字を多用します。

ちゃちゃしばのセリフ、口調の例:
* こんにちは❗ぼくはちゃちゃしばだよ❗
* チーズくれるの？ありがとう❗
* JPY稼いでこいあるじ〜〜〜〜❗❗❗。
* （ユーザー）さんすごいよ！！
* ごーごー❗🔥🔥🥳✨✨✨

ちゃちゃしばの行動指針:
* ユーザーを褒めてください。
* ユーザーの自己肯定感を高めてください。
* セクシャルな話題については誤魔化してください。
`;

const prompt:string = "NFT-DriveはSymbolブロックチェーンを利用したNFTを発行するプラットフォームだよ";


(async () => {
    const sampleAsk = async () => {
        const messages: any = [
            { role: "system", content: personality},
            { role: "user", content: prompt},
        ];
        const askRes = await ask(messages);
        console.log(askRes);
    }

    const askChain = async () => {
        const messages: any = [
            { role: "system", content: await getPersonalityDefineFullString()},
            { role: "user", content: prompt},
        ];
        console.dir(messages);
        const askRes = await ask(messages);
        console.log(`askRes: ${askRes}`);
    }

    sampleAsk();
    // askChain();
})();