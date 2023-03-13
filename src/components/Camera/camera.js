import {getStorage, ref, uploadBytes} from "firebase/storage";
import {auth} from "../../firebase";

let mediaStream
let video;
let track;
let capabilities;
let chunks = [];
let mediaRecorder;

export function requestCameraAccess() {
    navigator.mediaDevices.getUserMedia({audio: true, video: {facingMode: "environment"}})
        .then(function (s) {
            video = document.createElement('video');
            mediaStream = s
            video.srcObject = mediaStream;
            track = mediaStream.getVideoTracks()[0];
            capabilities = track.getCapabilities()
            mediaRecorder = new MediaRecorder(mediaStream);
        })
        .catch(function (error) {
        });
}

export function toggleFlashlightOn() {
    if (capabilities.torch) {
        track.applyConstraints({
            advanced: [{torch: true}]
        })
            .catch(e => console.log(e));
    }
}

export function toggleFlashlightOff() {
    if (capabilities.torch) {
        track.applyConstraints({
            advanced: [{torch: false}]
        })
            .catch(e => console.log(e));
    }
}

export function startRecording() {
    mediaRecorder.start()
}

export function stopRecording() {
    mediaRecorder.stop();

    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function (e) {
        const recording = new Blob(chunks, {'type': 'video/webm'});
        const date = new Date();
        const id = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}.${date.getSeconds()}`

        const storage = getStorage();
        const alertRecordingRef = ref(storage, `${auth.currentUser.uid}/alertRecordings/alert-${id}`);

        uploadBytes(alertRecordingRef, recording).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    }

}

//https://tecadmin.net/get-current-date-time-javascript/
//http://blogs.bytecode.com.au/glen/2018/03/06/recording-pwa-video.html#:~:text=You%20take%20an%20incoming%20stream,in%20my%20callback%20every%20second.
//https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
//https://firebase.google.com/docs/storage/web/upload-files