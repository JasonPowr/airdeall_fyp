

let mediaStream
let video;
let track;
let capabilities;

export function requestCameraAccess() {
    navigator.mediaDevices.getUserMedia({ audio: false, video: {facingMode: "environment"} })
        .then(function(s) {
            video = document.createElement('video');
            mediaStream = s
            video.srcObject = mediaStream;
            track = mediaStream.getVideoTracks()[0];
            capabilities = track.getCapabilities()
        })
        .catch(function(error) {
        });
}

export function toggleFlashlightOn(){
        if (capabilities.torch) {
            track.applyConstraints({
                advanced: [{torch: true}]
            })
                .catch(e => console.log(e));
        }
}

export function toggleFlashlightOff(){
        if (capabilities.torch) {
            track.applyConstraints({
                advanced: [{torch: false}]
            })
                .catch(e => console.log(e));
        }
}