const symbol = require("/node_modules/symbol-sdk");
// const symbol = require("symbol-sdk");

// ===========DEV===========
// const NODE_URL = "https://sym-test-03.opening-line.jp:3001";
// const EPOCH_ADJUSTMENT = 1667250467;
// const NETWORK_TYPE = symbol.NetworkType.TEST_NET;
// ===========DEV===========
const NODE_URL = "https://sym-main-08.opening-line.jp:3001";
const EPOCH_ADJUSTMENT = 1615853185;
const NETWORK_TYPE = symbol.NetworkType.MAIN_NET;

const repositoryFactory = new symbol.RepositoryFactoryHttp(NODE_URL);
const transactionHttp = repositoryFactory.createTransactionRepository();
const netRepo = repositoryFactory.createNetworkRepository();


export const getFee = async () => {
    return (await netRepo.getTransactionFees().toPromise()).medianFeeMultiplier;
}

export const handleSSS = (toAddress, message, fee) => {
    const tx = symbol.TransferTransaction.create(
        symbol.Deadline.create(EPOCH_ADJUSTMENT),
        symbol.Address.createFromRawAddress(toAddress),
        [],
        symbol.PlainMessage.create(message),
        NETWORK_TYPE,
    ).setMaxFee(fee);

    window.SSS.setTransaction(tx);

    window.SSS.requestSign().then(signedTx => {
        console.log('signedTx', signedTx)
        transactionHttp.announce(signedTx)
    });
}


// 指定アドレスへのトランザクションからメッセージを取得する
export const getMessagesByTransaction = async (targetAddress) => {
    const repo = new symbol.RepositoryFactoryHttp(NODE_URL);
    const txRepo = repo.createTransactionRepository();

    let lastPage = false;
    let pageNumber = 0;
    let pageSize = 20;

    const messages = [];

    while (!lastPage) {
        const criteria = {
            address: symbol.Address.createFromRawAddress(targetAddress),
            group: symbol.TransactionGroup.Confirmed,
            embedded: true,
            pageNumber: pageNumber,
            pageSize: pageSize,
        }
        const res = await txRepo.search(criteria).toPromise();
        res?.data.forEach((tx) => {
            if (tx.type === symbol.TransactionType.TRANSFER) {
                messages.push(tx.message.payload)
            }
        });

        lastPage = res?.isLastPage
    }
    return messages;
}