import * as api from '../dataJS/messageApi.js';
import * as auth from '../authentication/jwtAuth.js';
import { API_ROLES } from '../authentication/auth0-variables.js';
import { getDataAsync } from '../dataJS/fetchData.js'



window.addEventListener('load', () => {
    getMessages();
    toggleNavbar();
    document.getElementById('messageTable').style.display = "none";

    // displayFilterOptions();

    // createDropdown();
    // dropdown();
   
})


// let displayTableHead = () => {

//     document.getElementById('tableHead').innerHTML = `  <tr>
//                                                             <th>Date</th>
//                                                             <th>Name</th>
//                                                             <th>
//                                                             <div class="dropdown" id="dropdown">
//                                                                 <div class="dropdown-trigger">
//                                                                     <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
//                                                                     <span id="title">Subject</span>
//                                                                     <span class="icon is-small">
//                                                                         <i class="fas fa-angle-down" aria-hidden="true"></i>
//                                                                     </span>
//                                                                     </button>
//                                                                 </div>
//                                                                 <div class="dropdown-menu" id="dropdown-menu" role="menu">
//                                                                     <div class="dropdown-content" id="dropdown-content"></div>
//                                                                 </div>
//                                                             </div>
//                                                             </th>
//                                                             <th>Country</th>
//                                                             <th>Email</th>
//                                                             <th>Message</th>
//                                                             <th>Action</th>
//                                                         </tr>`

        

//     const dropdown = document.getElementById('dropdown');
//     const title = document.getElementById('title');

//     dropdown.addEventListener('click', (event) => {
//         event.stopPropagation();
//         dropdown.classList.toggle('is-active');

//     })
// }


let displayTableHead = () => {


    document.getElementById('tableHead').innerHTML = `<tr>
                                                            <th>Date</th>
                                                            <th>Name</th>
                                                            <th>Subject</th>
                                                            <th>Country</th>
                                                            <th>Email</th>
                                                            <th>Message</th>
                                                            <th>Action</th>
                                                        </tr>`

  
    const student = document.getElementsByClassName('student');
    document.getElementById('showAll').addEventListener('click', () => {
        getMessages();
    })

    console.log(`this is the student `, student);

    for(let i = 0; i < student.length; i++){
        student[i].addEventListener('click', getMessageByStudent);
    }

   
}


//Load all messages on homepage
let displayMessages = (data) => {

    console.log(data);

    const showMessage = auth.checkAuth(API_ROLES.DELETE_MESSAGES);
    console.log(`this is the showMessage`, showMessage);
    
    if(showMessage){

        document.getElementById('messageTable').style.display = "block";
        // displayFilterOptions();

        displayTableHead();


        document.getElementById('userSection').style.display = `none`;
        //loop through each message and creates a table row for each one
        let messages = data.map( item => {

            let message = ` <tr>
                            <td class="showMessage">${item._date}</td>`;

                            if(item.student){
                                message += `<td id="tableName">${item.first_name} ${item.last_name}<i class="fas fa-user-graduate"></i></td>`
                            }else{
                                message += `<td id="tableName">${item.first_name} ${item.last_name}</td>`
                            };

                    message +=`<td class="subject" id="${item.subject}">${item.subject}</td>
                        <td>${item.country}</td>
                        <td>${item.email}</td>
                        <td maxlength="10" >${item.message}</td>
                        <td>
                        <a href="#" class="messageDetails" data-bs-toggle="modal" data-bs-target="#messageModal" data-bs-toggle="tooltip" data-bs-placement="top" title="View Message" id="${item._id}"><i class="fas fa-eye"></i></a>
                        <a href="#" class="deleteBtn" data-bs-toggle="tooltip" data-bs-placement="top" title="View Message" id="${item._id}"><i class="fas fa-trash"></i></a>
                        </td>
                        </tr>`

                return message;

        });

        
      
        document.getElementById('tableBody').innerHTML = messages.join('');

        // createDropdown();
        searchBar();
        

        let show = document.getElementsByClassName('messageDetails');
        let deleteBtn = document.getElementsByClassName('deleteBtn');
        // let subject = document.getElementsByClassName('subject');
        // console.log(show);
        //add eventlistenert to view button
        for(let i = 0; i < show.length; i++){
            // console.log(`event listener function to show`, show[i]);
            show[i].addEventListener('click', getMessageById);
            deleteBtn[i].addEventListener('click', deleteMessage);
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
        
        document.getElementById('modalBody').innerHTML = `  <p>Email: ${message.email}</p>
                                                            <p>Date: ${message._date}</p>
                                                            <p>Country: ${message.country}</p>
                                                            <p>Subject: <strong>${message.subject}</strong></p>
                                                            <p>Message: ${message.message}</p>`

        

}



//GET DATA SECTION =================


//Get all messages from DB
let getMessages = async () => {

    const result = await api.getMessages();

    displayMessages(result);
}



//Get Message by ID 
async function getMessageById(){

    // console.log(this.id);

    const result = await api.getMessageById(this.id);

    // console.log(result);

    displaySingleMessage(result);

}

async function getMessageBySubject(){

    // console.log(this.id);

    const result = await api.getMessageBySubject(this.id)
    // console.log(this);
    // console.log(result);
    displayMessages(result);
}


async function getMessageByStudent(){

    console.log(this.value);

    const result = await api.getMessageByStudent(this.value)
    // console.log(this);
    // console.log(result);
    displayMessages(result);
    this.checked = checked;
}

async function deleteMessage(){

    console.log(this.id);

    const result = await api.deleteMessage(this.id)
    getMessages();
}



//navigation toggle - responsiveness 

function toggleNavbar(){

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
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


// let displayFilterOptions = () => {

//     document.getElementById('messageTable').innerHTML = `<input id="myInput" type="text" placeholder="Filter your search">
//                                                         <input type="radio" class="student" name="student" value="true"> -Show Students
//                                                         <input type="radio" class="student" name="student" value="false"> -Show Non-Students
//                                                         <input type="radio" id="showAll" name="student" value="all" checked> -Show All`

// }



function createDropdown() {

    // console.log(dropdown);
    let subject = document.getElementsByClassName('subject');
    let filteredArr = {};

        for(let i = 0; i < subject.length; i++){
            let item = subject[i].innerText.toLowerCase();
            filteredArr[item] += item;      
        }     

    console.log(filteredArr);

    let dropdownItem = document.getElementById('dropdown-content');
    let nonDuplicatedArray = [];

    for(let item in filteredArr){
        nonDuplicatedArray.push(item.charAt(0).toUpperCase() + item.slice(1));
        console.log(item);
    }

    let ddmenu = nonDuplicatedArray.map( item => {
        let dd = ` <a href="#" id="${item}" class="dropdown-item">
                        ${item}
                    </a>`
        return dd;
    })

    dropdownItem.innerHTML = ddmenu.join(' ');

    //addEventListener to each dd menu button
    let drop = document.getElementsByClassName('dropdown-item');

    for(let i = 0; i < drop.length; i++){
        // console.log(`event listener added to`, drop[i], `with an id of: `, drop[i].id);
        drop[i].addEventListener('click', getMessageBySubject);
    }
    
}


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
