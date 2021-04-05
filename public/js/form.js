import * as message from './dataJS/messageApi.js';
import { Message } from './models/message.js';
import {checkStatus, saveAuthResult, getAccessToken } from './authentication/jwtAuth.js';
import {auth0WebAuth, auth0Authentication, API_ROLES } from './authentication/auth0-variables.js';



const select = document.getElementById('subject');
const country = document.getElementById('country');
const sendBtn = document.getElementById('sendButton');

//on page load actions
window.addEventListener('load', () => {

    auth0Authentication.userInfo(getAccessToken(), (err, usrInfo) => {
        if(err){
            console.log(err);
        }
        console.log(`this is the user infor`, usrInfo);
        displayUser(usrInfo);
    });
});



select.addEventListener('change', function(){
    showHideOption(select.value, 'other_subject');
});

country.addEventListener('change', function(){
    showHideOption(country.value, 'other_country');
});

sendBtn.addEventListener('click', async function(){
    await sendMessage();
    location.href = "http://localhost:3000";
})



function showHideOption(element, option){

    if(element == "Other"){
        document.getElementById(option).classList.remove('is-hidden');
    } else {
        document.getElementById(option).classList.add('is-hidden');
    }
}

let getMessage = () => {

    let subject = document.getElementById('subject').value;
    let country = document.getElementById('country').value;


    if(subject == "Other"){
        subject = document.getElementById('other_subject').value;
    }

    if(country == "Other"){
        country = document.getElementById('other_country').value;
    }


    return new Message(
        document.getElementById('first_name').value,
        document.getElementById('last_name').value,
        subject,
        country,
        document.getElementById('email').value,
        document.getElementById('message').value,
        document.getElementById('student').checked,
    );

};


let sendMessage = async () => {

    const formMessage = getMessage();
    console.log(formMessage);

    if(formMessage){
        const result = await message.postMessage(formMessage);
        console.log(result);
    }
};


function displayUser(user){

   document.getElementById('profile').innerHTML = `<i class="fas fa-user"></i> ${user.nickname}`

}





