var express = require('express');
var path = require('path');
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/space', {
    useNewUrlParser: true
});

const spaceSchema = new mongoose.Schema({
    userid: String,
    username: String,
    score: String,
});

const SpaceItem = mongoose.model('SpaceItem', spaceSchema);

app.post('/scores', async(req, res) => {
    console.log("post scores");
    const item = new SpaceItem({
        userid: req.body.userid,
        username: req.body.username,
        score: req.body.score,
    });
    try {
        await item.save();
        res.send(item);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/scores', async(req, res) => {
    console.log("get scores");
    try {
        let items = await SpaceItem.find();
        res.send(items);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


// app.put('scores/:id', async(req, res) => {
//     var myquery = { _id: req.params.id, }
//     var edit = req.score;
//     console.log(edit);
//     var edititem = await SpaceItem.findOne(myquery);
//     edititem.title = req.body.title;
//     edititem.description = req.body.description;
//     await edititem.save();
//     console.log("edit made");
//     res.send("yes");
//     //edit
//     //item.save()
// });








app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
