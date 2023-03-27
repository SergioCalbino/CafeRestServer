const { Schema, model } = require('mongoose');


const ProductoSchema = Schema({
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
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    description: { type: String },
    disponible: { type: Boolean, default: true },
    img:{ type: String }
});

ProductoSchema.methods.toJSON = function() { // Con esto remuevo el __v y el password al momento de devolverr el usuario. Se grva todo en la DB, pero no se mueestra
    const { __v, estado, ...data  } = this.toObject();
   
    return data;
}

module.exports = model( 'Producto', ProductoSchema );