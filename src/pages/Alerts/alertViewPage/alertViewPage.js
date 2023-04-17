import BottomNav from "../../../components/bottomNav/bottomNav";
import {useLocation, useNavigate} from "react-router-dom";
import {deleteAlert, getAlertById, getAllAlertHistory} from "../../../model/db/DB";
import React, {useEffect, useState} from "react";
import {auth} from "../../../firebase";
import {ArrowDownward, ArrowUpward, Delete, Edit} from "@material-ui/icons";
import ContactCard from "../../../components/Cards/ContactCard/contactCard";
import AlertHistoryCard from "../../../components/Cards/AlertHistoryCard/AlertHistoryCard";
import {Stack, Typography} from "@mui/material";
import ConfirmationPopup from "../../../components/Popup/DeleteConfirmationPopup/ConfirmationPopup";
import {deleteAlertFromLocalStorage} from "../../../model/local/localStorage";
import {Button, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        overflow: "auto",
        height: "92.60%",
    },
    alertInfo: {
        marginTop: "30px",
        margin: "auto",
        fontSize: "25px",
        width: "90%",
        maxWidth: "700px",
        borderRadius: "20px",
        height: "100px"
    },
    button: {
        backgroundColor: 'white !important',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '222px',
        textAlign: 'center',
        textDecoration: 'none',
        marginBottom: "20px",
        marginRight: "20px",
    },
    historyHeaders: {
        display: "flex",
        justifyContent: "space-evenly",
        margin: "auto",
        paddingBottom: "20px",
        maxWidth: "350px"
    }
})

function AlertViewPage() {
    const location = useLocation();
    const alertId = location.state?.alertId;
    const [alert, setAlert] = useState(null);
    const [alertHistory, setAlertHistory] = useState([])
    const [contacts, setContacts] = useState(null)
    const [openDeleteAlertConfirmation, setOpenDeleteAlertConfirmation] = useState(false);
    const classes = useStyles();
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
        setOpenDeleteAlertConfirmation(true)
    }

    async function handleDeleteAfterConf(confirmation) {
        if (confirmation) {
            await deleteAlert(alertId).then()
            deleteAlertFromLocalStorage(alertId)
            navigate(`/alerts`)
        }
    }

    function handleEdit() {
        navigate(`/${alert.id}/edit_alert`, {state: {alertId: alert.id}});
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
        <div className={classes.container}>

            <div className={classes.alertInfo}>
                <p><b>{alert.title}</b></p>
                <p><b>{alert.description}</b></p>
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


            <div>
                {alertHistory.length > 0 ? (
                    <div>
                        <h3><u>Alert History</u></h3>

                        <div className={classes.historyHeaders}>

                            <Stack onClick={sortListByMostRecent} direction="row" alignItems="center" gap={1}>
                                <ArrowUpward/>
                                <Typography variant="body1">Most Recent</Typography>
                            </Stack>

                            <Stack onClick={sortListByLeastRecent} direction="row" alignItems="center" gap={1}>
                                <ArrowDownward/>
                                <Typography variant="body1">Least Recent</Typography>
                            </Stack>

                        </div>

                        {alertHistory.map((index) =>
                            <AlertHistoryCard key={index.alertHistory.id} alertHistory={index.alertHistory}
                                              onDelete={updateList}/>)}


                    </div>

                ) : (
                    <p>No history found.</p>
                )}
            </div>

            {openDeleteAlertConfirmation && (
                <ConfirmationPopup openConfirmationDialog={openDeleteAlertConfirmation}
                                   setOpenConfirmationDialog={setOpenDeleteAlertConfirmation}
                                   handleConfirmation={handleDeleteAfterConf}
                                   context={"delete this Alert"}/>
            )}

            <div>
                <Button className={classes.button} onClick={handleDelete} fontSize={"large"}> <Delete/></Button>
                <Button className={classes.button} onClick={handleEdit} fontSize={"large"}> <Edit/></Button>
            </div>

            <div><BottomNav value={0}/></div>
        </div>
    );
}

export default AlertViewPage;

// //https://stackoverflow.com/questions/51940157/how-to-align-horizontal-icon-and-text-in-mui
//    }//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort