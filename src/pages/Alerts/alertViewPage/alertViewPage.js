import "./alertViewPage.css"
import BottomNav from "../../../components/bottomNav/bottomNav";
import {useLocation, useNavigate} from "react-router-dom";
import {deleteAlert, getAlertById, getAllAlertHistory} from "../../../model/db/DB";
import React, {useEffect, useState} from "react";
import {auth} from "../../../firebase";
import {ArrowBack, Delete, Edit, Sort} from "@material-ui/icons";
import ContactCard from "../../../components/Cards/ContactCard/contactCard";
import AlertHistoryCard from "../../../components/Cards/AlertHistoryCard/AlertHistoryCard";
import {Stack, Typography} from "@mui/material";

function AlertViewPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const [alert, setAlert] = useState(null);
    const [alertHistory, setAlertHistory] = useState([])
    const [contacts, setContacts] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                getAlertById(alertId).then(foundAlert => {
                    setAlert(foundAlert)

                    if (foundAlert.sms.sendSMS) {
                        const contacts = [foundAlert.sms.contacts.contact_1, foundAlert.sms.contacts.contact_2, foundAlert.sms.contacts.contact_3,];
                        setContacts(contacts);
                    }

                })
                getAllAlertHistory(alertId).then(alertHistory => {
                    setAlertHistory(alertHistory)
                })
            }
        })
    }, []);

    function updateList() {
        getAllAlertHistory(alertId).then(alertHistory => {
            setAlertHistory(alertHistory)
        })
    }

    function handleDelete() {
        deleteAlert(alertId).then()
        navigate(`/alerts`)
    }

    function handleEdit() {
        navigate(`/${alert.id}/edit_alert`, {state: {alertId: alert.id}});
    }

    function handleBack() {
        navigate("/alerts");
    }

    if (alert == null) return <div>
        <div>Loading...</div>
        <div><BottomNav/></div>
    </div>

    function sortListByMostRecent() {
        const sortedAlertHistory = [...alertHistory].sort((a, b) => {
            const time1 = a.alertHistory.timeStart;
            const time2 = b.alertHistory.timeStart;

            if (time1 < time2) {
                return 1;
            }
            if (time1 > time2) {
                return -1;
            }
            return 0;
        });
        setAlertHistory(sortedAlertHistory);
    }

    function sortListByLeastRecent() {
        const sortedAlertHistory = [...alertHistory].sort((a, b) => {
            const time1 = a.alertHistory.timeStart;
            const time2 = b.alertHistory.timeStart;

            if (time1 > time2) {
                return 1;
            }
            if (time1 < time2) {
                return -1;
            }
            return 0;
        });
        setAlertHistory(sortedAlertHistory);
    }

    return (
        <div className={"alert_view-page"}>
            <header>
                <ArrowBack onClick={handleBack} fontSize={"large"}/>
            </header>


            <div className={"alertInfo"}>
                <h3>Title</h3>
                <p>{alert.title}</p>
                <h3>Description</h3>
                <p>{alert.description}</p>
            </div>

            <div>
                <h3>Connected Contacts</h3>
                {alert.sms.sendSMS ? (
                    <div>
                        {contacts.length > 0 && (contacts.map((contact, index) =>
                            <ContactCard key={index} contact={contact}/>
                        ))}
                    </div>
                ) : (
                    <div>SMS is not configured for this alert</div>
                )}
            </div>

            <div className={"crud"}>
                <Delete onClick={handleDelete} fontSize={"inherit"}></Delete>
                <Edit onClick={handleEdit} fontSize={"inherit"}></Edit>
            </div>

            <div className={"alertHistory"}>
                <p>Alert History</p>

                {alertHistory.length > 0 ? (
                    <div>
                        <Stack onClick={sortListByMostRecent} direction="row" alignItems="center" gap={1}>
                            <Sort/>
                            <Typography variant="body1">Most Recent</Typography>
                        </Stack>

                        <Stack onClick={sortListByLeastRecent} direction="row" alignItems="center" gap={1}>
                            <Sort/>
                            <Typography variant="body1">Least Recent</Typography>
                        </Stack>

                        {alertHistory.map((index) =>
                            <AlertHistoryCard key={index.alertHistory.id} alertHistory={index.alertHistory}
                                              onDelete={updateList}/>)}


                    </div>

                ) : (
                    <p>No history found.</p>
                )}
            </div>

            <div><BottomNav/></div>
        </div>
    );
}

export default AlertViewPage;

// //https://stackoverflow.com/questions/51940157/how-to-align-horizontal-icon-and-text-in-mui
//    }//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort