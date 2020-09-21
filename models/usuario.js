const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
let Schema = mongoose.Schema;
let rolesValidos ={
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: '{VALUE} no es un rol valido'
}
let usuarioSchema = new Schema({
nombre: {
    type: String,
    required: [true, "el nombre es requerido"]
},
email: {
    type: String,
    unique: true,
    required: [true, "el correo es obligatorio"]
},
password:{
    type: String,
    required: [true, 'la contraseña es requerida']
},
img: {
    type: Number,
    required: false
},
role:{
    default: 'USER_ROLE',
     enum: rolesValidos,
    type: String
},

estado:{
    type: Boolean,
    default: true
},
google:{
    type: Boolean,
    default: false
}

});
usuarioSchema.methods.toJSON = function(){
let user = this;
let userObject = user.toObject();
delete userObject.password;

return userObject;

}
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} DEBE DE SER UNICO'})

module.exports = mongoose.model('Usuario', usuarioSchema);