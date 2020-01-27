const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const tokenAuth = require('../middleware/token-auth');



// api/user/register
router.post('/register', (req, res) => {
    // res.status(200).json({ success: true, message: 'Welcome', user: req.body });

    const { userName, userEmail, userPass } = req.body;

    if (!userName || !userEmail || !userPass) {
        res.status(400).json({ success: false, message: 'Please fiil in the required fields', user: req.body });
    } else {
        User.findOne({ userEmail: userEmail })
            .then(user => {
                // if user exists
                if (user) return res.status(409).json({ success: false, message: 'User with that email already exist' });

                bcrypt.hash(userPass, 10, (err, hash) => {
                    if (err) {
                        console.log('password hass err', err);
                        res.status(500).json({ success: false, message: 'Something went wrong', err });
                    } else {

                        // create a new user
                        const newUser = new User({
                            userName,
                            userEmail,
                            userPass: hash,
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        });


                        newUser.save()
                            .then(user => {
                                console.log('user saved', user);

                                let createdUser = {
                                    id: user._id,
                                    userName: user.userFullName,
                                    userEmail: user.userEmail,
                                    createdAt: user.createdAt
                                }

                                // send token to client
                                let token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '24h' });


                                res.status(200).json({ success: true, user: createdUser, token: token, });

                            }).catch(err => {
                                console.log(err);
                                res.status(500).json({ success: false, message: 'Oops! Server error, Please try again', err });
                            });


                    }

                });

            }).catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Oops! Server error, Please try again', err });
            });
    }

});


// api/user/register
router.post('/login', (req, res) => {
    console.log(req.body.userEmail, req.body.userPass);

    if (!req.body.userEmail || !req.body.userPass) {
        res.status(400).json({ success: false, message: 'Please fiil all required fields', user: req.body });
    } else {
        User.findOne({ userEmail: req.body.userEmail })
            .then(user => {
                if (user) {
                    bcrypt.compare(req.body.userPass, user.userPass, function(err, matched) {
                        if (matched) {
                            // send token to client
                            let token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '24h' });
                            res.status(200).json({ success: true, message: 'Successful', user, token: token, });


                        } else {
                            res.status(400).json({ success: false, message: 'Oops! Invalid credentials' });
                        }
                    });

                } else {
                    res.status(404).json({ success: false, message: 'Oops! no user found', });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ success: false, message: 'Oops! Server error, Please try again', err });
            });
    }

});



// user profile
router.get('/profile', tokenAuth, (req, res) => {

    User.findById(req.user.id)
        .select('-userPass')
        .then(user => {
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            } else {
                res.status(200).json({ success: true, message: 'Auth successful', user: user });
            }

        }).catch(err => {
            res.status(500).json({ success: false, message: 'Error finding user', err });
        });

});




// user profile
router.get('/all-users', (req, res) => {
    User.find({})
        .select('-userPass')
        .then(users => {
            if (!users) {
                return res.status(404).json({ success: false, message: 'Users not found' });
            } else {
                res.status(200).json({ success: true, message: 'got all users', users });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ success: false, message: 'Error finding users', err });
        });

});


// user profile
router.get('/sinlge-user/:userEmail', (req, res) => {
    console.log(req.params.userEmail);
    const userEmail = req.params.userEmail;
    User.findOne({ userEmail: userEmail })
        .select('-userPass')
        .then(user => {
            console.log('we got single user', user);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            } else {
                res.status(200).json({ success: true, message: 'got single user', user });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ success: false, message: 'Error finding user', err });
        });

});






module.exports = router;