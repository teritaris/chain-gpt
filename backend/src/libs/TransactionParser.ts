import { Config as C } from "../init";
import { createSymbolRepositoryFactory } from "./RepositoryFactory";
import {
    Address,
    RepositoryFactoryHttp,
    TransactionGroup,
    TransactionSearchCriteria, TransactionType,
    TransferTransaction
} from "symbol-sdk";
import { PersonalityDefine } from "../../types";
import { Config } from "log4js";

const symConf: Config = C.conf.symbol;

const promiseConstString: string = "あなたはChatbotとして、人語を喋る犬である「ちゃちゃしば」のロールプレイを行います。以下の制約条件を厳密に守ってロールプレイを行ってください。\n";
const constraintConstString: string = "制約条件:\n";
const toneConstString: string = "ちゃちゃしばのセリフ、口調の例:\n";
const actionConstString: string = "ちゃちゃしばの行動指針:\n";

const sleep = ((ms: number) => new Promise(resolve => setTimeout(resolve, ms)));


// 指定アドレスへのトランザクションからメッセージを取得する
const getMessagesByTransaction = async (targetAddress: string): Promise<string[]> => {
    const symbolRepo: RepositoryFactoryHttp = await createSymbolRepositoryFactory();
    const txRepo = symbolRepo.createTransactionRepository();

    let lastPage: boolean | undefined = false;
    let pageNumber = 0;
    let pageSize = 20;

    const messages: string[] = [];

    // 1pageで収まらなかった場合の動作は未確認
    while (!lastPage) {
        const criteria: TransactionSearchCriteria = {
            address: Address.createFromRawAddress(targetAddress),
            group: TransactionGroup.Confirmed,
            embedded: true,
            pageNumber: pageNumber,
            pageSize: pageSize,
        }
        const res: any = await txRepo.search(criteria).toPromise();
        res?.data.forEach((tx: TransferTransaction) => {
            if (tx.type === TransactionType.TRANSFER) {
                messages.push(tx.message.payload)
            }
        });

        sleep(2000)

        lastPage = res?.isLastPage
        pageNumber++;
    }
    return messages;
}

// 配列でとってきたのを連結
const parseMessage = (messages: string[]): string => {
    let message: string = "";
    messages.forEach((m: string) => {
        message = message + m;
    })
    return message
}

// 制約条件を連結して文字列で取得
export const getConstraint = async (): Promise<string> => {
    const constraints: string[] = await getMessagesByTransaction(symConf.addresses.constraint);
    return parseMessage(constraints);
}

// 口調を連結して文字列で取得
export const getTone = async (): Promise<string> => {
    const tones: string[] = await getMessagesByTransaction(symConf.addresses.tone);
    return parseMessage(tones);
}

// 行動指針を連結して文字列で取得
export const getAction = async (): Promise<string> => {
    const action: string[] = await getMessagesByTransaction(symConf.addresses.action);
    return parseMessage(action);
}

// OpenAI APIに渡すためのやつ
export const getPersonalityDefine = async (): Promise<PersonalityDefine> => {
    // ここで制約・口調・行動指針の3種類持ってくる
    return {
        constraint: await getConstraint(),
        tone: await getTone(),
        action: await getAction()
    } as PersonalityDefine;
}

// OpenAI APIのsystemロールに渡す全文
export const getPersonalityDefineFullString = async (): Promise<string> => {
    const pDef: PersonalityDefine = await getPersonalityDefine();
    const fullSetting: string = promiseConstString +
        constraintConstString + pDef.constraint + '\n' +
        toneConstString + pDef.tone + '\n' +
        actionConstString + pDef.action;
    return fullSetting;
}
