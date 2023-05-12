const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const newRouter = require('./routes/new');
const loginRouter = require('./routes/login');

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/new", newRouter);
app.use("/login", loginRouter);


app.listen(8000);