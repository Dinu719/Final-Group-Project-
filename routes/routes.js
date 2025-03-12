const express = require('express');
const router = express.Router();
const {processBD, addBuyer, getBuyerByEmail} = require('../controllers/controller');

router.get("/", (req, res) => {
res.render('index');
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

router.get("/details", (req, res) => {
res.render('AccountDetails');
});

router.get("/Profile", (req, res) => {
res.render('Profile');
});

router.get("/Pastorders", (req, res) => {
res.render('Order');
});

router.get("/Likeditem", (req, res) => {
res.render('Item');
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
return res.render('SignIn', {message: 'Provide Both Your Email & Password'});
}
try {
const user = await getBuyerByEmail(email);
console.log('User Data:', user);
if (!user || user.length === 0) {
return res.render('SignIn', {message: 'User Not Found'});
}
if (password === user[0].password) {
return res.redirect('/');
} 
else {
return res.render('SignIn', {message: 'Password is Incorrect'});
}
} 
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}  
});

module.exports = router;
