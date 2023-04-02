import {Button, TextField} from "@material-ui/core";
import {Switch} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {useFormik} from "formik";
import {createAlertValidationSchema} from "../../../Helpers/Validation/CreateAlertValidation";
import TrustedContactPicker from "../../Contacts/contacts";
import {createAlert, updateAlert} from "../../../model/db/DB";
import styles from "./createAlertForm.css";
import {useContext, useEffect, useState} from "react";
import {ErrorDialog} from "../../Popup/ErrorPopup/ErrorPopUp";
import {loginWithFacebook} from "../../Socials/facebook/facebook";
import {auth} from "../../../firebase";
import UserContext from "../../../contexts/Auth/authContext";

export default function CreateAlertForm({editAlert}) {
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const {user} = useContext(UserContext)
    const [facebookLinked, isFacebookLinked] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                if (user.providerData.length > 1) {
                    user.providerData.map((index) => {
                        if (index.providerId === "facebook.com") {
                            isFacebookLinked(true)
                        }
                    })
                }
            }
        })
    }, [user]);

    const {values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            title: editAlert ? editAlert.title : "",
            alertDesc: editAlert ? editAlert.desc : "",
            smsMessage: editAlert ? editAlert.sms.sendSMS : false,
            locationInfo: editAlert ? editAlert.sms.locationInfo : false,
            recurringLocationInfo: editAlert ? editAlert.sms.recurringLocationInfo : false,
            messageBody: editAlert ? editAlert.sms.message.body : "",
            contacts: {
                contact_1: {
                    name: editAlert ? editAlert.sms.contacts.contact_1.name : "",
                    phone: editAlert ? editAlert.sms.contacts.contact_1.phone : "",
                },
                contact_2: {
                    name: editAlert ? editAlert.sms.contacts.contact_2.name : "",
                    phone: editAlert ? editAlert.sms.contacts.contact_2.phone : "",
                },
                contact_3: {
                    name: editAlert ? editAlert.sms.contacts.contact_3.name : "",
                    phone: editAlert ? editAlert.sms.contacts.contact_3.phone : "",
                }
            },
            includeOnPublicMap: editAlert ? editAlert.includeOnPublicMap : false,
            proximitySMS: editAlert ? editAlert.proximitySMS : false,
            alarm: editAlert ? editAlert.alarm : false,
            flashlight: editAlert ? editAlert.flashlight : false,
            automaticRecordings: editAlert ? editAlert.automaticRecordings : false,
            socialMediaIntegration: {
                isEnabled: editAlert ? editAlert.socialMediaIntegration.isEnabled : false,
                facebook: {
                    isEnabled: editAlert ? editAlert.socialMediaIntegration.facebook.isEnabled : false,
                    isLinked: editAlert ? editAlert.socialMediaIntegration.facebook.isLinked : false,
                    isPostEnabled: editAlert ? editAlert.socialMediaIntegration.facebook.isPostEnabled : false,
                }
            }
        },
        validationSchema: createAlertValidationSchema,
    })

    async function handleCreate() {
        const alert = {
            id: uuidv4(),
            title: values.title,
            desc: values.alertDesc,
            sms: {
                sendSMS: values.smsMessage,
                locationInfo: values.locationInfo,
                recurringLocationInfo: values.recurringLocationInfo,
                message: {
                    body: values.messageBody,
                },
                contacts: {
                    contact_1: {
                        name: values.contacts.contact_1.name,
                        phone: values.contacts.contact_1.phone,
                    },
                    contact_2: {
                        name: values.contacts.contact_2.name,
                        phone: values.contacts.contact_2.phone,
                    },
                    contact_3: {
                        name: values.contacts.contact_3.name,
                        phone: values.contacts.contact_3.phone,
                    }
                },
            },
            alarm: values.alarm,
            flashlight: values.flashlight,
            includeOnPublicMap: values.includeOnPublicMap,
            proximitySMS: values.proximitySMS,
            automaticRecordings: values.automaticRecordings,
            socialMediaIntegration: {
                isEnabled: values.socialMediaIntegration.isEnabled,
                facebook: {
                    isEnabled: values.socialMediaIntegration.facebook.isEnabled,
                    isLinked: values.socialMediaIntegration.facebook.isLinked,
                    isPostEnabled: values.socialMediaIntegration.facebook.isPostEnabled,
                }
            }
        }
        try {
            await createAlert(alert)
            navigate('/alerts')
        } catch (error) {
            setError(error.message);
        }
    }

    function handleCancelCreate() {
        navigate('/alerts')
    }

    function handleUpdate() {
        const updatedAlert = {
            id: editAlert.id,
            title: values.title,
            desc: values.alertDesc,
            sms: {
                sendSMS: values.smsMessage,
                locationInfo: values.locationInfo,
                recurringLocationInfo: values.recurringLocationInfo,
                message: {
                    body: values.messageBody,
                },
                contacts: {
                    contact_1: {
                        name: values.contacts.contact_1.name,
                        phone: values.contacts.contact_1.phone,
                    },
                    contact_2: {
                        name: values.contacts.contact_2.name,
                        phone: values.contacts.contact_2.phone,
                    },
                    contact_3: {
                        name: values.contacts.contact_3.name,
                        phone: values.contacts.contact_3.phone,
                    }
                },
            },
            alarm: values.alarm,
            flashlight: values.flashlight,
            includeOnPublicMap: values.includeOnPublicMap,
            proximitySMS: values.proximitySMS,
            automaticRecordings: values.automaticRecordings,
            socialMediaIntegration: {
                isEnabled: values.socialMediaIntegration.isEnabled,
                facebook: {
                    isEnabled: values.socialMediaIntegration.facebook.isEnabled,
                    isLinked: values.socialMediaIntegration.facebook.isLinked,
                    isPostEnabled: values.socialMediaIntegration.facebook.isPostEnabled,
                }
            }
        }

        updateAlert(updatedAlert).then(r => {
            navigate(`/${editAlert.id}/alert_view`, {state: {alertId: editAlert.id}});
        })

    }

    function handleCancelUpdate() {
        navigate(`/${editAlert.id}/alert_view`, {state: {alertId: editAlert.id}});
    }


    let trustedContacts = [];
    const handleTrustedContacts = async () => {
        trustedContacts = await TrustedContactPicker();

        let html = "";
        if (trustedContacts.length <= 3) {
            for (let i = 0; i < trustedContacts.length; i++) {
                html += `<Contact/>`;
            }
            document.getElementById("contact-list").innerHTML = html;

            if (trustedContacts[0].name != null) {
                values.contacts.contact_1.name = trustedContacts[0].name
                values.contacts.contact_1.phone = trustedContacts[0].tel[0]
            }

            if (trustedContacts[1].name != null) {
                values.contacts.contact_2.name = trustedContacts[1].name
                values.contacts.contact_2.phone = trustedContacts[1].tel[0]
            }

            if (trustedContacts[2].name != null) {
                values.contacts.contact_3.name = trustedContacts[2].name
                values.contacts.contact_3.phone = trustedContacts[2].tel[0]
            }

        } else {
            alert("You can only select up to three Contacts")
            trustedContacts = null
        }

    }

    const handleFacebookLink = async () => {
        try {
            loginWithFacebook()
            isFacebookLinked(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseError = () => {
        setError(null);
        return false
    };

    return (
        <div className={styles.createAlertForm}>
            <form autoComplete={"off"}>

                <div>
                    {error && <ErrorDialog message={error} onCloseClick={handleCloseError}/>}
                </div>


                <div>
                    <TextField
                        error={!!(errors.title && touched.title)}
                        label={errors.title && touched.title ? "Invalid Name" : "Alert Name"}
                        helperText={errors.title && touched.title ? errors.title : " "}
                        value={values.title}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"textField"}
                        id={"title"}
                        placeholder={"Alert Title"}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                        }}/>
                </div>

                <div>
                    <TextField
                        error={!!(errors.alertDesc && touched.alertDesc)}
                        label={errors.alertDesc && touched.alertDesc ? "Invalid Desc" : "Alert Desc"}
                        helperText={errors.alertDesc && touched.alertDesc ? errors.alertDesc : " "}
                        value={values.alertDesc}
                        variant="filled"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"textField"}
                        id={"alertDesc"}
                        placeholder={"Alert Description"}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                        }}/>
                </div>

                <div>
                    <p>SMS message</p>
                    <Switch
                        onChange={handleChange}
                        id={"smsMessage"}
                        defaultChecked={editAlert ? editAlert.sms.sendSMS : false}
                    />

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

                            <div>
                                <p>locationInfo</p>
                                <Switch
                                    onChange={handleChange}
                                    id={"locationInfo"}
                                    defaultChecked={editAlert ? editAlert.locationInfo : false}
                                />
                            </div>

                            <div>
                                <p>recurringLocationInfo</p>
                                <Switch
                                    onChange={handleChange}
                                    id={"recurringLocationInfo"}
                                    defaultChecked={editAlert ? editAlert.recurringLocationInfo : false}
                                />
                            </div>

                        </div>
                    )}

                </div>

                <div>
                    <p>Include On Public map</p>

                    <Switch
                        type={"checkbox"}
                        defaultChecked={editAlert ? editAlert.includeOnPublicMap : false}
                        onChange={handleChange}
                        id={"includeOnPublicMap"}
                    />

                    {values.includeOnPublicMap && (
                        <div>
                            <p>Proximity Alert</p>

                            <Switch
                                onChange={handleChange}
                                id={"proximitySMS"}
                                defaultChecked={editAlert ? editAlert.proximitySMS : false}
                            />
                        </div>
                    )}
                </div>


                <div>
                    <p>Sound Alarm</p>

                    <Switch
                        onChange={handleChange}
                        id={"alarm"}
                        defaultChecked={editAlert ? editAlert.alarm : false}
                    />
                </div>

                <div>
                    <p>Trigger Flashlight</p>

                    <Switch
                        onChange={handleChange}
                        id={"flashlight"}
                        defaultChecked={editAlert ? editAlert.flashlight : false}
                    />
                </div>

                <div>
                    <p>Automatic recording</p>

                    <Switch
                        onChange={handleChange}
                        id={"automaticRecordings"}
                        defaultChecked={editAlert ? editAlert.automaticRecordings : false}
                    />
                </div>

                <div>
                    <p>Social Media Integration</p>

                    <Switch
                        onChange={handleChange}
                        id={"socialMediaIntegration.isEnabled"}
                        defaultChecked={editAlert ? editAlert.socialMediaIntegration.isEnabled : false}
                    />

                    {values.socialMediaIntegration.isEnabled && (
                        <div>
                            <p>Facebook</p>

                            <Switch
                                onChange={handleChange}
                                id={"socialMediaIntegration.facebook.isEnabled"}
                                defaultChecked={editAlert ? editAlert.socialMediaIntegration.facebook.isEnabled : false}
                            />
                            {values.socialMediaIntegration.facebook.isEnabled && (
                                <div>
                                    {facebookLinked ? (
                                        <div>
                                            <div>
                                                <p>Post to facebook</p>

                                                <Switch
                                                    onChange={handleChange}
                                                    id={"socialMediaIntegration.facebook.isPostEnabled"}
                                                    defaultChecked={editAlert ? editAlert.socialMediaIntegration.facebook.isPostEnabled : false}
                                                />

                                            </div>

                                        </div>
                                    ) : (<Button onClick={handleFacebookLink}>Link Facebook</Button>)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {editAlert ? <Button onClick={handleUpdate}> Update </Button> :
                    <Button onClick={handleCreate}> Create </Button>}
                {editAlert ? <Button onClick={handleCancelUpdate}> Cancel </Button> :
                    <Button onClick={handleCancelCreate}> Cancel </Button>}
            </form>
        </div>
    );

}