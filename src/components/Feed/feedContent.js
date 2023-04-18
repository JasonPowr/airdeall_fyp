import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core";
import CreatePost from "../Forms/createPost/createPostForm";
import {getAllPosts} from "../../model/db/DB";
import Loading from "../Loading/Loading";
import UserPostCard from "../Cards/UserPostCard/UserPostCard";
import {Fab} from "@mui/material";
import {Add} from "@material-ui/icons";

const useStyles = makeStyles({
    button: {
        position: "fixed",
        right: "30px",
        bottom: "100px"
    },
})

function FeedContent() {
    const [showCreatePost, setShowCreatePost] = useState(false)
    const [posts, setPosts] = useState(null)
    const classes = useStyles();

    useEffect(() => {
        getAllPosts().then((resp) => {
            setPosts(resp)
        })
    }, [])


    function handleCreatePost() {
        setShowCreatePost(true)
    }

    function updateList() {
        getAllPosts().then((resp) => {
            setPosts(resp)
        })
    }

    return (
        <div className={classes.container}>
            {showCreatePost ? (
                <CreatePost onCreate={updateList} setShowCreatePost={setShowCreatePost}/>
            ) : (
                <div>
                    {posts ? (
                        <div>
                            <h3 style={{textAlign: "center"}}>Post useful Information Here!</h3>
                            {(posts.length > 0) ? (
                                <div>
                                    {posts.map((post, index) => (
                                        <UserPostCard onDelete={updateList} key={index} userPost={post}/>
                                    ))}
                                </div>
                            ) : (
                                <div style={{textAlign: "center"}}>No Posts found</div>
                            )}

                            <div className={classes.button}>
                                <Fab size={"large"} onClick={handleCreatePost}>
                                    <Add/>
                                </Fab>
                            </div>
                        </div>
                    ) : (
                        <Loading/>
                    )}
                </div>
            )}
        </div>
    );
}


export default FeedContent;
