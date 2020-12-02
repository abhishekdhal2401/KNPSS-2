import mongoose from 'mongoose';
import nextConnect from 'next-connect'
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../../middleware/database';
import User from '../../models/User';
import Hash from '../../models/Hash';
import nodemailer from 'nodemailer';

const handler = nextConnect();
// Mail sending service transport
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);  

handler.use(bodyParser.urlencoded({extended : false}));
handler.post(async (req, res) => {
    // Get the reg fileds from the body of the request
    const {username, phone, email, password} = req.body;

    // Check if any field is missing or not
    if(!username || !phone || !email || !password) {
        res.json({error : true, message : "Some of the fields are missing."});
    } else {
        // All the fields were provided
        // Find if a person with that email is present in the database or not
        try {
            const user = await User.findOne({username, email});
            // Check if there is a valid user or not
            if(user) {
                // User is already present in the database
                if(user.active === false) {
                    // User present but not verified. Send verification email
                    const hostname = req.headers.host; // hostname = 'localhost:8080'
                    // Needs to be changed to https in production
                    const urlLink = process.env.ENV === 'DEV' ? 'http://' + hostname : 'https://' + hostname;
                    const savedHash = await Hash.findOne({userId : user._id});
                    if(savedHash) {
                        const newEmail = {
                            template_id:process.env.TEMPLATE_ID,
                            from: process.env.EMAIL, // Change to your recipient
                            personalizations:[{
                                to: user.email, // Change to your verified sender
                                dynamic_template_data:{
                                    variable:`${urlLink}/api/verify?id=${savedHash.userId}&token=${savedHash.hashString}`
                                }
                            }],
                        }
    
                        // Send the email to the registered email
                        // Send mail using sendgrid
                        sgMail
                        .send(newEmail)
                        .then(()=>{
                            res.json({error : false, message : "User is not verified, Email sent successfully"})
                        },error=>{
                            console.error(error);
                            if (error.response) {
                                res.json({error:true, message: error.body})
                            }
                        });
                    } else {
                        // Error finding hash
                        res.json({error : true, message : "Error finding hash in the database"})
                    }
                    




                } else if(user.active === true) {
                    // User present and verified. Should be redirected to the login page
                    res.json({error : true, message : `User already present`});
                }
                
            } else {
                // New user register the user now.
                const newUser = new User({
                    username,
                    password : await bcrypt.hash(password, 10),
                    phone,
                    email
                })

                const savedUser = await newUser.save();
                if(savedUser) {
                    // Create a hash for verification of the email address
                    const newHash = new Hash({
                        userId : savedUser._id,
                        hashString : crypto.randomBytes(20).toString('hex')
                    })

                    const savedHash = await newHash.save();
                    if(savedHash) {
                        const hostname = req.headers.host; // hostname = 'localhost:8080'
                        // Needs to be changed to https in production
                        const urlLink = process.env.ENV === 'DEV' ? 'http://' + hostname : 'https://' + hostname;
                        // See if the hash was generated successfully or not
                        // Hash was saved so send an email to verify the user
                        // Create a new email to be sent to the user

                        // Email details for the email to be sent
                        const newEmail = {
                            template_id:process.env.TEMPLATE_ID,
                            to: savedUser.email, // Change to your verified sender
                            from: process.env.EMAIL, // Change to your recipient
                            custom_args:{"variable":`${urlLink}/api/verify?id=${savedHash.userId}&token=${savedHash.hashString}`},
                        }

                        // Send the email to the registered email

                        sgMail
                            .send(newEmail)
                            .then(()=>{
                                res.json({error : false, message : "User is not verified, Email sent successfully"})
                            },error=>{
                                console.error(error);
                                if (error.response) {
                                    res.json({error:true, message: error.body})
                                }
                            });

                            
                    } else {
                        res.json({error : true, message : "Error generating hash"})
                    }
                } else {
                    // User was not saved
                    res.json({error : true, message : "Error saving user to the database."})
                }
            }

        } catch(err) {
            res.json({error : true, message : err + " Here"});
        }
    }

    
})


export default handler;