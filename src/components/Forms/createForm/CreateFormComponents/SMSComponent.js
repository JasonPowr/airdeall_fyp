import React, {useEffect, useState} from 'react';
import {Switch} from "@mui/material";
import {Button, TextField} from "@material-ui/core";
import TrustedContactPicker from "../../../Contacts/contacts";
import ContactCard from "../../../Cards/ContactCard/contactCard";

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
            <p>SMS message</p>

            {isPhoneLinked ? (
                <Switch
                    onChange={handleChange}
                    id={"smsMessage"}
                    defaultChecked={editAlert ? editAlert.sms.sendSMS : false}/>) : (
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
                <div>

                    {editAlert ? (
                        <Button className={"button"} onClick={handleTrustedContacts} variant={"contained"}
                                size={"large"}><b> Update Trusted Contacts</b></Button>
                    ) : (
                        <Button className={"button"} onClick={handleTrustedContacts} variant={"contained"}
                                size={"large"}><b> Set Trusted Contacts</b></Button>

                    )}

                    {trustedContacts_.length > 0 && (trustedContacts_.map((contact, index) => <ContactCard key={index}
                                                                                                           contact={contact}/>))}

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

                    {geoLocationPermissionsGranted ? (
                        <div>
                            <p>locationInfo</p>
                            <Switch
                                onChange={handleChange}
                                id={"locationInfo"}
                                defaultChecked={editAlert ? editAlert.locationInfo : false}
                            />

                            <p>recurringLocationInfo</p>
                            <Switch
                                onChange={handleChange}
                                id={"recurringLocationInfo"}
                                defaultChecked={editAlert ? editAlert.recurringLocationInfo : false}
                            />

                            <p>Proximity Alert</p>

                            <Switch
                                onChange={handleChange}
                                id={"proximitySMS"}
                                defaultChecked={editAlert ? editAlert.proximitySMS : false}
                            />
                        </div>
                    ) : (
                        <div>
                            <p>You need to allow us to access you location</p>

                            <p>locationInfo</p>
                            <Switch
                                onChange={handleChange}
                                id={"locationInfo"}
                                disabled={true}
                                defaultChecked={editAlert ? editAlert.locationInfo : false}
                            />

                            <p>recurringLocationInfo</p>
                            <Switch
                                onChange={handleChange}
                                id={"recurringLocationInfo"}
                                disabled={true}
                                defaultChecked={editAlert ? editAlert.recurringLocationInfo : false}
                            />

                            <p>Proximity Alert</p>

                            <Switch
                                onChange={handleChange}
                                id={"proximitySMS"}
                                disabled={true}
                                defaultChecked={editAlert ? editAlert.proximitySMS : false}
                            />
                        </div>)}
                </div>
            )}
        </div>
    );
}

export default SMSComponent