import {auth0WebAuth, auth0Authentication, API_ROLES } from '../authentication/auth0-variables.js';
import {checkStatus, getAccessToken, saveAuthResult, checkSession, checkAuth } from '../authentication/jwtAuth.js';
import { getMessages } from '../messageData/messageData.js';

function toggleDisplay(loggedIn){

    console.log('toggle function is being executed!');
    // const isAdmin = checkAuth(API_ROLES.READ_MESSAGES);
    // console.log(isAdmin);


    if(loggedIn){
        document.getElementById('logginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('profile').style.display = 'block';
        // document.getElementById('displayMessages').style.display = 'block';

    }else{
        document.getElementById('logginBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        // document.getElementById('displayMessages').style.display = 'none';

    }
}



//Login button event handler
document.getElementById('logginBtn').addEventListener('click', function(event){
    event.preventDefault();

    auth0WebAuth.authorize({returnTo: location.href});
    console.log('logged in');
}, false);

//logout button event handler
document.getElementById('logoutBtn').addEventListener('click', function(event){
    event.preventDefault();
    
    sessionStorage.clear();
    auth0WebAuth.logout({returnTo: location.href});
    console.log('logged out');
}, false);

//profile button event handler
document.getElementById('profile').addEventListener('click', async function(event){
    event.preventDefault();

    auth0Authentication.userInfo(getAccessToken(), (err, usrInfo) => {
        if(err){
            console.error('Failed to get userInfo');
            return;
        }

        console.log(usrInfo);
        // document.getElementById('displayProfile').innerHTML = `${JSON.stringify(usrInfo)}`
    });

}, false);


//display user function -- Display user name on profile button when user is logged in 
function displayUser(user){
    sessionStorage.setItem('email', user.idTokenPayload.email);
    console.log(`this is the user`, user);
document.getElementById('profile').innerHTML = `<i class="fas fa-user"></i> ${user.idTokenPayload.nickname}`

}


//on page load functions 
window.addEventListener('load', (event)=>{
    auth0WebAuth.parseHash(function (err, result){
        if(result){
            console.log(result);
            saveAuthResult(result);
            toggleDisplay(true);
            displayUser(result);
            getMessages();

        } else {
            console.log(err);
        }
    });

    toggleDisplay(checkStatus());
});




export {
    displayUser, toggleDisplay
}
