const { response } = require("express");
const { Categoria } = require('../models')



//ObtenerCategorias - paginado - total - populate
const obtenerCategorias = async ( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
   const query = { estado:true };

   const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query), 
            Categoria.find().populate('usuario', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
        
        ])
    

    res.json({total, categorias})

};

//ObtenerCategoria - populate
const obtenerCatergoria = async (req, res = response) => {

    const  { id }  = req.params // Obtenemnos por Params el ID de la categoriq que queremos

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json(categoria)

}

const crearCategoria = async (req, res = response) => {

    //Vamos a grabar las catergorias en mayuscula
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if (categoriaDB) {
        return res.status(404).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        })
    }
    
    //Genera la data para guardar la catergria

    console.log(req.usuario)
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)
    await categoria.save()
    
    res.status(201).json(categoria)
};


//ActualizarCategoria
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id // Con esto se que el usuario que actualizad es el que tiene el token validado

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true})

    return res.status(201).json(categoria)





}

//BorrarCategoria - Estado a false

const eliminarCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false } );

    res.json(categoria)

}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCatergoria,
    actualizarCategoria,
    eliminarCategoria
}