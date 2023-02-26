import {Button, TextField} from "@material-ui/core";
import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {createAlertValidationSchema} from "../../../Helpers/Validation/CreateAlertValidation";
import {auth, db} from "../../../firebase";
import {doc, setDoc} from "firebase/firestore";
import {Switch} from "@mui/material";
import TrustedContactPicker from "../../../Helpers/Contacts/contacts";
import "./createAlertPage.css"


export default function CreateAlertPage() {
    const navigate = useNavigate()

    const onSubmit = async () => {

        const alert = {
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
        }

        const alertRef = doc(db, "users", `${auth.currentUser.uid}`, "alerts", `${alert.title}`);
        await setDoc(alertRef, {alert}, {merge: true});

        navigate('/alerts')
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            title: "",
            alertDesc: "",
            smsMessage: false,
            locationInfo: false,
            recurringLocationInfo: false,
            messageBody: "",
            contacts: {
                contact_1: {
                    name: "",
                    phone: "",
                },
                contact_2: {
                    name: "",
                    phone: "",
                },
                contact_3: {
                    name: "",
                    phone: "",
                }
            },
            alarm: false,
            flashlight: false,
        },
        validationSchema: createAlertValidationSchema,
        onSubmit,
    })

    let trustedContacts = [];
    const handleTrustedContacts = async () => {
        trustedContacts = await TrustedContactPicker();

        let html = "";
        if (trustedContacts.length <= 3) {
            for (let i = 0; i < trustedContacts.length; i++) {
                html += `<p>Name: ${trustedContacts[i].name} Phone: ${trustedContacts[i].tel[0]}</p>`;
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


    return (
        <div className={"createAlertPage"}>
            <div>
                <p>Create Alert</p>
            </div>

            <form onSubmit={handleSubmit} autoComplete={"off"}>
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
                                />
                            </div>

                            <div>
                                <p>recurringLocationInfo</p>
                                <Switch
                                    onChange={handleChange}
                                    id={"recurringLocationInfo"}
                                />
                            </div>

                        </div>
                    )}

                </div>

                <div>
                    <p>Sound Alarm</p>

                    <Switch
                        onChange={handleChange}
                        id={"alarm"}
                    />
                </div>

                <div>
                    <p>Trigger Flashlight</p>

                    <Switch
                        onChange={handleChange}
                        id={"flashlight"}
                    />
                </div>

                <Button type={"submit"}> Create </Button>
                <Link to={"/alerts"}><Button> Cancel </Button></Link>
            </form>
        </div>
    );
}