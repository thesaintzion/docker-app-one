const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');


if (process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('short'));
}

app.use(express.json());
app.use(cors());

const staticView = path.join('./public');
app.use(express.static(staticView));
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

const PORT = process.env.PORT || 3500;
const server = app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});

const io = socket(server);

io.on('connection', function(socket) {

    socket.emit('chat', 'Hello chat world update 3');
    socket.on('message', function(data) {
        socket.emit('message', data);
        console.log('we sent it back', data);
    });
    console.log(socket.id);
});