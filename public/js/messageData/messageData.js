import * as api from '../dataJS/messageApi.js';
import * as auth from '../authentication/jwtAuth.js';
import { API_ROLES } from '../authentication/auth0-variables.js';
import { getDataAsync } from '../dataJS/fetchData.js'
import { readMessage } from '../models/readMessage.js';



window.addEventListener('load', () => {
    const isAdmin = auth.checkAuth(API_ROLES.DELETE_MESSAGES);
    if(isAdmin){
        getMessages();
    }
    toggleNavbar();
    document.getElementById('messageTable').style.display = "none";
   
})


let displayTableHead = () => {


    document.getElementById('tableHead').innerHTML = `<tr>
                                                            <th>Date</th>
                                                            <th id="nameHead">Name</th>
                                                            <th>Subject</th>
                                                            <th id="countryHead">Country</th>
                                                            <th>Email</th>
                                                            <th id="messageHead">Message</th>
                                                            <th>Action</th>
                                                            <th>Read</th>
                                                        </tr>`

  
    const student = document.getElementsByClassName('student');
    document.getElementById('showAll').addEventListener('click', () => {
        getMessages();
    })

    // console.log(`this is the student `, student);

    for(let i = 0; i < student.length; i++){
        student[i].addEventListener('click', getMessageByStudent);
    }

   
}


//Load all messages on homepage
let displayMessages = (data, checked) => {
    // console.log(`this is the checked`, checked);
    // console.log(data);

    const showMessage = auth.checkAuth(API_ROLES.DELETE_MESSAGES);
    // console.log(`this is the showMessage`, showMessage);
    
    if(showMessage){
        document.getElementById('formSection').style.display = "none";
        document.getElementById('userSection').style.display = `none`;
        document.getElementById('messageTable').style.display = "block";

        // displayFilterOptions();

        displayTableHead();

       
        //loop through each message and creates a table row for each one
        let messages = data.map( item => {
            let message;

            if(window.innerWidth <= 768){
                 message = ` <tr>
                            <td class="showMessage">${item._date.slice(8,10)}/${item._date.slice(5, 7)}</td>`;
            } else {
                 message = ` <tr>
                            <td class="showMessage">${item._date.slice(8,10)}/${item._date.slice(5, 7)}/${item._date.slice(0,4)}</td>`;
            }
            // let message = ` <tr>
            //                 <td class="showMessage">${item._date.slice(8,10)}-${item._date.slice(5, 7)}-${item._date.slice(0,4)}</td>`;

                            if(item.student){
                                message += `<td id="tableName">${item.first_name} ${item.last_name}<i class="fas fa-user-graduate"></i></td>`
                            }else{
                                message += `<td id="tableName">${item.first_name} ${item.last_name}</td>`
                            };

                    message +=`<td class="subject" id="${item.subject}">${item.subject}</td>
                                <td class="countryColumn">${item.country}</td>
                                <td><a class="mailTo" href="mailto: ${item.email}">${item.email}</a></td>
                                <td maxlength="2" class="messageColumn" >${item.message}</td>
                                <td>
                                <a href="#" class="messageDetails" data-bs-toggle="modal" data-bs-target="#messageModal" data-bs-toggle="tooltip" data-bs-placement="top" title="View Message" id="${item._id}"><i class="fas fa-eye"></i></a>
                                <a href="#" class="deleteBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="View Message" id="${item._id}"><i class="fas fa-trash"></i></a>
                                </td>
                                <td class="readTD" id="${item._id}"><input class="isRead" type="checkbox"  /></td>
                                </tr>`

                return message;

        });

        //Check screen width and display or hide columns and change messageColumns style;
        document.getElementById('tableBody').innerHTML = messages.join('');
        
        //if width greater or equal than 768px
        if(window.innerWidth >= 768){
            const messageColumn = document.getElementsByClassName('messageColumn');
           
            for(let i = 0; i < messageColumn.length; i++){
                messageColumn[i].style.overflow = 'hidden';
                messageColumn[i].style.textOverflow = "ellipsis";
                messageColumn[i].style.whiteSpace = "nowrap";
                messageColumn[i].style.maxWidth = "50px";
            }  
        }
        //if width less or equal than 768px
        if(window.innerWidth < 768){
            const messageColumn = document.getElementsByClassName('messageColumn');
            const countryColumn = document.getElementsByClassName('countryColumn');
            document.getElementById('messageHead').style.display = "none";
            document.getElementById('countryHead').style.display = "none";
            for(let i = 0; i < messageColumn.length; i++){
                messageColumn[i].style.display = "none";
                countryColumn[i].style.display = "none";
            }  
        }

 

        // create Filter Search Bar();
        searchBar();
        
        //add eventListener to buttons
        let show = document.getElementsByClassName('messageDetails');
        let deleteBtn = document.getElementsByClassName('deleteBtn');
        let readCheck = document.getElementsByClassName('readTD');
        let isRead = document.getElementsByClassName('isRead');
        // let readCheckArray = Object.keys(readCheck);
        // console.log(`this is the readCheckArray`, readCheckArray);
        // let subject = document.getElementsByClassName('subject');
        // console.log(show);
        //add eventlistenert to view button
        for(let i = 0; i < show.length; i++){
            // console.log(`event listener function to show`, show[i]);
            show[i].addEventListener('click', getMessageById);
            deleteBtn[i].addEventListener('click', deleteMessage);
            readCheck[i].addEventListener('click', checkReadMessages);
        }

        // console.log(checked);
        // console.log(checked[0].messageID);
        // console.log(isRead[0].hasOwnPropert(checked[0].messageId));

        if(checked != null){
            for(let i = 0; i < readCheck.length; i++){
                checked.some( e => {
                    if(e.hasOwnProperty(`messageID`)){
                        if(e.messageID == readCheck[i].id){
                            isRead[i].checked = true;
                        }
                    }
                });
            }   
        }


    } else {
        console.log('You don`t have permission to read the messages! Please contact Admin');
    }

}







let displaySingleMessage = async (message) => {

        if(message.student){
            document.getElementById('modal-title').innerHTML = `${message.first_name} ${message.last_name}  <i class="fas fa-user-graduate"></i>`;
        }else {
            document.getElementById('modal-title').innerHTML = `${message.first_name} ${message.last_name}`;
        }
        
        document.getElementById('modalBody').innerHTML = `  <a class="mailTo" href="mailto: ${message.email}">Email: ${message.email}</a><br><br>
                                                            <p>Date: ${message._date}</p>
                                                            <p>Country: ${message.country}</p>
                                                            <p>Subject: <strong>${message.subject}</strong></p>
                                                            <p>Message: ${message.message}</p>`
}



//GET DATA SECTION =================


//Get all messages from DB
let getMessages = async () => {

    const result = await api.getMessages();
    const checked = await api.getCheckedMessages();
    // const json = await checked.json();
    // console.log(`this is the checked`, checked);

    displayMessages(result, checked);
}



//Get Message by ID 
async function getMessageById(){

    // console.log(this.id);

    const result = await api.getMessageById(this.id);

    // console.log(result);

    displaySingleMessage(result);

}

async function checkReadMessages(){

    // console.log(this.id);
    // console.log(this.children[0].checked);
    const readMessage = prepareReadMessage(this.id, this.children[0].checked);

    const result = await api.checkReadMessage(readMessage);

}



// async function getMessageBySubject(){

//     // console.log(this.id);

//     const result = await api.getMessageBySubject(this.id)
//     // console.log(this);
//     // console.log(result);
//     displayMessages(result);
// }


async function getMessageByStudent(){

    // console.log(this.value);

    const result = await api.getMessageByStudent(this.value)
    const checked = await api.getCheckedMessages();

    // console.log(this);
    // console.log(result);
    displayMessages(result, checked);
}

async function deleteMessage(){

    // console.log(this.id);

    const result = await api.deleteMessage(this.id)
    getMessages();
}



//navigation toggle - responsiveness 

function toggleNavbar(){

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event to each one of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

} 



let prepareReadMessage = (id, checked) => {
    let date = new Date(Date.now()).toISOString().slice(0,10);
    let isChecked;

    if(checked == true){
        isChecked = true;
    } else if (checked == false){
        isChecked = false
    }

    return new readMessage(
        id,
        isChecked,
        date,
        sessionStorage.getItem('email')
    )

}


// let displayFilterOptions = () => {

//     document.getElementById('messageTable').innerHTML = `<input id="myInput" type="text" placeholder="Filter your search">
//                                                         <input type="radio" class="student" name="student" value="true"> -Show Students
//                                                         <input type="radio" class="student" name="student" value="false"> -Show Non-Students
//                                                         <input type="radio" id="showAll" name="student" value="all" checked> -Show All`

// }



// function createDropdown() {

//     // console.log(dropdown);
//     let subject = document.getElementsByClassName('subject');
//     let filteredArr = {};

//         for(let i = 0; i < subject.length; i++){
//             let item = subject[i].innerText.toLowerCase();
//             filteredArr[item] += item;      
//         }     

//     console.log(filteredArr);

//     let dropdownItem = document.getElementById('dropdown-content');
//     let nonDuplicatedArray = [];

//     for(let item in filteredArr){
//         nonDuplicatedArray.push(item.charAt(0).toUpperCase() + item.slice(1));
//         console.log(item);
//     }

//     let ddmenu = nonDuplicatedArray.map( item => {
//         let dd = ` <a href="#" id="${item}" class="dropdown-item">
//                         ${item}
//                     </a>`
//         return dd;
//     })

//     dropdownItem.innerHTML = ddmenu.join(' ');

//     //addEventListener to each dd menu button
//     let drop = document.getElementsByClassName('dropdown-item');

//     for(let i = 0; i < drop.length; i++){
//         // console.log(`event listener added to`, drop[i], `with an id of: `, drop[i].id);
//         drop[i].addEventListener('click', getMessageBySubject);
//     }
    
// }


function searchBar(){
    $("#myInput").on("keyup", function() {
        let value = $(this).val().toLowerCase();
        $("#tableBody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        });
}





export {
    getMessages
}
