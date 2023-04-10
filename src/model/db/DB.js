import {
    collection,
    deleteDoc,
    deleteField,
    doc,
    GeoPoint,
    getDoc,
    getDocs,
    setDoc,
    updateDoc
} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {deleteObject, getDownloadURL, getMetadata, getStorage, ref, uploadBytes} from "firebase/storage";

export async function getUserPhoneNumberFromDB() {
    const userRef = doc(db, "users", `${auth.currentUser.uid}`)
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return docSnap.data().phoneNumber
    } else {
        console.log("No such document!");
    }
}

export async function updateProfileOnRegister(auth, firstName, lastName, email, phoneNumber) {
    await setDoc(doc(db, "users", `${auth.currentUser.uid}`), {
        uid: auth.currentUser.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
    });
}

export async function createAlert(alert) {
    const alertRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", `${alert.id}`);
    await setDoc(alertRef, {alert}, {merge: true});
}

export async function getUserAlertsFromDB() {
    const userAlertData = [];
    const querySnapshot = await getDocs(collection(db, "users", `${auth.currentUser.uid}`, "alerts"));
    querySnapshot.forEach((doc) => {
        userAlertData.push({
            alert: doc.data().alert
        });
    });
    return userAlertData
}

export async function getAlertById(alertId) {
    let foundAlert;
    const docRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId);
    const foundDoc = await getDoc(docRef);
    foundAlert = foundDoc.data().alert
    return foundAlert
}

export async function updateAlert(alert) {
    const alertRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", `${alert.id}`);
    await setDoc(alertRef, {alert}, {merge: false});
}

export async function deleteAlert(alertId) {
    await deleteDoc(doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId));

    const alertHistory = await getAllAlertHistory(alertId)
    if (alertHistory.length > 0) {
        alertHistory.map(async (index) => {
            await deleteAlertHistory(index.alertHistory.alert.id, index.alertHistory.id, index.alertHistory.alert.automaticRecording, index.alertHistory.alert.includeOnPublicMap)
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

export async function updateLocationInDb(lat, lng) {
    const userRef = doc(db, "users", `${auth.currentUser.uid}`);
    await updateDoc(userRef, {
        location: new GeoPoint(lat, lng)
    });
}

export async function addAlertHistory(alertId, alertHistory) {
    const alertRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory", `${alertHistory.id}`);
    await setDoc(alertRef, alertHistory, {merge: true});
}

export async function getAllAlertHistory(alertId) {
    const alertHistory = [];
    const querySnapshot = await getDocs(collection(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory"));
    querySnapshot.forEach((doc) => {
        alertHistory.push({
            alertHistory: doc.data()
        });
    });
    return alertHistory
}

export async function getAlertHistoryById(alertId, alertHistoryId) {
    let foundAlertHistory;
    const docRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory", alertHistoryId);
    const foundDoc = await getDoc(docRef);
    foundAlertHistory = foundDoc.data()
    return foundAlertHistory
}

export async function deleteAlertHistory(alertId, alertHistoryId, isRecording, isIncludeOnPublicMap) {
    await deleteDoc(doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory", alertHistoryId));

    if (isRecording) {
        await deleteVideoFromAlert(alertHistoryId)
    }

    if (isIncludeOnPublicMap) {
        await deleteIncidentReport(alertId, alertHistoryId)
    }

}

export async function updateAlertHistory(alertId, alertHistoryId, update) {
    const alertHistoryRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory", alertHistoryId);
    await updateDoc(alertHistoryRef, update, {merge: true});
}

export async function updateIncidentReport(alertId, alertHistoryId, update) {
    const alertHistoryRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory", alertHistoryId);
    await updateDoc(alertHistoryRef, {
        "alert.incidentReport": update
    });

    const publicAlertRef = doc(db, 'publicAlerts', alertHistoryId)
    await updateDoc(publicAlertRef, {
        "mapAlert.incidentReport": update
    });
}

export async function deleteIncidentReport(alertId, alertHistoryId) {
    const alertHistoryRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory", alertHistoryId);
    try {
        await updateDoc(alertHistoryRef, {
            incidentReport: deleteField()
        });
    } catch (e) {

    }

    try {
        await deleteDoc(doc(db, 'publicAlerts', alertHistoryId));
    } catch (e) {

    }
}

export async function getAlertVideo(alertHistoryId) {
    const storage = getStorage();
    const alertRecordingRef = ref(storage, `${auth.currentUser.uid}/alertRecordings/${alertHistoryId}`);
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

export async function uploadVideo(alertRecordingRef, recording) {
    return uploadBytes(alertRecordingRef, recording)
}

export async function deleteVideoFromAlert(alertHistoryId) {
    const storage = getStorage();

    const alertRecordingRef = ref(storage, `${auth.currentUser.uid}/alertRecordings/${alertHistoryId}`);

    await deleteObject(alertRecordingRef).then(() => {
        console.log("Video Deleted")
    }).catch((error) => {
        console.log(error)
    });
}

export async function addPublicAlert(alertHistoryId, mapAlert) {
    const alertRef = doc(db, 'publicAlerts', alertHistoryId);
    await setDoc(alertRef, {mapAlert}, {merge: true});
}



