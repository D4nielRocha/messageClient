//ROLES
const API_ROLES = {
    CREATE_MESSAGES: 'create:messages',
    READ_MESSAGES: 'read:messages',
    UPDATE_MESSAGES: 'update:messages',
    DELETE_MESSAGES: 'delete:messages'
};


const AUTH0_CLIENT_ID = "xMAyE3kLK1qJKDrv4cdrXm6FhEy5PjO1";

const AUTH0_DOMAIN = 'danielrochamz.eu.auth0.com';

const AUDIENCE = 'https://message-API';

// const AUTH0_CALLBACK_URL = 'http://localhost:3000/messages';
const AUTH0_CALLBACK_URL = location.href;


const auth0WebAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'id_token token',
    audience: AUDIENCE
});

const auth0Authentication = new auth0.Authentication(auth0WebAuth, {
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
});

export {
    API_ROLES,
    auth0WebAuth,
    auth0Authentication
}


