const express = require('express');
const app = express();
const PORT = 3000;
const HOST ="127.0.0.1";

app.use(express.static('public'));




app.listen(PORT, HOST, () => {
    console.log(`server listened at ${HOST}${PORT}`);
})