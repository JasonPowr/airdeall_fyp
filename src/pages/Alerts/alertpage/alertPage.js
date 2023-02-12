import {UserAuth} from "../../../contexts/authContext";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import AlertCard from "../../../components/Cards/AlertCard";
import {auth, db} from "../../../firebase";
import {collection, getDocs} from "firebase/firestore";
import "./alertPage.css"

function AlertsPage() {
    const {user, logOut} = UserAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {

        auth.onAuthStateChanged(user => {
            if (user) {
                getAlertData().then(r => {
                })
            } else {
                // User is signed out.
            }
        })


        async function getAlertData() {
            const querySnapshot = await getDocs(collection(db, "users", `${auth.currentUser.uid}`, "alerts"));
            const alertsData = [];
            querySnapshot.forEach((doc) => {
                alertsData.push({
                    id: doc.id,
                    title: doc.data().alert.title,
                    description: doc.data().alert.desc,
                    sms: doc.data().alert.sms.sendSMS,
                    messageBody: doc.data().alert.sms.message.body,
                    contacts: doc.data().alert.sms.contacts,
                    contact_1: doc.data().alert.sms.contacts.contact_1,
                    contact_1_name: doc.data().alert.sms.contacts.contact_1.name,
                    contact_1_phone: doc.data().alert.sms.contacts.contact_1.phone,
                    contact_2: doc.data().alert.sms.contacts.contact_2,
                    contact_2_name: doc.data().alert.sms.contacts.contact_2.name,
                    contact_2_phone: doc.data().alert.sms.contacts.contact_2.phone,
                    contact_3: doc.data().alert.sms.contacts.contact_3,
                    contact_3_name: doc.data().alert.sms.contacts.contact_3.name,
                    contact_3_phone: doc.data().alert.sms.contacts.contact_3.phone,
                    alarm: doc.data().alert.alarm,
                    flashlight: doc.data().alert.flashlight,
                });
                setAlerts(alertsData)
            });
        }

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        try {
            logOut()
            navigate('/')
        } catch (e) {
            setError(e.message)
        }
    }

    return (
        <div className={"createAlertPage"}>
            <p>Hello user: {user && user.displayName}</p>

            <div className={"alertContainer"}>
                {alerts.map((alert) =>
                    <AlertCard alert={alert}/>)}
            </div>

            <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
            <Button onClick={handleSubmit}>Sign Out</Button>
        </div>
    );
}

export default AlertsPage;