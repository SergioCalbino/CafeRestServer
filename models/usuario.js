
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] // Esto hace que sea obligatorio y agregua un msj en la db
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});



UsuarioSchema.methods.toJSON = function() { // Con esto remuevo el __v y el password al momento de devolverr el usuario. Se grva todo en la DB, pero no se mueestra
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
