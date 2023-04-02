export async function getGeoLocationPermissions() {
    navigator.permissions.query({name: "geolocation"}).then((result) => {
        return result.state === "granted";
    });
}

export async function getCameraPermissions() {
    navigator.permissions.query({name: "camera"}).then((result) => {
        return result.state === "granted";
    });
}

export async function getMicPermissions() {
    navigator.permissions.query({name: "microphone"}).then((result) => {
        return result.state === "granted";
    });
}

//https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query