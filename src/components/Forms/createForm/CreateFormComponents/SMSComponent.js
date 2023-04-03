import React from 'react';
import {Switch} from "@mui/material";
import {Button, TextField} from "@material-ui/core";

function SMSComponent({
                          isPhoneLinked,
                          handleChange,
                          editAlert,
                          handleTrustedContacts,
                          errors,
                          touched,
                          handleBlur,
                          values,
                          geoLocationPermissionsGranted
                      }) {
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
                    <Button className={"button"} onClick={handleTrustedContacts} variant={"contained"}
                            size={"large"}><b> Set Trusted Contacts</b></Button>

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

                    <p id={"contact-list"}></p>

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