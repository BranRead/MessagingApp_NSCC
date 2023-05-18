const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const newRouter = require('./routes/new');
const homeRouter = require('./routes/home');

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/new", newRouter);
app.use("/home", homeRouter);

app.listen(8000);