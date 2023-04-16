import React from 'react';
import {Switch} from "@mui/material";
import {makeStyles} from "@material-ui/core";


const useStyles = makeStyles({
    outer_sms: {
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
})

function IncludeOnPublicMap({geoLocationPermissionsGranted, editAlert, handleChange}) {
    const classes = useStyles();

    return (
        <div>
            {geoLocationPermissionsGranted ? (

                <div className={classes.outer_sms}>
                    <p>Include On Public map</p>
                    <Switch
                        type={"checkbox"}
                        defaultChecked={editAlert ? editAlert.includeOnPublicMap : false}
                        onChange={handleChange}
                        id={"includeOnPublicMap"}
                    /></div>

            ) : (
                <div className={classes.outer_sms}>
                    <p>Location is not enabled</p>
                    <Switch
                        type={"checkbox"}
                        defaultChecked={editAlert ? editAlert.includeOnPublicMap : false}
                        disabled={true}
                        onChange={handleChange}
                        id={"includeOnPublicMap"}
                    /></div>

            )}

        </div>
    );
}

export default IncludeOnPublicMap