import {useFormik} from "formik";
import {Button, makeStyles, TextField} from "@material-ui/core";
import {postSchema} from "../../../Helpers/Validation/PostValidation";
import {createUserPost, editPostInDB} from "../../../model/db/DB";
import {v4 as uuidv4} from "uuid";
import * as React from "react";
import {useContext} from "react";
import UserContext from "../../../contexts/Auth/authContext";
import {useNavigate} from "react-router-dom";
import Card from "@mui/material/Card";
import {CardContent, CardHeader} from "@mui/material";

const useStyles = makeStyles({
    card: {
        marginTop: "30px",
        width: "80%",
        maxWidth: "600px",
        margin: "auto",
    },
    button: {
        marginTop: '20px',
        backgroundColor: 'white !important',
        color: 'black',
        fontFamily: 'Raleway',
        fontSize: '15px',
        width: '150px',
        textAlign: 'center',
        textDecoration: 'none',
    },
    btn_div: {
        margin: "auto",
        display: "flex",
        maxWidth: "320px",
        width: "100%",
        justifyContent: "space-between",
    }
})

export default function CreatePost({setShowCreatePost, editPost, onCreate}) {
    const classes = useStyles();
    const {user} = useContext(UserContext)
    const navigate = useNavigate()

    const onSubmit = async () => {

        const today = new Date();
        let date = (today.getDate()) + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const post = {
            id: uuidv4(),
            uid: user.uid,
            time: time,
            date: date,
            userName: user.displayName,
            content: values.content
        }

        await createUserPost(post)
        onCreate()
        setShowCreatePost(false)
    }

    const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
        initialValues: {
            content: editPost ? editPost.content : "",
        },
        validationSchema: postSchema,
        onSubmit,
    })

    function handleUpdate() {
        const today = new Date();
        let date = (today.getDate()) + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const updatedPost = {
            id: editPost.id,
            uid: user.uid,
            time: time,
            date: date,
            userName: user.displayName,
            content: values.content
        }

        editPostInDB(updatedPost).then(() => {
            navigate("/feed")
        })
    }

    function handleCancel() {
        navigate("/feed")
    }

    return (
        <form onSubmit={handleSubmit} autoComplete={"off"}>

            <Card className={classes.card}>
                <CardContent>

                    <CardHeader sx={{alignContent: "left !important"}} title={"Display Name"}
                                subheader={"Date & Time"}
                    />
                    <TextField
                        error={!!(errors.content && touched.content)}
                        label={errors.content && touched.content ? "Invalid content" : "content"}
                        helperText={errors.content && touched.content ? errors.content : " "}
                        value={values.content}
                        onChange={handleChange}
                        variant="filled"
                        onBlur={handleBlur}
                        className={"textField"}
                        id={"content"}
                        type={"text"}
                        placeholder={"Content"}
                        style={{
                            margin: "auto"
                        }}
                        InputProps={{
                            disableUnderline: true,
                            inputProps: {style: {backgroundColor: 'white', borderRadius: '10px'}}
                        }}/>

                </CardContent>
            </Card>

            {editPost ? (
                <div className={classes.btn_div}>
                    <Button className={classes.button} onClick={handleUpdate} variant={"contained"} size={"large"}><b>Update
                        Post</b></Button>

                    <Button className={classes.button} onClick={handleCancel} variant={"contained"}
                            size={"large"}><b>Cancel</b></Button>
                </div>

            ) : (

                <div className={classes.btn_div}>
                    <Button className={classes.button} type={"submit"} variant={"contained"} size={"large"}><b>Create
                        Post</b></Button>

                    <Button className={classes.button} onClick={() => {
                        setShowCreatePost(false)
                    }} variant={"contained"}
                            size={"large"}><b>Cancel</b></Button>
                </div>
            )}

        </form>
    );
}