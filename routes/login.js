const express = require("express");
const app = express();
const Usuario = require('../models/usuario');
const bycript = require('bcrypt');
const jwt = require ('jsonwebtoken');
let seed = process.env.SEED | "este-es-el-seed-desarrollo";
app.post('/login', (req,res)=>{
    let body = req.body;
    Usuario.findOne({email: body.email},(err,usuarioDb)=>{
if(err){
    return res.status(400).json({
        ok: false,
        err
    });
}
if(!usuarioDb){
    return res.status(404).json({
        ok: false,
        message: 'el (email) o contrasena son incorrectos'
    });
}
if(!bycript.compareSync(body.password,usuarioDb.password)){
    return res.status(400).json({
        ok: false,
        message: 'el email o (contrasena) son incorrectos'
    });
}
let token = jwt.sign({
    usuario: usuarioDb
},seed,{expiresIn: 60*60*24*30});
res.json({
    ok: true,
    usuarioDb,
    token
});

    });

});

module.exports =app;