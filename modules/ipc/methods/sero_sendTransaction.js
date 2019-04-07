

const BaseProcessor = require('./base');
const Windows = require('../../windows');
const Q = require('bluebird');
const got = require('got');
const { ipcMain: ipc } = require('electron');
const BlurOverlay = require('../../blurOverlay');
const ClientBinaryManager = require('../../clientBinaryManager');

/**
 * Process method: sero_sendTransaction
 */
module.exports = class extends BaseProcessor {

    /**
     * @override
     */
    sanitizeRequestPayload(conn, payload, isPartOfABatch) {
        if (isPartOfABatch) {
            throw this.ERRORS.BATCH_TX_DENIED;
        }

        return super.sanitizeRequestPayload(conn, payload, isPartOfABatch);
    }


    /**
     * @override
     */
    exec(conn, payload) {
        return new Q((resolve, reject) => {
            this._log.info('Ask user for password');

            this._log.info(payload.params[0]);

            const geroClient = ClientBinaryManager.getClient('gero');

            if (geroClient) {
                // fetch config
                return got(ClientBinaryManager.getBINARYURL(), {
                    timeout: 3000,
                    json: true,
                })
                    .then((res) => {
                        if (!res || _.isEmpty(res.body)) {
                            throw new Error('Invalid fetch result');
                        } else {
                            return res.body;
                        }
                    })
                    .catch((err) => {
                        console.log('Error fetching client binaries config from repo', err);
                    })
                    .then((latestConfig) => {
                        if (!latestConfig) return;

                        const nodeVersion = latestConfig.clients.gero.version;
                        //geroClient.version
                        if(geroClient.version !== nodeVersion){
                            reject(this.ERRORS.TX_DENIED_INVALID_VERSION);
                        }else{
                            const modalWindow = Windows.createPopup('sendTransactionConfirmation', {
                                sendData: {
                                    uiAction_sendData: payload.params[0],
                                },
                                electronOptions: {
                                    width: 580,
                                    height: 550,
                                    alwaysOnTop: true,
                                    enableLargerThanScreen: false,
                                    resizable: true
                                },
                            });

                            BlurOverlay.enable();

                            modalWindow.on('closed', () => {
                                BlurOverlay.disable();

                                // user cancelled?
                                if (!modalWindow.processed) {
                                    reject(this.ERRORS.TX_DENIED);
                                }
                            });

                            ipc.once('backendAction_unlockedAccountAndSentTransaction', (ev, err, result) => {
                                if (Windows.getById(ev.sender.id) === modalWindow
                                    && !modalWindow.isClosed) {
                                    if (err || !result) {
                                        this._log.debug('Confirmation error', err);

                                        reject(err || this.ERRORS.METHOD_DENIED);
                                    } else {
                                        this._log.info('Transaction sent', result);

                                        resolve(result);
                                    }

                                    modalWindow.processed = true;
                                    modalWindow.close();
                                }
                            });
                        }
                    })
            }
            // validate data
            // try {
            //     _.each(payload.params[0], (val, key) => {
            //         if doesn't have hex then leave
            //         if (!_.isString(val)) {
            //             console.log('val111 ==== ',val)
            //             throw this.ERRORS.INVALID_PAYLOAD;
            //         } else {
            //             console.log('val222 ==== ',val)
            //             var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
            //             var ALPHABET_MAP = {}
            //             for (var i = 0; i < ALPHABET.length; i++) {
            //                 ALPHABET_MAP[ALPHABET.charAt(i)] = i
            //             }
            //             for (i = 0; i < val.length; i++) {
            //                 var c = val[i]
            //                 if (!(c in ALPHABET_MAP))
            //                     throw new Error('Non-base58 character')
            //             }
            //
            //             // make sure all data is lowercase and has 0x
            //             if (val) val = `0x${val.toLowerCase().replace(/^0x/, '')}`;
            //
            //             if (val.substr(2).match(/[^0-9a-f]/igm)) {
            //                 console.log('val222 ==== ',val)
            //                 throw this.ERRORS.INVALID_PAYLOAD;
            //             }
            //         }
            //
            //         payload.params[0][key] = val;
            //     });
            // } catch (err) {
            //     return reject(err);
            // }


        })
        .then((result) => {
            return _.extend({}, payload, {
                result,
            });
        });
    }
};
