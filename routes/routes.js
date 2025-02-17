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

router.get("/Item", (req, res) => {
    res.render('Item');
});

module.exports = router;