const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
const {addBuyer, getBuyerByEmail, updatePasswordByEmail, updateDetails} = require('../controllers/controller');

router.get("/", (req, res) => {
res.render('index');
});

router.get("/account", (req, res) => {
const email = req.session.userEmail;
if (email) {
return res.redirect('/Profile');
} 
else {
return res.redirect('/signin');
}
});

router.get("/signin", (req, res) => {
res.render('SignIn');
});

router.get("/signup", (req, res) => {
res.render('SignUp');
});

router.get("/password1", (req, res) => {
res.render('ForgotPassword1');
});

router.post('/forgot', async (req, res) => {
const {email} = req.body;
const token = crypto.randomBytes(20).toString('hex');
req.session.resetToken = token;
req.session.resetEmail = email;
try {
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
tls: {
rejectUnauthorized: false,
}
});
const mailOptions = {
from: process.env.EMAIL_USER,
to: email,
subject: 'A Password Reset Request',
text: `Click the following link to reset your password: 
http://localhost:5001/password2/${token}`,
};
await transporter.sendMail(mailOptions);
console.log('Password Reset Email Sent.');
res.send('A link has been sent to your email.');
} 
catch (error) {
console.error('Error:', error);
return res.status(500).send('Error');
}
});

router.get('/password2/:token', (req, res) => {
const {token} = req.params;
const {resetToken} = req.session;
if (token === resetToken) {
res.render('ForgotPassword2', {token});
} 
else {
res.status(400).send('Invalid or Expired Token.');
}
});

router.post('/reset', async (req, res) => {
const {token, newPassword} = req.body;
const {resetToken, resetEmail} = req.session;
if (token !== resetToken) {
return res.status(400).send('Invalid or Expired Token.');
}
try {
const result = await updatePasswordByEmail(resetEmail, newPassword);
if (result) {
console.log('Your password has been reset successfully.');
res.redirect('/signin');
} 
else {
res.status(400).send('Failed to Reset Password.');
}
} 
catch (error) {
console.error('Error:', error);
return res.status(500).send('Error');
}
req.session.resetToken = null;
req.session.resetEmail = null;
});  

router.get("/purchase", (req, res) => {
res.render('purchase');
});

router.get("/details", async (req, res) => {
const email = req.session.userEmail;
if (!email) {
return res.status(401).send('User Not Found');
}
try {
const buyer = await getBuyerByEmail(email);
if (!buyer || buyer.length === 0) {
return res.status(401).send('Buyer Not Found');
}
const dob = new Date(buyer[0].dob).toISOString().split('T')[0];
return res.render('AccountDetails', {
fullName: buyer[0].fullName,
emailAddress: buyer[0].email,
DOB: dob,
phoneNumber: buyer[0].phoneN,
password: buyer[0].password,
});
} 
catch (error) {
console.error('Error:', error);
return res.status(500).send('Error');
}
});

router.post("/update", async (req, res) => {  
const {fullName, emailAddress, DOB, phoneNumber, password} = req.body;
const bID = req.session.userID;
try {
const result = await updateDetails(bID, fullName, emailAddress, DOB, phoneNumber, password);
if (result) {
console.log('Details Changed');
if (emailAddress !== req.session.userEmail) {
req.session.userEmail = emailAddress;
}
res.redirect('/details');
}
else {
res.status(400).render('/update', {errorMessage: 'Failed to Update Details, Try Again', fullName, emailAddress, DOB, phoneNumber, password});
}
}
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}
});

router.get("/Profile", (req, res) => {
res.render('Profile');
});

router.get("/PastOrders", (req, res) => {
res.render('Order');
});

router.get("/CS", (req, res) => {
res.render('CustomerService');
});

router.get("/Clothing", (req, res) => {
res.render('Clothing');
});

router.get("/Tech", (req, res) => {
res.render('Tech');
});

router.get("/Cart", (req, res) => {
res.render('Cart');
});

router.get("/Checkout", (req, res) => {
res.render('Checkout');
});

router.post("/create", async (req, res) => {
const {fName, emailAddress, birthday, phoneNumber, password} = req.body;
try {
await addBuyer(fName, emailAddress, birthday, phoneNumber, password);
res.redirect("/signin");
} 
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}
});

router.post("/login", async (req, res) => {
const {email, password} = req.body;
if (!email || !password) {
return res.status(400).send('Please Provide Both Email & Password');
}
try {
const user = await getBuyerByEmail(email);
console.log('User Data:', user);
if (!user || user.length === 0) {
console.log('User Not Found');
return res.status(401).send('Invalid Email or Password');
}
if (password === user[0].password) {
req.session.userEmail = user[0].email;
req.session.userID = user[0].bID;
console.log('Logged In:', req.session.userEmail, req.session.userID);
return res.redirect('/');
} 
else {
console.log('Password is Incorrect');
return res.status(401).send('Invalid Email or Password');
}
} 
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}  
});

router.get("/logoff", (req, res) => {
console.log('Logging Off:', req.session.userEmail, req.session.userID);
req.session.destroy((err) => {
if (err) {
console.error('Error:', err);
res.status(500).send('Error');
}
res.clearCookie('connect.sid');
console.log('Logged Off');
res.redirect('/');
});
});

module.exports = router;