function Message(fname,lname,subject,country,email,message,student){
    this.first_name = fname;
    this.last_name = lname;
    this.subject = subject;
    this.country = country;
    this.email = email;
    this.message = message;
    this.student = student;
};

export {
    Message
}