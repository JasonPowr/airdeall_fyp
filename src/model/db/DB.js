import {collection, deleteDoc, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";

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
}

export async function addAlertHistory(alertId, alertHistory) {
    const alertRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId, "alertHistory", `${alertHistory.id}`);
    await setDoc(alertRef, {alertHistory}, {merge: true});
}

export async function getAlertHistory(alertId) {

}

export async function deleteAlertHistory(alertId) {

}

