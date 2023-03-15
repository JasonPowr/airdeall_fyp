import {collection, deleteDoc, doc, getDoc, getDocs} from "firebase/firestore";
import {auth, db} from "../../firebase";

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

export async function deleteAlert(alertId) {
    await deleteDoc(doc(db, "users", `${auth.currentUser.uid}`, "alerts", alertId));
}

