import "./createAlertPage.css"
import CreateAlertForm from "../../../components/Forms/createForm/createAlertForm";
import BottomNav from "../../../components/bottomNav/bottomNav";

export default function CreateAlertPage() {
    return (
        <div>
            <p>Create An alert</p>
            <CreateAlertForm/>
            <BottomNav/>
        </div>
    );
}

//https://github.com/draftbit/twitter-lite