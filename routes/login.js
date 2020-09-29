const express = require("express");
const app = express();
const Usuario = require('../models/usuario');
const bycript = require('bcrypt');
const jwt = require ('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('620630746467-7istet32g5fubj75q4q3aeg5oui9kgva.apps.googleusercontent.com');


async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '620630746467-7istet32g5fubj75q4q3aeg5oui9kgva.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLI ENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return {
nombre: payload.name,
email: payload.email,
img: payload.picture,
google: true

  }



  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}


let seed = process.env.SEED || "este-es-el-seed-desarrollo";
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
app.post('/google', async(req,res)=>{
let token = req.body.idtoken;
let googleUser = await verify(token)

.catch(e=>{
return res.status(403).json({
    ok: false,
    err: e
});
});

Usuario.findOne({email: googleUser.email},(err,usuarioDb)=>{
if(err){
    return res.status(500).json({
        ok: false,
        err
    });
}
if(usuarioDb){
if(usuarioDb.google === false){
    return res.status(400).json({
        ok: false,
        err :{
            message: "dee autenticarse de forma normal"
        }
    });


}

else{
    let token = jwt.sign({
        usuario: usuarioDb
    },seed,{expiresIn: 60*60*24*365});
    return res.json({
        ok: true,
        usuario: usuarioDb,
        token
    });
}

}
else{
    let usuario = new Usuario();
    usuario.nombre = googleUser.nombre;
    usuario.email = googleUser.email;
    usuario.google = googleUser.google,
    usuario.img = googleUser.img;
    usuario.password = ':)'
    usuario.save((err, usuarioDb)=>{
        if(err){
            return res.status(500).json({
                 ok: false,
                 err

            });

        }
        let token = jwt.sign({
            usuario
        },seed,{expiresIn: 60*60*24*365});
    return res.json({
        ok: true,
        usuario: usuarioDb,
        token
    })
    });
}


});

});
module.exports =app;