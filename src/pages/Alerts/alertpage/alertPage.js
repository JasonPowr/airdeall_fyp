import {UserAuth} from "../../../contexts/authContext";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button} from "@material-ui/core";
import AlertCard from "../../../components/Cards/AlertCard";
import {auth, db} from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./alertPage.css"

function AlertsPage() {
    const { user, logOut } = UserAuth()
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [cards, setCards] = useState([]);

    useEffect(  () => {
        getAlertData().then(r => {})
        async function getAlertData() {
            const querySnapshot = await getDocs(collection(db, "users", `${auth.currentUser.uid}`, "alerts"));
            const cardsData = [];
            querySnapshot.forEach((doc) => {
                cardsData.push({
                    id: doc.id,
                    title: doc.data().alert.title,
                    description: doc.data().alert.desc
                });
                setCards(cardsData)
            });
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        try {
            logOut()
            navigate('/')
        }catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    }

    return (
        <div className={"createAlertPage"}>
            <p>Hello user: {user && user.displayName}</p>

            <div className={"alertContainer"}>
                {cards.map((alert) =>
                    <AlertCard key={alert.id} title={alert.title} description={alert.description}/>)}
            </div>

            <Link to={"/create_alert"}><Button>Create Alert</Button></Link>
            <Button onClick={handleSubmit}>Sign Out</Button>
        </div>
    );
}

export default AlertsPage;