import React from 'react';
import {TextField} from "@material-ui/core";


function AlertDetails({errors, touched, values, handleChange, handleBlur}) {

    return (
        <div>
            <TextField
                style={{marginRight: '20px'}}
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

            <TextField
                style={{marginRight: '20px'}}
                error={!!(errors.description && touched.description)}
                label={errors.description && touched.description ? "Invalid Description" : "Alert Description"}
                helperText={errors.description && touched.description ? errors.alertDesc : " "}
                value={values.description}
                variant="filled"
                onChange={handleChange}
                onBlur={handleBlur}
                className={"textField"}
                id={"description"}
                placeholder={"Alert Description"}
                InputProps={{
                    disableUnderline: true,
                    inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                }}/>
        </div>
    );
}

export default AlertDetails