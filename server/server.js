const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlBD;
if(process.env.NODE_ENV ==='dev'){
    urlBD ='mongodb://localhost:27017/cafe';
}
else{
    urlBD = 'mongodb+srv://sa:hola12@cafe.9v89k.mongodb.net/cafe?retryWrites=true&w=majority';
}
app.use(bodyParser.urlencoded({ extended: false }))
var port = process.env.PORT || 3000
// parse application/json
app.use(bodyParser.json())

app.use(require('../routes/index'));

app.listen(port, ()=>{
    console.log("escuchando puerto 3000");

});
mongoose.connect(urlBD,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true



}, (err,res)=>{
if(err) throw err;

console.log("Base datos online");
});