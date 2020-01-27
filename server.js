require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const mongoose = require('mongoose');




// DB connection
let mainDb = process.env.MONGO_URL;
if (process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('short'));
    mainDb = process.env.MONGO_DEV_URL;
}

app.use(express.json());
app.use(cors());

//// DB CONNECTION ////
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mainDb)
    .then((result) => {
        console.log(`mongo connected to ${result.connections[0].name} DB, Port = ${result.connections[0].port}`);
    })
    .catch((err) => {
        console.log('mongo NOT connected', err);
    });


// middleware 
app.use(express.json());
app.use(cors());



// ROUTES
app.use('/api/user', require('./routes/user-route'));
app.use('/api/chat', require('./routes/chat'));



const staticView = path.join('./public');
app.use(express.static(staticView));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});





const PORT = process.env.PORT || 3500;
const server = app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});


// Socket IO starts here... 
const io = socket(server);
app.set('io', io);
io.on('connection', function(socket) {

    socket.emit('chat', 'Hello chat world update 3');

    socket.emit('online', 'Online');

    // socket.on('message', function(data) {
    //     socket.emit('message', data);
    //     console.log('we sent it back', data);
    // });
    console.log('socket id', socket.id);
});