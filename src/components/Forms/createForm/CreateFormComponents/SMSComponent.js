import React, {useEffect, useState} from 'react';
import {Switch} from "@mui/material";
import {Button, makeStyles, TextField} from "@material-ui/core";
import TrustedContactPicker from "../../../Contacts/contacts";
import ContactCard from "../../../Cards/ContactCard/contactCard";


const useStyles = makeStyles({
    outer_sms: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        marginTop: '5px',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '250px',
        textAlign: 'center',
        textDecoration: 'none',
        marginBottom: '10px',
    },
    border: {
        border: "3px solid white",
        paddingTop: "25px",
        paddingBottom: "25px",
        borderRadius: "30px",
        width: "90%",
        maxWidth: "600px",
        margin: "auto",
    }
})

function SMSComponent({
                          isPhoneLinked,
                          handleChange,
                          editAlert,
                          errors,
                          touched,
                          handleBlur,
                          values,
                          geoLocationPermissionsGranted
                      }) {
    const [trustedContacts_, setTrustedContacts_] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        if (editAlert) {
            if (editAlert.sms.sendSMS) {
                const contacts = [editAlert.sms.contacts.contact_1, editAlert.sms.contacts.contact_2, editAlert.sms.contacts.contact_3,];
                setTrustedContacts_(contacts);
            }
        }
    }, []);

    const handleTrustedContacts = async () => {
        const trustedContacts = await TrustedContactPicker();

        let contact_1 = {
            name: "",
            phone: 0,
        }

        let contact_2 = {
            name: "",
            phone: 0,
        }

        let contact_3 = {
            name: "",
            phone: 0,
        }

        if (trustedContacts[0] != null) {
            contact_1.name = trustedContacts[0].name[0]
            contact_1.phone = trustedContacts[0].tel[0]
            values.contacts.contact_1 = contact_1
        }

        if (trustedContacts[1] != null) {
            contact_2.name = trustedContacts[1].name[0]
            contact_2.phone = trustedContacts[1].tel[0]
            values.contacts.contact_2 = contact_2
        }

        if (trustedContacts[2] != null) {
            contact_3.name = trustedContacts[2].name[0]
            contact_3.phone = trustedContacts[2].tel[0]
            values.contacts.contact_3 = contact_3
        }

        if (trustedContacts.length <= 3) {
            setTrustedContacts_(trustedContacts);
        } else {
            alert("You can only select up to three Contacts");
        }
    }

    return (
        <div>
            {isPhoneLinked ? (
                <div className={classes.outer_sms}>
                    <p>Send SMS message</p>
                    <Switch
                        onChange={handleChange}
                        id={"smsMessage"}
                        defaultChecked={editAlert ? editAlert.sms.sendSMS : false}/>

                </div>) : (

                <div>
                    <p>You must verify you phone number before using SMS</p>
                    <Switch
                        onChange={handleChange}
                        id={"smsMessage"}
                        disabled={true}
                        defaultChecked={editAlert ? editAlert.sms.sendSMS : false}/>
                </div>

            )}

            {values.smsMessage && (
                <div className={classes.border}>
                    <div>
                        <div>
                            <TextField
                                error={!!(errors.messageBody && touched.messageBody)}
                                label={errors.messageBody && touched.messageBody ? "Invalid Message Body" : "Message Body"}
                                helperText={errors.messageBody && touched.messageBody ? errors.messageBody : " "}
                                value={values.messageBody}
                                variant="filled"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={"textField"}
                                id={"messageBody"}
                                placeholder={"Alert Message"}
                                InputProps={{
                                    disableUnderline: true,
                                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                                }}/>
                        </div>

                        {editAlert ? (
                            <Button className={classes.button} onClick={handleTrustedContacts} variant={"contained"}
                                    size={"large"}><b> Update Trusted Contacts</b></Button>
                        ) : (
                            <Button className={classes.button} onClick={handleTrustedContacts} variant={"contained"}
                                    size={"large"}><b> Set Trusted Contacts</b></Button>

                        )}

                        {trustedContacts_.length > 0 && (trustedContacts_.map((contact, index) => <ContactCard
                            key={index}
                            contact={contact}/>))}

                    </div>

                    {geoLocationPermissionsGranted ? (
                        <div>
                            <div className={classes.outer_sms}>
                                <p>Include location Information</p>
                                <Switch
                                    onChange={handleChange}
                                    id={"locationInfo"}
                                    defaultChecked={editAlert ? editAlert.sms.locationInfo : false}
                                />
                            </div>

                            <div className={classes.outer_sms}>
                                <p>Location Updates</p>
                                <Switch
                                    onChange={handleChange}
                                    id={"recurringLocationInfo"}
                                    defaultChecked={editAlert ? editAlert.sms.recurringLocationInfo : false}
                                />
                            </div>

                            <div className={classes.outer_sms}>
                                <p>Proximity SMS</p>
                                <Switch
                                    onChange={handleChange}
                                    id={"proximitySMS"}
                                    defaultChecked={editAlert ? editAlert.sms.proximitySMS : false}
                                />
                            </div>
                        </div>
                    ) : (
                        <p>Location is not enabled</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default SMSComponent