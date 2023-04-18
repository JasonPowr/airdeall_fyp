import BottomNav from "../../components/bottomNav/bottomNav";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core";
import CreatePost from "../../components/Forms/createPost/createPostForm";
import {useLocation} from "react-router-dom";
import {getPostById} from "../../model/db/DB";

const useStyles = makeStyles({
    container: {
        display: 'block',
        fontFamily: "Raleway",
        overflow: "auto",
        height: "90%"
    },
})

function EditPost() {
    const classes = useStyles();
    const location = useLocation();
    const postId = location.state?.postId;
    const [post, setPost] = useState(null);

    useEffect(() => {
        getPostById(postId).then((foundPost) => {
            setPost(foundPost)
        })
    }, []);

    return (
        <div className={classes.container}>
            <CreatePost editPost={post}/>
            <BottomNav value={2}/>
        </div>
    );
}


export default EditPost;
