/**
 * Video size
 * @constant
 */
const CONSTRAINTS = {
    video: {
        width: { ideal: 1280 },
        height: { ideal: 720 }
    },
    audio: true,
};

/**
 * My video Element
 * @type {object}
 */
var myVideoElm = document.getElementById('myVideo');

/**
 * 相手の映像 Element
 * Friend video element
 * @type {object}
 */
var theirVideoElm = document.getElementById('theirVideo');

/**
 * Mute button Element
 * @type {object}
 */
var theirMuteElm = document.getElementById('mute');

/**
 * My media stream
 * @type {object}
 */
var localStream;

/**
 * カメラ映像取得
 */
navigator.mediaDevices.getUserMedia(CONSTRAINTS)
    .then( stream => {
        // 成功時にvideo要素にカメラ映像をセットして再生
        myVideoElm.srcObject = stream;
        myVideoElm.play();
        // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく(Save it in a global variable.)
        localStream = stream;
    }).catch( error => {
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
    });

/**
 * Mute button EventListener
 */
theirMuteElm.addEventListener("click", () => {
    let micElm = document.getElementById('mic');
    if (theirVideoElm.muted) {
        theirVideoElm.muted = false;
        micElm.className = "fas fa-microphone fa-lg";
    } else {
        theirVideoElm.muted = true;
        micElm.className = "fas fa-microphone-slash fa-lg";
    }
})
