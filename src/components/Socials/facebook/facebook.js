import {FacebookAuthProvider, getAuth, linkWithCredential} from "firebase/auth";
import {getLocation} from "../../Maps/maps";

//https://stackoverflow.com/questions/40466492/how-to-fix-error-fb-is-not-defined-no-undef-on-create-react-app-project
//https://developers.facebook.com/docs/facebook-login/web/accesstokens
//https://stackoverflow.com/questions/40466492/how-to-fix-error-fb-is-not-defined-no-undef-on-create-react-app-project
//https://developers.facebook.com/docs/javascript/quickstart
const auth = getAuth();

export function initializeFacebookSDK() {
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: process.env.REACT_APP_FACEBOOK_APP_ID.toString(),
            xfbml: true,
            version: 'v2.6'
        });
    };

    (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}

export const loginWithFacebook = () => {
    window.FB.login(function (response) {
        if (response.status === 'connected') {
            const credentials = FacebookAuthProvider.credential(response.authResponse.accessToken)
            linkWithCredential(auth.currentUser, credentials)
        }
    }, {scope: 'public_profile,email'});
}

//https://developers.facebook.com/docs/javascript/examples#login

export const logoutWithFacebook = () => {
    window.FB.getLoginStatus(function (response) {
        window.FB.logout(function (response) {
            window.location = "/"; //https://stackoverflow.com/questions/8430474/fb-logout-called-without-an-access-token
        });
    });
}
//https://developers.facebook.com/docs/reference/javascript/FB.logout/
export const createPost = async () => {
    const location = await getLocation()
    window.FB.ui({
        method: 'feed',
        link: `https://maps.google.com/?q=${location.lat},${location.lng}`,
    }, function (response) {
    });
}