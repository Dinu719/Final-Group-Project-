const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index');
});

router.get("/signin", (req, res) => {
    res.render('SignIn');
});
router.get("/Item", (req, res) => {
    res.render('Item');
});

module.exports = router;