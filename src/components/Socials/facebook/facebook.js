import {FacebookAuthProvider, getAuth, linkWithCredential} from "firebase/auth";

//https://stackoverflow.com/questions/40466492/how-to-fix-error-fb-is-not-defined-no-undef-on-create-react-app-project
//https://developers.facebook.com/docs/facebook-login/web/accesstokens
//https://stackoverflow.com/questions/40466492/how-to-fix-error-fb-is-not-defined-no-undef-on-create-react-app-project
//https://developers.facebook.com/docs/javascript/quickstart

export let facebookIsLinked = false
const auth = getAuth();
const facebookAuthProvider = new FacebookAuthProvider()

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

export const loginWithFacebook = () => { //https://developers.facebook.com/docs/javascript/examples#login
    window.FB.login(function (response) {
        if (response.authResponse) {
            const credentials = FacebookAuthProvider.credential(response.authResponse.accessToken)
            linkWithCredential(auth.currentUser, credentials).then(r => {
                facebookIsLinked = true
            })
        } else {
            facebookIsLinked = false
        }
    });
}

export const getFacebookUserAccessToken = () => {
    let facebookAccessToken;
    window.FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            facebookAccessToken = response.authResponse.accessToken
        }
    });
    return facebookAccessToken
}

export const createPost = () => {
    window.FB.ui({
        method: 'feed',
        link: 'https://www.google.com/maps',
    }, function (response) {
    });
}




