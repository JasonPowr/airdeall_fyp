import BottomNav from "../../components/bottomNav/bottomNav";
import React from "react";
import FeedContent from "../../components/Feed/feedContent";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    container: {
        display: 'block',
        fontFamily: "Raleway",
        overflow: "auto",
        height: "90%"
    },
})

function Feed() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <FeedContent/>
            <BottomNav value={2}/>
        </div>
    );
}


export default Feed;
