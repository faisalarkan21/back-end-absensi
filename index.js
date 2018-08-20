const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
var Nexmo = require('nexmo');
const indexController = require('./routes/index');
// const users = require('./routes/users');




const app = express();

var corsOptions = {
    origin: true,
    credentials: true,
    exposedHeaders: ['Content-Range', 'X-Total-Count']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', (req, res) => {
    res.redirect('/api');
});




app.use('/api', indexController);
// app.use('/api/users', userController);

const listener = app.listen(3001, () => {
    console.log(`Listening on port ${listener.address().port}`);
});

  
module.exports = app;
