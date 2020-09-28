const express = require("express");
const Usuario = require('../models/usuario');
const bycript = require('bcrypt');

const app = express();
const {validarToken,validarAdminRole} = require ('../server/midlewares/midlewares');

app.get('/usuario',[validarToken], (req,res)=>{
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
        Usuario.find({estado:true}).skip(desde).limit(limite)
        .exec((err,usuarios)=>{
            if(err){
               return res.status(400).json({
                   ok: false,
                   err
               });
            }
        
            Usuario.countDocuments({estado:true},(err,conteo)=>{
                res.json({
                    ok: true,
                    usuarios,
                    conteo
        });
            });
           
        });

    });
    
    app.post('/usuario',[validarToken,validarAdminRole], function(req,res){
        let body = req.body;
        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bycript.hashSync( body.password,10),
            role: body.role
        });

        usuario.save((err,usuarioDB)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });
       
        });
    app.put('/usuario/:id',[validarToken,validarAdminRole], function(req,res){
        
        let id = req.params.id;
        let body  = req.body;
        delete body.password;
        delete body.google;
        Usuario.findByIdAndUpdate(id, body, {new:true,runValidators: true},(err, usuarioDB)=>{
            if(err) {
              return   res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuarioDB
            });
        });
        });
     app.delete('/usuario/:id', [validarToken,validarAdminRole],function(req,res){
      let id = req.params.id;
     let body = {estado: false};
     
      Usuario.findByIdAndUpdate(id,body,{new:true},(err,usuarioDB)=>{
if(err){
    return res.status(400).json({
        ok: false,
        err
});
}
res.json({
    ok: true,
    usuarioDB
});
      });
//             let id = req.params.id;
//             Usuario.findByIdAndRemove(id,(err, usuario)=>{
//                 if(err) {
//                     return res.status(400).json({
//                           ok: false,
//                           err
//                       });
//                   }
            
// if(!usuario)
// {
//     res.status(400).json({
//         ok: false,
//         err:{
//             message: 'usuario no existente'
//         }
//     });        
// }      
//                 res.json({
//                  ok: true,
//                  usuario
//              });
//             });
            });
 module.exports = app;       