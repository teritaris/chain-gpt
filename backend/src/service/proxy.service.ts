import {
    Account,
    Address,
    Deadline,
    Mosaic,
    MosaicId,
    NetworkType,
    NewBlock,
    PlainMessage,
    RepositoryFactoryHttp, SignedTransaction, Transaction, TransactionAnnounceResponse,
    TransactionGroup,
    TransactionType,
    TransferTransaction,
    UInt64
} from "symbol-sdk";
import {Config as C, logger} from '../init';

const NODE_URL = `${C.conf.symbol.node.host}:${C.conf.symbol.node.port}`;
const EPOCH_ADJUSTMENT = C.conf.symbol.node.epochAdjustment;
const GENERATION_HASH = C.conf.symbol.node.generationHash;
let networkType: NetworkType;
if (process.env.STAGE === "prod") {
    networkType = NetworkType.MAIN_NET;
} else {
    networkType = NetworkType.TEST_NET;
}

const symAddrs = C.conf.symbol.addresses;

const repoFac = new RepositoryFactoryHttp(NODE_URL);
const txRepo = repoFac.createTransactionRepository();
const netRepo = repoFac.createNetworkRepository();

// Proxyの秘密鍵読み出し
const constProxyPkey: string = process.env.CONSTRAINT_PROXY_PRIVATE_KEY as string;
const toneProxyPkey: string = process.env.TONE_PROXY_PRIVATE_KEY as string;
const actionProxyPkey: string = process.env.ACTION_PROXY_PRIVATE_KEY as string;
// モザイク返送用署名者秘密鍵読み出し
const reMosaicSignerPkey: string = process.env.RETURN_MOSAIC_SIGNER_PRIVATE_KEY as string;

// Proxyのアカウントクラス作成
const contProxyAccount: Account = Account.createFromPrivateKey(constProxyPkey, networkType);
const toneProxyAccount: Account = Account.createFromPrivateKey(toneProxyPkey, networkType);
const actionProxyAccount: Account = Account.createFromPrivateKey(actionProxyPkey, networkType);
// モザイク返送用署名者アカウントクラス作成
const reMosaicSignerAccount: Account = Account.createFromPrivateKey(reMosaicSignerPkey, networkType);

let medianFeeMultiplier: number;

/**
 * 
 * @param block 
 * @param proxyAddress  // 各項目のProxyアドレス
 * @param targetAddress  // 各項目の本体アドレス
 */
const newBlock = (block: NewBlock, proxyAddress: string, targetAddress: string, signer: Account) => {
    txRepo.search({
        address: Address.createFromRawAddress(proxyAddress),
        height: block.height,
        group: TransactionGroup.Confirmed,
    }).subscribe(_=>{
        if(_.data.length > 0) {
            // 入ってるTxの数分処理する
            const transaction:any[] = _.data;
            for (const tx of transaction) {
                // 宛先がproxyアドレスのtxを拾う
                if (tx.type === TransactionType.TRANSFER) {
                    const transferTx: TransferTransaction = tx;
                    if(transferTx.recipientAddress.plain() === proxyAddress) {
                        // 人格定義項目アドレスにmessage転送
                        sendTransfer(transferTx, targetAddress, signer);
                        sendDefineMosaic(transferTx.signer?.address.plain()!);
                    }
                }
            }
        }
    });
}

const toConstraint = (block: NewBlock) => {
    newBlock(block, symAddrs.constraintProxy, symAddrs.constraint, contProxyAccount);
}
const toTone = (block: NewBlock) => {
    newBlock(block, symAddrs.toneProxy, symAddrs.tone, toneProxyAccount);
}
const toAction = (block: NewBlock) => {
    newBlock(block, symAddrs.actionProxy, symAddrs.action, actionProxyAccount);
}

const sendTransfer = (transferTx: TransferTransaction, targetAddress: string, signer: Account) => {
    const message: string = `* ${transferTx.message.payload} `;
    const tx: Transaction = TransferTransaction.create(
        Deadline.create(EPOCH_ADJUSTMENT),
        Address.createFromRawAddress(targetAddress),
        [],
        PlainMessage.create(message),
        networkType
    ).setMaxFee(medianFeeMultiplier);

    const signedTx: SignedTransaction = signer.sign(tx, GENERATION_HASH);
    logger.info(`hash: ${signedTx.hash}`)

    txRepo.announce(signedTx).subscribe((x: TransactionAnnounceResponse) => logger.info(x), (error: any) => logger.error(error));
}

const sendDefineMosaic = (signerAddr: string) => {
    const message: string = `ちゃちゃしば育成ありがとう🥳`;
    const tx: Transaction = TransferTransaction.create(
        Deadline.create(EPOCH_ADJUSTMENT),
        Address.createFromRawAddress(signerAddr),
        [new Mosaic(
            new MosaicId(C.conf.symbol.mosaics.thanks),
            UInt64.fromUint(1) // 可分性0
        )],
        PlainMessage.create(message),
        networkType
    ).setMaxFee(medianFeeMultiplier);

    const signedTx: SignedTransaction = reMosaicSignerAccount.sign(tx, GENERATION_HASH);
    logger.info(`return mosaic hash: ${signedTx.hash}`)

    txRepo.announce(signedTx).subscribe((x: TransactionAnnounceResponse) => logger.info(x), (error: any) => logger.error(error));
}


(async () => {
    medianFeeMultiplier = (await netRepo.getTransactionFees().toPromise())!.medianFeeMultiplier;

    const listener = repoFac.createListener();
    listener.open().then(()=> {
        logger.debug("listener open");
        listener.newBlock().subscribe((block: NewBlock) => {
            toConstraint(block);
            toTone(block);
            toAction(block);
        })
    });

})();