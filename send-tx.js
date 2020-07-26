'use strict';
const RippleAPI = require('ripple-lib').RippleAPI;
const argv = require('minimist')(process.argv.slice(2));

// ToDo variables validation
const senderAddress = argv.sender_address;
const senderSecret = argv.sender_secret;
const recipientAddress = argv.recipient_address;
const sendAmount = argv.send_amount.toString(); // without toString() interpreted as number
const server = argv.wss_server;

const api = new RippleAPI({server: server});

api.connect().then(() => {

    api.prepareTransaction({
        "TransactionType": "Payment",
        "Account": senderAddress,
        "Amount": sendAmount, // in drops 1 = 1/1000000 XRP
        // "Amount": api.xrpToDrops("22"), // Same as "Amount": "22000000"
        "Destination": recipientAddress
    }, {
        // Can be set to other useful settings
        "maxLedgerVersionOffset": 75
    }).then(preparedTx => {
        let jsonString = preparedTx.txJSON;
        let txBlob = api.sign(jsonString, senderSecret);

        return api.submit(txBlob.signedTransaction);
    }).then(response => {

        console.log(JSON.stringify(response));

        return 0;
    }).catch(reason => {

        console.log(reason);
        let error = reason.toString();
        console.log(JSON.stringify({
            'error': error
        }));

        return 0;
    }).finally(process.exit);
});
