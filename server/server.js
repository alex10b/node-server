const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
var port = process.env.PORT || 3000
// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req,res){
res.json("get user");
});

app.post('/usuario', function(req,res){
    let body = req.body;
    res.json({
       persona:body
        
    });
    });
app.put('/usuario/:id', function(req,res){
    
    let id = req.params.id;
    res.json({
        id
    });
    });
 app.delete('/us', function(req,res){
        res.json("delete usuario");
        });
    

app.listen(port, ()=>{
    console.log("escuchando puerto 3000");

});