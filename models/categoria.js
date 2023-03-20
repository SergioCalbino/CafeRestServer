const { Schema, model } = require('mongoose');


const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true,

    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function() { // Con esto remuevo el __v y el password al momento de devolverr el usuario. Se grva todo en la DB, pero no se mueestra
    const { __v, estado, ...data  } = this.toObject();
   
    return data;
}

module.exports = model( 'Categoria', CategoriaSchema );