let express = require('express');
let router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond From posts route');
});

module.exports = router;
