const express = require('express');
const router = express.Router();
const {processBD, addBuyer, getBuyerByEmail, updateDetails} = require('../controllers/controller');

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

router.get("/password2", (req, res) => {
res.render('ForgotPassword2');
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
res.redirect("/");
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