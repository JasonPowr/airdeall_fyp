import React from "react";
import {makeStyles, TextField} from "@material-ui/core";
import {useFormik} from "formik";
import Button from "@mui/material/Button";
import {incidentReportSchema} from "../../../Helpers/Validation/incidentReportSchema";
import {addPublicAlert, deleteIncidentReport, updateAlertHistory, updateIncidentReport} from "../../../model/db/DB";


const useStyles = makeStyles({
    button: {
        marginTop: '20px',
        backgroundColor: 'white !important',
        color: 'black !important',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '222px',
        textAlign: 'center',
        textDecoration: 'none',
    },
    btn_div: {
        paddingTop: "20px",
        margin: "auto",
        paddingBottom: "20px",
    }
})

function SubmitAlertIncidentToMap({alert, alertHistory, setIsSubmitted, incidentReport, setIncidentReport}) {
    const classes = useStyles();

    const onSubmit = async () => {

        let publicAlert = {
            timeStart: alertHistory.timeStart,
            timeEnd: alertHistory.timeEnd,
            date: alertHistory.date,
            incidentReport: values.incidentReport,
            location: alertHistory.locationInfo[0],
            alertId: alert.id
        }

        let update = {
            incidentReport: values.incidentReport,
        }

        try {
            await addPublicAlert(alertHistory.id, publicAlert)
            await updateAlertHistory(alert.id, alertHistory.id, update)
            setIsSubmitted(true)
            setIncidentReport(values.incidentReport)
        } catch (error) {
            console.log(error)
        }
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            incidentReport: incidentReport ? incidentReport : "",
        },
        validationSchema: incidentReportSchema,
        onSubmit,
    })

    async function handleEdit() {
        try {
            await updateIncidentReport(alert.id, alertHistory.id, values.incidentReport)
            setIsSubmitted(true)
            setIncidentReport(values.incidentReport)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDelete() {
        try {
            await deleteIncidentReport(alert.id, alertHistory.id)
            setIsSubmitted(true)
            setIncidentReport(null)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} autoComplete={"off"}>
            <h1 style={{fontSize: "15px", width: "80%", margin: "auto"}}> Would You like to submit this incident
                to the map</h1>

            <TextField
                error={!!(errors.incidentReport && touched.incidentReport)}
                value={values.incidentReport}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                minRows={6}
                maxRows={8}
                className={"textField"}
                id={"incidentReport"}
                placeholder={"Incident Report"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>

            {incidentReport ? (
                <div>
                    <div className={classes.btn_div}>
                        <Button className={classes.button} onClick={handleEdit} variant={"contained"}
                                size={"large"}><b>Edit</b></Button>

                    </div>
                    <div>
                        <Button style={{marginBottom: "20px"}} className={classes.button} onClick={handleDelete}
                                variant={"contained"}
                                size={"large"}><b>Delete</b></Button>
                    </div>
                </div>
            ) : (
                <div className={classes.btn_div}>
                    <Button className={classes.button} type={"submit"}
                            variant={"contained"}
                            size={"large"}><b>Submit</b></Button>
                </div>
            )}
        </form>
    )
}

export default SubmitAlertIncidentToMap;
//https://stackoverflow.com/questions/46393703/text-area-in-material-ui