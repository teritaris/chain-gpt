import {
    Account,
    Address,
    Deadline,
    NetworkType,
    NewBlock,
    PlainMessage,
    RepositoryFactoryHttp, SignedTransaction, Transaction, TransactionAnnounceResponse,
    TransactionGroup,
    TransactionType,
    TransferTransaction
} from "symbol-sdk";
import {Config as C, logger} from '../init';
import { ask } from "../libs/ChatManager";
import { getPersonalityDefineFullString } from "../libs/TransactionParser";

const NODE_URL = `${C.conf.symbol.node.host}:${C.conf.symbol.node.port}`;
const EPOCH_ADJUSTMENT = C.conf.symbol.node.epochAdjustment;
const GENERATION_HASH = C.conf.symbol.node.generationHash;
let networkType: NetworkType;
if (process.env.STAGE === "prod") {
    networkType = NetworkType.MAIN_NET;
} else {
    networkType = NetworkType.TEST_NET;
}

const repoFac = new RepositoryFactoryHttp(NODE_URL);
const txRepo = repoFac.createTransactionRepository();
const netRepo = repoFac.createNetworkRepository();

const askerPkey: string = process.env.ASKER_PRIVATE_KEY as string;
const askerAccount = Account.createFromPrivateKey(askerPkey, networkType)
const askerRawAddress = C.conf.symbol.addresses.asker;

let medianFeeMultiplier: number;

const newBlock = async (block: NewBlock) => {
    txRepo.search({
        address: Address.createFromRawAddress(askerRawAddress),
        height: block.height,
        group: TransactionGroup.Confirmed,
    }).subscribe(async (_)=>{
        if(_.data.length > 0) {
            // 入ってるTxの数分処理する
            const transaction:any[] = _.data;
            for (const tx of transaction) {
                // 宛先がaskerアドレスのtxを拾う
                if (tx.type === TransactionType.TRANSFER) {
                    const transferTx: TransferTransaction = tx;
                    if(transferTx.recipientAddress.plain() === askerRawAddress) {
                        const personality: string = await getPersonalityDefineFullString();
                        const messages: any = [
                            { role: "system", content: personality},
                            { role: "user", content: transferTx.message.payload},
                        ];
                        console.dir(messages);
                        const askRes: string = await ask(messages) as string
                        sendTransfer(transferTx, askRes);
                    }
                }
            }
        }
    });
}

const sendTransfer = async (transferTx: TransferTransaction, message: string) => {
    const tx: Transaction = TransferTransaction.create(
        Deadline.create(EPOCH_ADJUSTMENT),
        transferTx.signer?.address!,
        [],
        PlainMessage.create(message),
        networkType
    ).setMaxFee(medianFeeMultiplier);

    const signedTx: SignedTransaction = askerAccount.sign(tx, GENERATION_HASH);
    logger.info(`hash: ${signedTx.hash}`)

    txRepo.announce(signedTx).subscribe((x: TransactionAnnounceResponse) => logger.info(x), (error: any) => logger.error(error));
}

/**
 * Txメッセージ内容でGPTに問い合わせてTxメッセージでGPTの応答を返す
 */
(async () => {
    medianFeeMultiplier = (await netRepo.getTransactionFees().toPromise())!.medianFeeMultiplier;

    const listener = repoFac.createListener();
    listener.open().then(()=> {
        logger.debug("listener open");
        listener.newBlock().subscribe((block: NewBlock) => {
            newBlock(block)
        })
    });

})();