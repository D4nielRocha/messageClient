import * as data from './fetchData.js';

let postMessage = async (message) => {

    console.log(`this is the message`, message);
    const url = `${data.BASE_URL}/message/new`;

    let httpMethod = 'POST';

    const request = data.fetchInit(httpMethod, JSON.stringify(message));
    
    try{

        const result = await data.getDataAsync(url, request);
        const json = await result.json();
        return true;
    
    }catch(e){
        console.log(`PostMessage error `, e);
        return e;
    }

};

let deleteMessage = async (id) => {


    const url = `${data.BASE_URL}/message/${id}`;

    let httpMethod = 'DELETE';

    const request = data.fetchInit(httpMethod);
    
    try{

        const result = await data.getDataAsync(url, request);
        const json = await result.json();
        return true;
    
    }catch(e){
        console.log(`PostMessage error `, e);
        return e;
    }

};


let getMessages = async () => {

    const url = `${data.BASE_URL}/message`;
    

    try{
        return await data.getDataAsync(url);

    }catch(e){
        console.log(`PostMessage error `, e);
        // return e;
    }
}

let getMessageById = async(id) => {
    console.log(id);

    const url = `${data.BASE_URL}/message/byid/${id}`;
    

    try{
        return await data.getDataAsync(url);

    }catch(e){
        console.log(`PostMessage error `, e);
        // return e;
    }

}


let checkReadMessage = async(readMessage) => {
    // console.log(readMessage);

    const url = `${data.BASE_URL}/message/read`;

    let httpMethod = 'POST';

    const request = data.fetchInit(httpMethod, JSON.stringify(readMessage));

    try{

        const result = await data.getDataAsync(url, request);
        // const json = await result.json();
        return true;
    
    }catch(e){
        console.log(`PostMessage error `, e);
        return e;
    }
}

let getCheckedMessages = async () => {

    const url = `${data.BASE_URL}/message/check/readMessages`;

    try{
        return await data.getDataAsync(url);

    }catch(e){
        console.log(`PostMessage error `, e);
    }

}

let getMessageBySubject = async(subject) => {

    const url = `${data.BASE_URL}/message/${subject}`;
    

    try{
        return await data.getDataAsync(url);

    }catch(e){
        console.log(`PostMessage error `, e);
        // return e;
    }

}


let getMessageByStudent = async(isStudent) => {

    const url = `${data.BASE_URL}/message/student/${isStudent}`;
    

    try{
        return await data.getDataAsync(url);

    }catch(e){
        console.log(`PostMessage error `, e);
        // return e;
    }

}



export {
    postMessage, getMessages, getMessageById, getMessageBySubject, getMessageByStudent, deleteMessage, checkReadMessage, getCheckedMessages
}