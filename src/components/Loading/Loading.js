import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        textAlign: 'center',
        display: 'block',
        fontFamily: "Raleway",
        paddingTop: "50%"
    },
})

export default function Loading() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Box>
                <CircularProgress/>
                <h3>Loading...</h3>
            </Box>
        </div>
    );
}

//https://mui.com/material-ui/react-progress/