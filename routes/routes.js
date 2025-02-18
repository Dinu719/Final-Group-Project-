const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index');
});

router.get("/signin", (req, res) => {
    res.render('SignIn');
});

router.get("/signup", (req, res) => {
    res.render('SignUp');
});

router.get("/password", (req, res) => {
    res.render('ForgotPassword');
});

router.get("/details", (req, res) => {
    res.render('AccountDetails');
});

router.get("/Profile", (req, res) => {
    res.render('Profile');
});

router.get("/Order", (req, res) => {
    res.render('Order');
});

router.get("/Item", (req, res) => {
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

module.exports = router;