import {getStorage, ref} from "firebase/storage";
import {auth} from "../../firebase";
import {uploadVideo} from "../../model/db/DB";

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

export async function startRecording() {
    chunks = [];
    mediaRecorder.start()
}

export function stopRecording(alertId) {
    mediaRecorder.stop();

    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = async function (e) {
        const recording = new Blob(chunks, {'type': 'video/webm'});

        const storage = getStorage();
        const alertRecordingRef = ref(storage, `${auth.currentUser.uid}/alertRecordings/${alertId}`);
        await uploadVideo(alertRecordingRef, recording)
    }
}


//https://tecadmin.net/get-current-date-time-javascript/
//http://blogs.bytecode.com.au/glen/2018/03/06/recording-pwa-video.html#:~:text=You%20take%20an%20incoming%20stream,in%20my%20callback%20every%20second.
//https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
//https://firebase.google.com/docs/storage/web/upload-files