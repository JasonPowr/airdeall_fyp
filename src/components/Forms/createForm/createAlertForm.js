import {Button, makeStyles} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {useFormik} from "formik";
import {createAlertValidationSchema} from "../../../Helpers/Validation/CreateAlertValidation";
import {createAlert, updateAlert} from "../../../model/db/DB";
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
import {addAlertToLocalStorage, updateAlertInLocalStorage} from "../../../model/local/localStorage";
import Loading from "../../Loading/Loading";


const useStyles = makeStyles({
    container: {
        maxWidth: "320px",
        margin: "auto",
    },
    button: {
        marginTop: '20px',
        backgroundColor: 'white !important',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '222px',
        textAlign: 'center',
        textDecoration: 'none',
    },
})

export default function CreateAlertForm({editAlert}) {
    const classes = useStyles();
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

    const onSubmit = async () => {
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
                    contact_1: values.contacts.contact_1,
                    contact_2: values.contacts.contact_2,
                    contact_3: values.contacts.contact_3,
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
            addAlertToLocalStorage(alert)
            navigate('/alerts')
        } catch (error) {
            setError(error.message);
        }
    }

    const {values, handleChange, handleBlur, errors, touched, handleSubmit} = useFormik({
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
                contact_1: editAlert ? editAlert.sms.contacts.contact_1 : false,
                contact_2: editAlert ? editAlert.sms.contacts.contact_2 : false,
                contact_3: editAlert ? editAlert.sms.contacts.contact_3 : false,
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
        onSubmit
    })

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
                    contact_1: values.contacts.contact_1,
                    contact_2: values.contacts.contact_2,
                    contact_3: values.contacts.contact_3,
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
            updateAlertInLocalStorage(editAlert.id, updatedAlert)
            navigate(`/${editAlert.id}/alert_view`, {state: {alertId: editAlert.id}});
        })

    }

    function handleCancelUpdate() {
        navigate(`/${editAlert.id}/alert_view`, {state: {alertId: editAlert.id}});
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
                <form onSubmit={handleSubmit} autoComplete={"off"}>

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

                    <div className={classes.container}>

                        <SMSComponent
                            isPhoneLinked={isPhoneLinked}
                            handleChange={handleChange}
                            editAlert={editAlert}
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


                        <div>
                            {editAlert ?
                                <Button className={classes.button} onClick={handleUpdate} variant={"contained"}
                                        size={"large"}><b>Update Alert</b></Button> :
                                <Button className={classes.button} type={"submit"} variant={"contained"}
                                        size={"large"}><b>Create Alert</b></Button>
                            }

                        </div>

                        <div>
                            {editAlert ?

                                <Button style={{marginBottom: "15px"}} className={classes.button}
                                        onClick={handleCancelUpdate}> <b>Cancel</b>
                                </Button> :
                                <Button style={{marginBottom: "15px"}} className={classes.button}
                                        onClick={handleCancelCreate}><b> Cancel</b>
                                </Button>}
                        </div>
                    </div>
                </form>
            ) : (
                <Loading/>
            )}
        </div>
    );
}