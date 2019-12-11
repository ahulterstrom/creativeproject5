var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/space', {
    useNewUrlParser: true
});


const mySchema = new mongoose.Schema({
    name: String,
    path: String,
    description: String,
});

const Item = mongoose.model('Item', mySchema);






/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
