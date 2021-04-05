function checkStatus (){

    const accessToken = sessionStorage.getItem('accessToken');

    const expirationDate = new Date(Number.parseInt(sessionStorage.getItem('expirationDate')));
    const isExpired = expirationDate < new Date();
    let status;

    if(!accessToken){
        status = 'There is no access token present in local storage! You have to log in';
    } else if (isExpired){
        status = 'Your access token is has expired';
    } else {
        status = 'Your access has been validades and your token hasn`t expired';
    }
    console.log('status: ', status);

    //if Logged in
    if(accessToken && !isExpired){
        return true;
    }else {
        return false;
    }
}


//Get access toekn from session storage
function getAccessToken(){
    return sessionStorage.getItem('accessToken');
}


//save token to session storage
function saveAuthResult(result){

    sessionStorage.setItem('accessToken', result.accessToken);
    sessionStorage.setItem('idToken', result.idToken);
    sessionStorage.setItem('expirationDate', Date.now() + Number.parseInt(result.expiresIn) * 1000); //

    checkStatus();
}


//check token validity + refresh if it is isExpired
function checkSession(){
    auth0WebAuth.checkSession({
        responseType: 'token id_token',
        timeout: 5000,
        usePostMessage: true  
    }, function (err, result){
        if(err){
            console.log(`Could not get a new token using silent auth (${err.error}`)
            return false;
        } else {
            saveAuthResult(result);
        }
        return true;
    });
};


//decode a Json Web Token  - JWT 

const parseJwt = (token) => {
    try{
        console.log(token);
        console.log(`this is the parsed token`, JSON.parse(atob(token.split('.')[1])));
        return JSON.parse(atob(token.split('.')[1]));
    }catch(e){
        return null;
    }
};

//use jwt-decode to check if token contains permissions for the user and

function checkAuth(permission){
    const jwt = sessionStorage.getItem('accessToken');
    //check permission 
    if(jwt == null){
        return false;
    }

    const decoded = parseJwt(jwt);
    console.log(`this is the decoded token`, decoded);
    return decoded.permissions.includes(permission);
};


export {
    checkStatus,
    getAccessToken,
    saveAuthResult,
    checkSession,
    checkAuth
}


