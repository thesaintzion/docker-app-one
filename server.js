require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const mongoose = require('mongoose');
// const validator = require('validators');

const PrivateMessage = require('./models/private_messages');

const PrivateMessage2 = require('./models/private_messages2');



// DB connection
// let mainDb = process.env.MONGO_URL;
let mainDb = process.env.MONGO_DEV_URL;
if (process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('short'));
    // mainDb = process.env.MONGO_DEV_URL;
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
var users = [];
var clients = 0;

io.on('connection', function(socket) {
    // socketHandler(socket);
    clients++;

    socket.emit('online', 'Online');

    socket.emit('connection', 'Connected');

    // 
    socket.on("user_loggedin", function(user) {

        users[user.id] = socket.id;
        io.sockets.emit('user_loggedin', user);

        console.log(user, socket.id, users, users[socket.id])
    });
    // 



    socket.on('disconnect', function() {
        clients--;
        io.sockets.emit('broadcast', { description: clients + ' clients connected!' });
    });

    io.to('0cb2S0k9OI7FZGg5AAAA', "Welcome my dear");
});



//this happens when ever you click on a  friend profile
const saintCreateRoom = (sender, reciever, message) => {
    let newRoom = new PrivateMessage2({
        owner: sender,
        member: reciever,
    });

    if (!sender || sender == '' || !reciever || reciever == '') {
        console.log('Please fill in the fields');
    } else {
        PrivateMessage2.findOne({ owner: sender }).where('member').equals(reciever).then(room => {
            if (room !== null) {
                // You own a room for both, so add message to the room
                console.log('You own a room for both', room);


            } else {
                PrivateMessage2.findOne({ owner: reciever }).where('member').equals(sender).then(room => {
                    if (room !== null) {
                        // You re a member of his room, so add message to the room
                        console.log('Oh u re his member already', room);
                    } else {
                        console.log('No room in relation');
                        // Beggin create a new room since no room in relation
                        newRoom.save().then(room => {
                            console.log('Room Created', room);
                        }).catch(err => {
                            console.log('error creating room', err)
                        });

                    }
                }).catch(err => {
                    console.log('err', err);
                });
            }

        }).catch(err => {
            console.log('err', err);
        });
    }



}



// saintCreateRoom('emma', 'chi', 'Hi Chizoba, How are you doing');

const showRooms = () => {
        PrivateMessage2.find({}).then(rooms => {
            console.log(rooms);
        }).catch(err => {
            console.log(err);
        });
    }
    // showRooms();

// message: [{
//     user: String,
//     body: String,
//     status: { type: Boolean, default: true },
//     createdAt: { type: Date, default: Date.now },
// }],






// 
// PrivateMessage.find({ name: 'john', recieve: { $gte: 'rufus' }}).then(messages => {
//     console.log('Got It', messages);
// }).catch(err => {
//     console.log('Got It', err);
// });


// PrivateMessage.find({ sender: 'sola' }).where('reciever').equals('rufus').then(messages => {
//     let arr = [];
//     arr = messages;
//     console.log('Got It', arr);

// }).catch(err => {
//     console.log('err', err);
// });


// PrivateMessage.find({ sender: 'rufus' }).where('reciever').equals('sola').then(messages => {
//     let arr = [];
//     arr = messages;
//     console.log('Got It', arr);

// }).catch(err => {
//     console.log('err', err);
// });



// PrivateMessage.find({}).and([
//         { $or: [{ sender: 'rufus' }, { reciever: 'solape' }] },
//         { $or: [{ sender: 'sola' }, { reciever: 'rufus' }] }
//     ]).then(messages => {
//         console.log('Got It', messages);
//     })
//     .catch(err => {
//         console.log('err', err);
//     })


// PrivateMessage.aggregate(
//         [{ $match: { sender: 'sola' } }, ]
//     ).then(messages => {
//         console.log('Got It', messages);
//     })
//     .catch(err => {
//         console.log('err', err);
//     })