var express = require('express');

var router = express.Router();

router.get("/", function(request, response, next){

    response.send('List all');

});

router.get("/add", function(request, response, next){

    response.send('Add Sample Data');

});