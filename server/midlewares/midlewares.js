let seed = process.env.SEED || "este-es-el-seed-desarrollo";
const jwt = require ('jsonwebtoken');
const usuario = require('../../models/usuario');

let validarToken = (req,res,next)=>{

    token = req.get('token');
jwt.verify(token,seed,(err,decoded)=>{
if(err){
    return res.status(401).json({
        ok: false,
        message: 'token invalido'
    });
}
req.usuario = decoded.usuario;
next(); 
});
  

};
let validarAdminRole = (req,res,next)=>{
let usuario = req.usuario;
    let rol = usuario.role;
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            message: 'el usuario no esta autorizado para realizar esta accion'
        });
       
    }
    next();
}

module.exports ={validarToken,validarAdminRole};