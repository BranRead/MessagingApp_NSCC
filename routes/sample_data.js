var express = require('express');

var router = express.Router();

var database = require('../database');

router.get("/", function(request, response, next){

    var query = "SELECT SentToID, SentFromID, Message FROM messages";

    database.query(query, function(error, data){

        if(error){
            throw error;
        } else {
            response.render('sample_date',
                {
                    title: 'Test of Database',
                    action: 'list',
                    sampleData: data
                });
        }

    })

})
// router.get("/", function(request, response, next){

//     response.send('List all');

// });

// router.get("/add", function(request, response, next){

//     response.send('Add Sample Data');

// });


module.exports = router;