import { getFee, getMessagesByTransaction, handleSSS } from "./symbol.js";

// ===========DEV===========
// // 制約条件(proxy)
// const constraintProxyAddress = "TAZJNSTWFBART4DQVT7WNVRONDENQ2N7FHOPEZI";
// // 口調(proxy)
// const toneProxyAddress = "TCPJO5I7FXNHFK3N3CJKFGQFY5USKZZB7Z3OOYA";
// // 行動指針(proxy)
// const actionProxyAddress = "TDG3Q2TCUSYQI3Z4YA6ONES7KUGIIE4LM4MNXVQ";
// // 制約条件
// const constraintAddress = "TDJTBUWFSCSKNRJWK3ZJBWNMCHQOLKESXUXBWQQ";
// // 口調
// const toneAddress = "TBP5K2CLBQFUEAMEU5HKKN3SVUCPH5XHDNPKMVQ";
// // 行動指針
// const actionAddress = "TD7G3M52CLH6WOO2BGKHURLTKCPE2GGJ25RITHA";
// ===========DEV===========
// 制約条件(proxy)
const constraintProxyAddress = "NBNIEPWSA3BRQOLUT4BEJL4CB3KR5EBX3PQBEGY";
// 口調(proxy)
const toneProxyAddress = "NBT3HSXXXEQJEA6GFZ3AWWBFUJE5DVLPHOJAOSY";
// 行動指針(proxy)
const actionProxyAddress = "NBEDEP54BOFH2KKQJP6NXTP42G6TALCUIJBADUA";
// 制約条件
const constraintAddress = "NB5UPTZVZSKWZXQGAJCEA4U3NH7UPPGZW5YLGRI";
// 口調
const toneAddress = "NCJXZOYWQXQULAKAICUMJCH6XLLVONJU2KBSIZQ";
// 行動指針
const actionAddress = "NBUCYOD2PUC2X4NLXEGZ6XJU53E3U33SKCEXCYY";

// let fee = 0;
// (async ()=> {
//     fee = await getFee();
// })()

document.getElementById('toConstraint').addEventListener('click', async function() {
    const message = document.getElementById("textarea").value;
    handleSSS(constraintProxyAddress, message, await getFee());
});

document.getElementById('toTone').addEventListener('click', async function() {
    const message = document.getElementById("textarea").value;
    handleSSS(toneProxyAddress, message, await getFee());
});

document.getElementById('toAction').addEventListener('click', async function() {
    const message = document.getElementById("textarea").value;
    handleSSS(actionProxyAddress, message, await getFee());
});

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems);

    const modalTriggers = document.querySelectorAll('.modal-trigger');

    const infoElementIds = [
        "constraint-info",
        "tone-info",
        "action-info"
    ];

    const targetAddresses = [
        constraintAddress,
        toneAddress,
        actionAddress
    ]

    modalTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', async () => {
            try {
                const messages = await getMessagesByTransaction(targetAddresses[index]);

                // 配列ループして改行コードつけながら文字列連結
                let message = "";
                for (const m of messages) {
                    message += m + '\n';
                }

                document.getElementById(infoElementIds[index]).innerText = message;
                instances[index].open();
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            }
        });
    });
});
