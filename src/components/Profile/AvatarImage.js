import Avatar from 'react-avatar';
import {useEffect, useState} from "react";
import {auth} from "../../firebase";

export function AvatarImage({size}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log(user)
                setUser(user)
            }
        })
    }, []);

    return (
        <div>
            {user && (
                <div>
                    <Avatar
                        name={user.displayName}
                        src={user.photoURL}
                        size={size}
                        round={true}
                    />
                </div>
            )}
        </div>
    )
}


//https://www.npmjs.com/package/react-avatar