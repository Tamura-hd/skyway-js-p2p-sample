/**
 * Peer インスタンス
 * Peer instance
 * @constant
 * @type {object}
 */
let peer;

/**
 * 自分の Peer ID
 * My peer ID
 * @type {string}
 */
let peerId = '';

/**
 * 相手の Data Connection
 * Friend data connection
 * @type {object}
 */
let theirDataConnection;

/**
 * 相手の Media connection
 * Friend media connection
 * @type {object}
 */
let theirMediaConnection;

/**
 * 相手のメディアストリーム
 * Friend media stream
 * @type {object}
 */
let theirStream;

/**
 * 乱数テーブル
 * Random number table
 * @constant
 * @type {string}
 */
const CODE_TABLE = '0123456789';

/**
 * 発信ダイアログ表示ボタン Element
 * Show make call modal button element
 */
let btnShowMakeCallModalElm;

/**
 * 発信中ダイアログメッセージ Element
 * Make calling modal message element
 */
let callingMessageElm;

/**
 * 着信中ダイアログメッセージ Element
 * Incoming modal message element
 */
let incomingMessageElm;

/**
 * 発信ボタン Element
 * Make call button element
 * @constant
 * @type {object}
 */
let makeCallElm;
/**
 * 切断ボタン Element
 * Shut off call button element
 * @constant
 * @type {object}
 */
let shutOffCallElm;
/**
 * 応答ボタン Element
 * Accept call button element
 * @constant
 * @type {object}
 */
let acceptCallElm;
/**
 * 拒否ボタン Element
 * Reject button element
 * @constant
 * @type {object}
 */
let rejectElm;
/**
 * キャンセルボタン Element
 * Cancel button element
 * @constant
 * @type {object}
 */
let cancelElm;
/**
 * 相手の Peer ID Element
 * Friend peer ID element
 * @constant
 * @type {object}
 */
let theirIdElm;

let num1Elm;
let num2Elm;
let num3Elm;
let num4Elm;
let num5Elm;
let num6Elm;
let num7Elm;
let num8Elm;
let num9Elm;
let num0Elm;

/**
 * event listeners
 */

/**
 * DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", (event) => {
    btnShowMakeCallModalElm = document.getElementById('btnShowMakeCallModal');
    callingMessageElm = document.getElementById('callingMessage');
    incomingMessageElm = document.getElementById('incomingMessage');

    makeCallElm = document.getElementById('makeCall');
    shutOffCallElm = document.getElementById('shutOffCall');
    acceptCallElm = document.getElementById('acceptCall');
    rejectElm = document.getElementById('rejectCall');
    cancelElm = document.getElementById('cancelCall');
    theirIdElm = document.getElementById('theirId');
    
    num1Elm = document.getElementById('num1');
    num2Elm = document.getElementById('num2');
    num3Elm = document.getElementById('num3');
    num4Elm = document.getElementById('num4');
    num5Elm = document.getElementById('num5');
    num6Elm = document.getElementById('num6');
    num7Elm = document.getElementById('num7');
    num8Elm = document.getElementById('num8');
    num9Elm = document.getElementById('num9');
    num0Elm = document.getElementById('num0');
    
    i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            // lng: 'en',
            debug: true,
            fallbackLng: 'en',
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json'
            }
        }, function(err, t) {
            jqueryI18next.init(i18next, $);
            $('[data-i18n]').localize();
        });

    /**
     * 発信ボタン EventListener
     * Make call button eventlistener
     */
    makeCallElm.addEventListener("click", () => {
        document.getElementById('makeCallingModalLabel').innerText = theirIdElm.value;
        callingMessageElm.innerText = i18next.t('index.calling');

        // 発信中ダイアログ表示
        $('#makeCallingModal').modal({
            backdrop: 'static',
            keyboard: false,
        });

        // データチャネル接続(Connect to data channel)
        const dataConnection = peer.connect(theirIdElm.value);
        dataConnection.on('open', () => {
            checkDataConnection(dataConnection);

            // メディアチャネル接続(Connect to media channel)
            theirMediaConnection = peer.call(theirIdElm.value, localStream);

            setEventListener(theirMediaConnection);
            setMakeCallDisabled(true);
        })
    });

    /**
     * 切断ボタン EventListener
     * Shut off call button eventlistener
     */
    shutOffCallElm.addEventListener("click", () => {
        theirStream.close(true);
        setMakeCallDisabled(false);
    });

    /**
     * 応答ボタン EventListener
     * Accept call button eventlistener
     */
    acceptCallElm.addEventListener("click", () => {
        theirMediaConnection.answer(localStream);

        let message = {
            type:'start',
        };
        theirDataConnection.send(message);
    })

    /**
     * 拒否ボタン EventListener
     * Reject button eventlistener
     */
    rejectElm.addEventListener("click", () => {
        let message = {
            type:'reject',
        };
        theirDataConnection.send(message);

        reset();
        initPeer();
    })

    /**
     * キャンセルボタン EventListener
     * Cancel button eventlistener
     */
    cancelElm.addEventListener("click", () => {
        reset();
    })

    num1Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num2Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num3Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num4Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num5Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num6Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num7Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num8Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num9Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    num0Elm.addEventListener("click", function() {
        theirIdElm.value += this.textContent;
    })
    
    initPeer();
});

/**
 * 発信中ダイアログ Hidden イベント
 * Event to hide the make calling modal
 */
$('#makeCallingModal').on('hidden.bs.modal', (event) => {
    callingMessageElm.innerText = '';
});

/**
 * functions
 */

 /**
  * Reset
  */
function reset() {
    theirIdElm.innerText = '';
    document.getElementById('makeCallingModalLabel').innerText = '';
    document.getElementById('incomingModalLabel').innerText = '';

    setMakeCallDisabled(false);
}

/**
 * Peer インスタンスの初期化とイベント設定
 * Peer instance initialization and event settings
 */
function initPeer() {
    if (peer == null) {
        // Peer ID を生成(Generate peer ID)
        for (var i = 0, k = CODE_TABLE.length; i < 10; i++) {
            peerId += CODE_TABLE.charAt(Math.floor(k * Math.random()));
        }

        // Peerインスタンス生成
        peer = new Peer(peerId, {
            key: API_KEY,
            debug: 3
        });

        // シグナリングサーバ接続後(Peer インスタンス生成後)に発火するイベント(Events after connecting to the signaling server)
        peer.on('open', () => {
            document.getElementById('my-id').textContent = peer.id;
        });

        // データチャネル受信イベント(Data channel received event)
        peer.on('connection', connection => {
            checkDataConnection(connection);
        });

        // メディアチャネル受信イベント(Media chanel received event)
        peer.on('call', connection => {
            theirMediaConnection = connection;

            // 着信側の呼び出しダイアログに発信元の ID をセット
            document.getElementById('incomingModalLabel').innerText = connection.remoteId;
            incomingMessageElm.innerText = i18next.t('index.incoming');

            // 着信側の呼び出しダイアログ表示
            $('#incomingModal').modal({
                backdrop: 'static',
                keyboard: false,
            });

            setEventListener(connection);
            setMakeCallDisabled(true);
        });

        peer.on('error', error => {
            console.log(`${error.type}: ${error.message}`);
        });
    }
}

/**
 * 受信データをチェック
 * Check received data
 * @param {object} connection Data Connection
 */
function checkDataConnection(connection) {
    theirDataConnection = connection;

    // データ受信イベント((Data received event))
    theirDataConnection.on('data', data => {
        switch (data.type) {
            case 'calling':
                break;
            case 'start':
                // 発信中ダイアログを閉じる
                $('#makeCallingModal').modal('hide');
                break;
            case 'reject':
                callingMessageElm.innerText = i18next.t('message.notConnection');
                reset();
                initPeer();
                break;
        }
    });

    theirDataConnection.on('close', error => {
        console.log('closed', error);
    });

    theirDataConnection.on('error', error => {
        console.log(`error dataConnection ${error.type}: ${error.message}`);
    });
}

/**
 * MediaConnection の EventListener を設置する関数
 * @param {object} mediaConnection Media Connection
 */
const setEventListener = mediaConnection => {
    mediaConnection.on('stream', stream => {
        theirVideoElm.srcObject = stream;
        theirVideoElm.play();
    });

    theirStream = mediaConnection;

    mediaConnection.on('close', () => {
        setMakeCallDisabled(false);
        theirVideoElm.srcObject = null;
        alert(i18next.t('message.disconnected'))
    });
}

/**
 * 発信ボタンの活性制御
 * Make call button activation control
 * @param {boolean} disabled 活性、非活性フラグ
 */
const setMakeCallDisabled = disabled => {
    btnShowMakeCallModalElm.disabled = disabled;
    makeCallElm.disabled = disabled;
    theirIdElm.disabled = disabled;
}
