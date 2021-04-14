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
        // console.log(`this is the user infor`, usrInfo);
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

    let fName = document.getElementById('first_name');
    let lName = document.getElementById('last_name');
    let email = document.getElementById('email');
    let subject = document.getElementById('subject').value;
    let country = document.getElementById('country').value;
    let message = document.getElementById('message');
    let formFields = [fName, lName, email, message];

    if(subject == "Other"){
        subject = document.getElementById('other_subject').value;
    }

    if(country == "Other"){
        country = document.getElementById('other_country').value;
    }
    
    if(fName.validity.valueMissing){
        alert('Please enter your First Name');
        fName.focus();
        return false;
    } else if (lName.validity.valueMissing){
        // $('#first_name').after(`<div style="color:red; margin-top: 0.5rem; position: relative; right: 0;">Please enter your Last Name</div>`);
        // lName.appendAfter(`<div>Please enter your Last Name</div>`);
        alert('Please enter your Last Name');
        lName.focus();
        return false;
    } else if (email.validity.valueMissing){
        alert('Please enter your email');
        email.focus();
        return false;
    } else if (subject == ''){
        alert('Please select a subject');
        subject.focus();
        return false;
    } else if (country == ''){
        alert('Please select a country');
        country.focus();
        return false;
    } else if (message.validity.valueMissing){
        alert('Please write your message');
        message.focus();
        return false;
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

    if(checkStatus()){
        const formMessage = getMessage();
        console.log(formMessage);
        
    
        if(formMessage){
            const result = await message.postMessage(formMessage);
            alert("Thanks for your message!");
            return true;       
        }else{
            // alert('Require field is blank');
            preventDefault();
            return false;
        }
      
    } else {
        alert("Please login before sending a message. Thanks!");
        return false;
    }

    
};


function displayUser(user){

   document.getElementById('profile').innerHTML = `<i class="fas fa-user"></i> ${user.nickname}`

}



let validateForm = message => {

    for(let key in message){
        if(key == ''){
            key.focus();
            return false;
        }
    }
}
