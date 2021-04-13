function readMessage(id,isRead,date,author){
    this.messageID = id;
    this.messageRead = isRead;
    this._date = date;
    this.readBy = author;
};

export {
    readMessage
}