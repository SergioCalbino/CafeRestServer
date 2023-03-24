const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuario = async ( termino = '', res ) => {

    const esMongoId = ObjectId.isValid( termino ) // Compruebo si el termino es un ID valudo de mongo

    if (esMongoId) {
        const usuario = await Usuario.findById( termino )
        
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' )

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, {correo: regex} ],
        $and: [{ estado: true }]
    })

    res.json({
        results: usuarios
    })

};

const buscarCategoria = async ( termino = '', res ) => {

    const esMongoId = ObjectId.isValid( termino ) // Compruebo si el termino es un ID valudo de mongo

    if (esMongoId) {
        const categoria = await Categoria.findById( termino )
        
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' )

    const categoria = await Categoria.find({ nombre: regex ,  estado: true })

    res.json({
        results: categoria
    })

}
const buscarProductos = async ( termino = '', res ) => {

    const esMongoId = ObjectId.isValid( termino ) // Compruebo si el termino es un ID valudo de mongo

    if (esMongoId) {
        const producto = await Producto.findById( termino )
                                        .populate('categoria', 'nombre')
                                        .populate('usuario', 'nombre')
        
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' )

    const producto = await Producto.find({ nombre: regex , estado: true })
                                    .populate('categoria', 'nombre')
                                    .populate('usuario', 'nombre')
    res.json({
        results: producto
    })

}

const buscar = (req, res = response ) => {
    
    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg: `Las coleeciones permitidas son: ${ coleccionesPermitidas }`
        })
        
    }
    
    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res)
            break;
        
        case 'categorias':
            buscarCategoria(termino, res)
            break;

        case 'productos':
            buscarProductos(termino, res)
            break;
    
        default:
            res.status(500).json({
                msg: 'La busqueda no esta permitida'
            })
            break;
    }
};

module.exports = {
    buscar
}