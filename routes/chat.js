const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const tokenAuth = require('../middleware/token-auth');
const User = require('../models/user');


router.post('/message', tokenAuth, (req, res) => {
    if (!req.body.message) {
        res.status(400).json({ success: true, message: 'Please fill in the feilds' });
    } else {
        const io = req.app.get('io');
        User.findById(req.user.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ success: false, message: 'User not found' });
                } else {
                    let message = new Message({
                        message: req.body.message,
                        userName: user.userName,
                        userId: user._id
                    });
                    message.save().then((data) => {
                            io.emit('update');
                            res.status(200).json({ success: true, data });
                        })
                        .catch((err) => {
                            res.status(500).json({ success: false, message: 'Oops!, Server error, Please try agaian later', err });
                        });

                }

            }).catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Error finding user', err });
            });

    }
});



router.get('/get-messages', (req, res) => {
    Message.find({}).then((data) => {
            if (data.length < 1) {
                res.status(404).json({ success: false, message: 'No message found', data });
            } else {

                res.status(200).json({ success: true, message: 'Success', data });
            }
        })
        .catch(() => {
            res.status(500).json({ success: true, message: 'Oops!, Server error, Please try agaian later', err });
        });

});







module.exports = router;