const Producto = require("../models/producto")


const obtenerProducto = async (req, res) => {

    const { limite, desde } = req.query

    const query = { estado : true }
    
    const [total, productos, productos2] = await Promise.all([
        Producto.countDocuments(query), 
        Producto.find()
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
                .skip( Number( desde ) )
                .limit(Number( limite ))
            ]);
    
        res.json( { total, productos,productos2 } )
};

const crearProducto = async (req, res) => {
    
    //El nombre lo extraes para verificar si exista. El estado y usuario lo sacas del resto porque no lo podemos modificar
    const {nombre, estado, usuario, ...resto } = req.body;

    const productoExiste = await Producto.findOne({nombre});

    if (productoExiste) {
        return res.status(401).json({
            msg: `Ya existe un producto ${ productoExiste.nombre }  con ese nombre `
        })
    }

    const data = {
        ...resto,
        nombre: req.body.nombre,
        usuario: req.usuario._id,
    }

    const producto = new Producto(data);

    producto.save();
    
   return res.json(producto)
    
};

const obtenerProductoPorId = async ( req , res ) => {

    const { id } = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    return res.json(producto)

};
const actualizarProducto = async ( req , res ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body
    let body = req.body;

    // if (data.nombre) {
    //     data.nombre = data.nombre.toUpperCase();
    // };
    
    let actualizaProducto = {};
    if (body.nombre) actualizaProducto.nombre = body.nombre;
    if (Number(body.precio)) actualizaProducto.precio = Number(body.precio);
    if (body.descripcion) actualizaProducto.descripcion = body.descripcion;
    if (body.disponible) actualizaProducto.disponible = body.disponible;
    if (body.categoria) actualizaProducto.categoria = body.categoria;
    if (body.usuario) actualizaProducto.usuario = body.usuario;

    data.usuario = req.usuario._id // Con esto se que el usuario que actualizad es el que tiene el token validado

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

    return res.status(201).json(producto)

};

const eliminarProducto = async ( req, res ) => {

        const { id } = req.params;
    
        const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } );
    
        res.json(producto)
    
    

}

module.exports = {
    obtenerProducto,
    crearProducto,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
}