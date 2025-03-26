const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
const {addBuyer, getBuyerByEmail, updateDetails, updatePasswordByEmail, getTech, getClothing, handlePayment, insertOrdersProducts, getPastOrders, handleChatBot} = require('../controllers/controller');

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
res.render('SignIn', {errorMessage: undefined});
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
console.log('Failed to Update Details, Try Again', fullName, emailAddress, DOB, phoneNumber, password);
res.status(400).render('AccountDetails', {errorMessage: 'Failed to Update Details, Try Again', fullName, emailAddress, DOB, phoneNumber, password});
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

router.get("/PastOrders", async (req, res) => {
const bID = req.session.userID;
if (!bID) {
return res.status(401).send('Sign In to View Past Orders');
}
try {
const orders = await getPastOrders(bID);
if (!orders || orders.length === 0) {
return res.render('Order', {message: "No Past Orders Found"});
}
res.render('Order', {orders, message: undefined});
}
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}
});

router.get("/CS", (req, res) => {
res.render('CustomerService');
});

router.post("/chat", async (req, res) => {
const {message} = req.body
const response = await handleChatBot(message);
res.status(200).send(response);
})

router.get("/clothing", async (req, res) => {
try {
const {hoodies, tShirts, hoodieLogos, tShirtLogos} = await getClothing();
res.render("Clothing", {hoodies, tShirts, hoodieLogos, tShirtLogos});
}
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}
});

router.get("/tech", async (req, res) => {
try {
const {laptopCases, iPhoneCases, laptopLogos, iPhoneLogos} = await getTech();
res.render("Tech", {laptopCases, iPhoneCases, laptopLogos, iPhoneLogos});
}
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}
});

router.post("/cart/add", (req, res) => {
const {productID, productName, price, quantity, category, logo, model, size} = req.body;
if (!req.session.cart) {
req.session.cart = [];
}
let detail = "";
let detailType = "";
if (model) {
detail = model;
detailType = "Model";
} else if (size) {
detail = size;
detailType = "Size";
}
const existingIndex = req.session.cart.findIndex(item => item.productID === productID && item.logo === logo && item.model === model && item.size === size);
if (existingIndex !== -1) {
req.session.cart[existingIndex].quantity += parseInt(quantity);
}
else {
req.session.cart.push({productID, productName, price, quantity: parseInt(quantity), category, logo, model, size, detail, detailType});
}
console.log('Added to Cart');
res.redirect('back');
});

router.get("/Cart", (req, res) => {
if (!req.session.cart) {
req.session.cart = [];
}
let subtotal = 0;
req.session.cart.forEach(item => {subtotal += item.price * item.quantity;});
const shipping = 3;
const tax = subtotal * 0.1;
const total = subtotal + shipping + tax;
res.render('Cart', {cart: req.session.cart, subtotal: subtotal, shipping: shipping, tax: tax, total: total});
});

router.post("/cart/update", (req, res) => {
const {index, quantity} = req.body;
if (req.session.cart && req.session.cart[index]) {
req.session.cart[index].quantity = parseInt(quantity);
}
console.log('Item Updated');
res.redirect('/Cart');
});

router.post("/cart/remove", (req, res) => {
const {index} = req.body;
if (req.session.cart && req.session.cart[index]) {
req.session.cart.splice(index, 1);
}
console.log('Item Removed');
res.redirect('/Cart');
});

router.get("/Checkout", (req, res) => {
if (!req.session.userEmail) {
console.log('Please Log In to Checkout Items');
return res.status(401).render('SignIn', {errorMessage: 'Please Log In to Checkout Items'});
}
if (!req.session.cart || req.session.cart.length === 0) {
return res.redirect("/Cart");
}
let subtotal = 0;
req.session.cart.forEach(item => {subtotal += item.price * item.quantity;});
const shipping = 3;
const tax = subtotal * 0.1;
const total = subtotal + shipping + tax;
res.render('Checkout', {subtotal: subtotal.toFixed(2), shipping: shipping.toFixed(2), tax: tax.toFixed(2), total: total.toFixed(2)});
});

router.post("/payment", async (req, res) => {
const {cardName, cardNumber, expDate, cvv, address, city, state, zip, totalAmount} = req.body;
const buyerID = req.session.userID;
try {
const paymentResult = await handlePayment(buyerID, cardName, cardNumber, expDate, cvv, address, city, state, zip, totalAmount);
if (paymentResult.success) {
const oID = paymentResult.oID;
for (const item of req.session.cart) {
const {productID, logo, quantity, detail, detailType} = item;
const loID = logo;
await insertOrdersProducts(oID, productID, loID, quantity, detail, detailType);
}
console.log('Payment Successful');
req.session.cart = [];
res.render('Purchase');
}
else {
console.log('Payment Failed');
res.status(400).render('Checkout', {errorMessage: 'An error occurred while processing payment.'});
}
}
catch (error) {
console.error('Error:', error);
res.status(500).send('Error');
}
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