import {collection, deleteDoc, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {updateProfile} from 'firebase/auth';
import {deleteObject, getDownloadURL, getMetadata, getStorage, ref} from "firebase/storage";
import UserContext from "../../contexts/Auth/authContext";
import {useContext} from "react";

function GetUserId() {
    const {user} = useContext(UserContext)
    return user.uid
}

export async function updateProfileOnRegister(auth, firstName, lastName, email, phoneNumber) {
    updateProfile(auth.currentUser, {}).then(async () => {
        await setDoc(doc(db, "users", `${auth.currentUser.uid}`), {
            uid: auth.currentUser.uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
        });
    }).catch((error) => {
        console.log(error)
    });
}

export async function createAlert(alert) {
    const alertRef = doc(db, "users", `${GetUserId}`, "alerts", `${alert.id}`);
    await setDoc(alertRef, {alert}, {merge: true});
}

export async function getUserAlertsFromDB() {
    const userAlertData = [];
    const querySnapshot = await getDocs(collection(db, "users", `${GetUserId}`, "alerts"));
    querySnapshot.forEach((doc) => {
        userAlertData.push({
            alert: doc.data().alert
        });
    });
    return userAlertData
}

export async function getAlertById(alertId) {
    let foundAlert;
    const docRef = doc(db, "users", `${GetUserId}`, "alerts", alertId);
    const foundDoc = await getDoc(docRef);
    foundAlert = foundDoc.data().alert
    return foundAlert
}

export async function updateAlert(alert) {
    const alertRef = doc(db, "users", `${GetUserId}`, "alerts", `${alert.id}`);
    await setDoc(alertRef, {alert}, {merge: false});
}

export async function deleteAlert(alertId) {
    await deleteDoc(doc(db, "users", `${GetUserId}`, "alerts", alertId));

    const alertHistory = await getAllAlertHistory(alertId)
    if (alertHistory.length > 0) {
        alertHistory.map(async (index) => {
            await deleteAlertHistory(index.alertHistory.alert.id, index.alertHistory.id, index.alertHistory.alert.automaticRecordings)
        })
    }

}

export async function getActiveAlerts() {
    const querySnapshot = await getDocs(collection(db, "activeAlerts"));
    const activeAlerts = [];
    querySnapshot.forEach((doc) => {
        activeAlerts.push({
            lat: doc.data().location.alertLocation._lat,
            lng: doc.data().location.alertLocation._long
        })
    });
    return activeAlerts
}

// export async function updateLocationInDb(lat, lng) {
//     const userRef = doc(db, "users", `${GetUserId}`);
//     await updateDoc(userRef, {
//         location: new GeoPoint(lat, lng)
//     });
// }

export async function addAlertHistory(alertId, alertHistory) {
    const alertRef = doc(db, "users", `${GetUserId}`, "alerts", alertId, "alertHistory", `${alertHistory.id}`);
    await setDoc(alertRef, {alertHistory}, {merge: true});
}

export async function getAllAlertHistory(alertId) {
    const alertHistory = [];
    const querySnapshot = await getDocs(collection(db, "users", `${GetUserId}`, "alerts", alertId, "alertHistory"));
    querySnapshot.forEach((doc) => {
        alertHistory.push({
            alertHistory: doc.data().alertHistory
        });
    });
    return alertHistory
}

export async function getAlertHistoryById(alertId, alertHistoryId) {
    let foundAlertHistory;
    const docRef = doc(db, "users", `${GetUserId}`, "alerts", alertId, "alertHistory", alertHistoryId);
    const foundDoc = await getDoc(docRef);
    foundAlertHistory = foundDoc.data().alertHistory
    return foundAlertHistory
}

export async function deleteAlertHistory(alertId, alertHistoryId, isRecording) {
    await deleteDoc(doc(db, "users", `${GetUserId}`, "alerts", alertId, "alertHistory", alertHistoryId));

    if (isRecording) {
        await deleteVideoFromAlert(alertHistoryId)
    }
}

export async function getAlertVideo(alertHistoryId) {
    const storage = getStorage();
    const alertRecordingRef = ref(storage, `${GetUserId}/alertRecordings/${alertHistoryId}`);
    const foundVideo = []

    await getMetadata(alertRecordingRef)
        .then((metadata) => {
            foundVideo.push(metadata)
        })
        .catch((error) => {
            console.log(error)
        });

    await getDownloadURL(alertRecordingRef)
        .then((url) => {
            foundVideo.push(url)
        })
        .catch((error) => {
            // eslint-disable-next-line default-case
            switch (error.code) {
                case 'storage/object-not-found':
                    console.log(error)
                    break;
                case 'storage/unauthorized':
                    console.log(error)
                    break;
                case 'storage/canceled':
                    console.log(error)
                    break;
                case 'storage/unknown':
                    console.log(error)
                    break;
            }
        });

    return foundVideo
}

export async function deleteVideoFromAlert(alertHistoryId) {
    const storage = getStorage();

    const alertRecordingRef = ref(storage, `${GetUserId}/alertRecordings/${alertHistoryId}`);

    await deleteObject(alertRecordingRef).then(() => {
        console.log("Video Deleted")
    }).catch((error) => {
        console.log(error)
    });
}



