import {Button} from "@material-ui/core";
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
import {getCameraPermissions, getGeoLocationPermissions, getMicPermissions} from "../../Permissions/Permissions";
import VoiceActivationComponent from "./CreateFormComponents/VoiceActivationComponent";
import SocialMediaIntegration from "./CreateFormComponents/SocialMediaComponent";
import AutomaticRecordings from "./CreateFormComponents/AutomaticRecordings";
import FlashlightComponent from "./CreateFormComponents/FlashlightComponent";
import SoundComponent from "./CreateFormComponents/SoundComponent";
import IncludeOnPublicMap from "./CreateFormComponents/IncludeOnPublicMap";
import SMSComponent from "./CreateFormComponents/SMSComponent";
import AlertDetailsComponent from "./CreateFormComponents/AlertDetailsComponent";

export default function CreateAlertForm({editAlert}) {
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const {user} = useContext(UserContext)

    const [isFacebookLinked, setIsFacebookLinked] = useState(false);
    const [isPhoneLinked, setIsPhoneLinked] = useState(false);
    const [geoLocationPermissionsGranted, setGeoLocationPermissionsGranted] = useState(false);
    const [cameraPermissionsGranted, setCameraPermissionsGranted] = useState(false);
    const [microphonePermissionsGranted, setMicrophonePermissionsGranted] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                user.providerData.map((index) => {
                    if (index.providerId === "facebook.com") {
                        setIsFacebookLinked(true)
                    } else if (index.providerId === "phone") {
                        setIsPhoneLinked(true)
                    }
                })
                setGeoLocationPermissionsGranted(getGeoLocationPermissions())
                setCameraPermissionsGranted(getCameraPermissions())
                setMicrophonePermissionsGranted(getMicPermissions())
            }
        })
    }, [user]);

    const {values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            title: editAlert ? editAlert.title : "",
            isActive: editAlert ? editAlert.state : false,
            description: editAlert ? editAlert.description : "",
            smsMessage: editAlert ? editAlert.sms.sendSMS : false,
            locationInfo: editAlert ? editAlert.sms.locationInfo : false,
            recurringLocationInfo: editAlert ? editAlert.sms.recurringLocationInfo : false,
            messageBody: editAlert ? editAlert.sms.message.body : "",
            proximitySMS: editAlert ? editAlert.sms.proximitySMS : false,
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
            alarm: editAlert ? editAlert.alarm : false,
            flashlight: editAlert ? editAlert.flashlight : false,
            automaticRecording: editAlert ? editAlert.automaticRecording : false,
            socialMediaIntegration: {
                isEnabled: editAlert ? editAlert.socialMediaIntegration.isEnabled : false,
                facebook: {
                    isEnabled: editAlert ? editAlert.socialMediaIntegration.facebook.isEnabled : false,
                    isLinked: editAlert ? editAlert.socialMediaIntegration.facebook.isLinked : false,
                    isPostEnabled: editAlert ? editAlert.socialMediaIntegration.facebook.isPostEnabled : false,
                }
            },
            voiceActivation: {
                isEnabled: editAlert ? editAlert.voiceActivation.isEnabled : false,
                voiceActivationPhrase: editAlert ? editAlert.voiceActivation.voiceActivationPhrase : "",
                voiceActivationForAlertWithCountDown: editAlert ? editAlert.voiceActivation.voiceActivationForAlertWithCountDown : false,
                voiceActivationForAlertWithoutCountDown: editAlert ? editAlert.voiceActivation.voiceActivationForAlertWithoutCountDown : false,
            }
        },
        validationSchema: createAlertValidationSchema,
    })

    async function handleCreate() {
        const alert = {
            id: uuidv4(),
            title: values.title,
            description: values.description,
            isActive: false,
            sms: {
                sendSMS: values.smsMessage,
                locationInfo: values.locationInfo,
                recurringLocationInfo: values.recurringLocationInfo,
                proximitySMS: values.proximitySMS,
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
            automaticRecording: values.automaticRecording,
            socialMediaIntegration: {
                isEnabled: values.socialMediaIntegration.isEnabled,
                facebook: {
                    isEnabled: values.socialMediaIntegration.facebook.isEnabled,
                    isLinked: values.socialMediaIntegration.facebook.isLinked,
                    isPostEnabled: values.socialMediaIntegration.facebook.isPostEnabled,
                }
            },
            voiceActivation: {
                isEnabled: values.voiceActivation.isEnabled,
                voiceActivationPhrase: values.voiceActivation.voiceActivationPhrase,
                voiceActivationForAlertWithCountDown: values.voiceActivation.voiceActivationForAlertWithCountDown,
                voiceActivationForAlertWithoutCountDown: values.voiceActivation.voiceActivationForAlertWithoutCountDown,
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
            isActive: false,
            description: values.description,
            sms: {
                sendSMS: values.smsMessage,
                locationInfo: values.locationInfo,
                recurringLocationInfo: values.recurringLocationInfo,
                proximitySMS: values.proximitySMS,
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
            automaticRecording: values.automaticRecording,
            socialMediaIntegration: {
                isEnabled: values.socialMediaIntegration.isEnabled,
                facebook: {
                    isEnabled: values.socialMediaIntegration.facebook.isEnabled,
                    isLinked: values.socialMediaIntegration.facebook.isLinked,
                    isPostEnabled: values.socialMediaIntegration.facebook.isPostEnabled,
                }
            },
            voiceActivation: {
                isEnabled: values.voiceActivation.isEnabled,
                voiceActivationPhrase: values.voiceActivation.voiceActivationPhrase,
                voiceActivationForAlertWithCountDown: values.voiceActivation.voiceActivationForAlertWithCountDown,
                voiceActivationForAlertWithoutCountDown: values.voiceActivation.voiceActivationForAlertWithoutCountDown,
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
            setIsFacebookLinked(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseError = () => {
        setError(null);
        return false
    };

    return (
        <div>
            {user ? (
                <div className={styles.createAlertForm}>
                    <form autoComplete={"off"}>

                        <div>
                            {error && <ErrorDialog message={error} onCloseClick={handleCloseError}/>}
                        </div>

                        <AlertDetailsComponent
                            errors={errors}
                            touched={touched}
                            values={values}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                        />

                        <SMSComponent
                            isPhoneLinked={isPhoneLinked}
                            handleChange={handleChange}
                            editAlert={editAlert}
                            handleTrustedContacts={handleTrustedContacts}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                            values={values}
                            geoLocationPermissionsGranted={geoLocationPermissionsGranted}
                        />

                        <IncludeOnPublicMap
                            geoLocationPermissionsGranted={geoLocationPermissionsGranted}
                            editAlert={editAlert}
                            handleChange={handleChange}
                        />

                        <SoundComponent
                            handleChange={handleChange}
                            editAlert={editAlert}/>

                        <FlashlightComponent
                            cameraPermissionsGranted={cameraPermissionsGranted}
                            editAlert={editAlert}
                            handleChange={handleChange}
                        />

                        <AutomaticRecordings
                            cameraPermissionsGranted={cameraPermissionsGranted}
                            microphonePermissionsGranted={microphonePermissionsGranted}
                            handleChange={handleChange}
                            editAlert={editAlert}
                            values={values}
                        />

                        <SocialMediaIntegration
                            socialMediaIntegrationEnabled={values.socialMediaIntegration.isEnabled}
                            handleChange={handleChange}
                            values={values}
                            errors={errors}
                            touched={touched}
                            editAlert={editAlert}
                            handleBlur={handleBlur}
                            isFacebookLinked={isFacebookLinked}
                            handleFacebookLink={handleFacebookLink}
                        />

                        <VoiceActivationComponent
                            microphonePermissionsGranted={microphonePermissionsGranted}
                            handleChange={handleChange}
                            editAlert={editAlert}
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleBlur={handleBlur}
                        />

                        {editAlert ? <Button onClick={handleUpdate}> Update </Button> :
                            <Button onClick={handleCreate}> Create </Button>}
                        {editAlert ? <Button onClick={handleCancelUpdate}> Cancel </Button> :
                            <Button onClick={handleCancelCreate}> Cancel </Button>}
                    </form>
                </div>

            ) : (
                <div>Loading ...</div>
            )}
        </div>
    );
}