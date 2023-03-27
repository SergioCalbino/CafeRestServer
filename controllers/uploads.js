const { response } = require("express");
const { subirArchivos } = require('../helpers');
const { Usuario, Categoria, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {

  try {
    
    const pathCompleto = await subirArchivos( req.files, undefined, 'imgs')
    res.json({
      nombre: pathCompleto
    })
    
  } catch (error) {
      res.status(400).json({ msg: error })
    
  }
};

const actualizarImagen = async ( req, res ) => {

    const { coleccion, id } = req.params;

    let modelo;
    switch (coleccion) {
      case 'usuarios':
        modelo = await Usuario.findById(id);
        if (!modelo) {
            return res.status(400).json({
              msg: ` El usurio ${id} no existe en la base de datos `
            })
        };
        break;
      case 'productos':
        modelo = await Producto.findById(id);
        if (!modelo) {
            return res.status(400).json({
              msg: ` El producto ${id} no existe en la base de datos `
            })
        };
        break;
    
      default:
        return res.status(500).json({
          msg: 'La accion que intenta no es válida'
        })
        break;
    };

    
    const actualizarImagen =  await subirArchivos( req.files, undefined, coleccion)


    modelo.img = actualizarImagen;
    modelo.save()
    
    res.json( modelo )
}

module.exports = {
  cargarArchivo,
  actualizarImagen
};
