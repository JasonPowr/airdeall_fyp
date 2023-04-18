import Card from '@mui/material/Card';
import {CardContent, CardHeader, IconButton, Typography} from "@mui/material";
import * as React from "react";
import {useContext, useState} from "react";
import {makeStyles} from "@material-ui/core";
import UserContext from "../../../contexts/Auth/authContext";
import {DeleteForever, Edit} from "@material-ui/icons";
import {deletePost} from "../../../model/db/DB";
import ConfirmationPopup from "../../Popup/DeleteConfirmationPopup/ConfirmationPopup";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles({
    card: {
        marginTop: "30px",
        width: "80%",
        maxWidth: "600px",
        margin: "auto",
    },
})

export default function UserPostCard({userPost, onDelete}) {
    const classes = useStyles();
    const {user} = useContext(UserContext)
    const navigate = useNavigate()
    const [openDeletePostConfirmation, setOpenDeletePostConfirmation] = useState(false);

    async function handleDelete() {
        setOpenDeletePostConfirmation(true)
    }

    async function handleDeleteAfterConf(confirmation) {
        if (confirmation) {
            await deletePost(userPost.id)
            onDelete()
        }
    }

    function handleEdit() {
        navigate(`/${userPost.id}/edit_post`, {state: {postId: userPost.id}});
    }

    return (
        <div>
            <Card className={classes.card}>
                <CardContent>

                    <CardHeader sx={{fontSize: "20px"}} title={userPost.userName}
                                subheader={userPost.date + " - " + userPost.time}
                                action={
                                    <div>
                                        {(user.uid === userPost.uid) && (
                                            <div>
                                                <IconButton onClick={handleEdit}>
                                                    <Edit/>
                                                </IconButton>

                                                <IconButton onClick={handleDelete}>
                                                    <DeleteForever/>
                                                </IconButton>
                                            </div>
                                        )}
                                    </div>
                                }
                    />

                    <Typography fontSize={15}>
                        {userPost.content}

                    </Typography>

                </CardContent>
            </Card>

            {openDeletePostConfirmation && (
                <ConfirmationPopup openConfirmationDialog={openDeletePostConfirmation}
                                   setOpenConfirmationDialog={setOpenDeletePostConfirmation}
                                   handleConfirmation={handleDeleteAfterConf}
                                   context={"delete this Post"}/>
            )}
        </div>
    )
}
