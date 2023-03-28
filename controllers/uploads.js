const { response } = require("express");
const path = require("path");
const fs = require("fs");
const { subirArchivos } = require("../helpers");
const { Usuario, Categoria, Producto } = require("../models");
const cloudinary = require('cloudinary').v2

cloudinary.config( process.env.CLOUDINARY_URL )

const cargarArchivo = async (req, res = response) => {
  try {
    const pathCompleto = await subirArchivos(req.files, undefined, "imgs");
    res.json({
      nombre: pathCompleto,
    });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const actualizarImagen = async (req, res) => {
  const { coleccion, id } = req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: ` El usurio ${id} no existe en la base de datos `,
        });
      }
      break;
    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: ` El producto ${id} no existe en la base de datos `,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "La accion que intenta no es válida",
      });
  
  }

  //Asegurarme de hacer la limpieza previa
  try {
    if (modelo.img) {
      //Hay que borrar la imagen del servidor
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      ); //Con esto buscamos la imagen en la coleccion que queremos borrar
      if (fs.existsSync(pathImagen)) {
        // El fs File sistem, propio de Node
        fs.unlinkSync(pathImagen); // Esto borra
      }
    }
  } catch (error) {
    console.log(error);
  }

  const actualizarImagen = await subirArchivos(req.files, undefined, coleccion);

  modelo.img = actualizarImagen;
  modelo.save();

  res.json(modelo);
};

const mostrarImagen = async (req, res) => {
  const { coleccion, id } = req.params;

  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: ` El usurio ${id} no existe en la base de datos `,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: ` El producto ${id} no existe en la base de datos `,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "La accion que intenta no es válida",
      });
  }
  //Asegurarme de hacer la limpieza previa
  try {
    if (modelo.img) {
      //Hay que borrar la imagen del servidor
      const pathImagen = path.join(
        __dirname,
        "../uploads",
        coleccion,
        modelo.img
      ); //Con esto buscamos la imagen en la coleccion que queremos borrar
      if (fs.existsSync(pathImagen)) {
        // El fs File sistem, propio de Node
        return res.sendFile(pathImagen);
      }
    }
  } catch (error) {
    console.log(error);
  }

  const pathImagen = path.join(__dirname, "../assets/no-image.jpg"); //Con esto buscamos la imagen en la coleccion que queremos borrar

  res.sendFile(pathImagen);
};

const actualizarImagenClodinary = async (req, res) => {
	const { coleccion, id } = req.params;
  
	let modelo;
	switch (coleccion) {
	  case "usuarios":
		modelo = await Usuario.findById(id);
		if (!modelo) {
		  return res.status(400).json({
			msg: ` El usurio ${id} no existe en la base de datos `,
		  });
		}
		break;
	  case "productos":
		modelo = await Producto.findById(id);
		if (!modelo) {
		  return res.status(400).json({
			msg: ` El producto ${id} no existe en la base de datos `,
		  });
		}
		break;
  
	  default:
		return res.status(500).json({
		  msg: "La accion que intenta no es válida",
		});
	
	}
  
	//Asegurarme de hacer la limpieza previa

	  if (modelo.img) {
		const nombreArr = modelo.img.split('/');
		const nombre = nombreArr[ nombreArr.length - 1 ];
		const [ public_id ] = nombre.split('.');
		cloudinary.uploader.destroy(public_id)
		
	}

	const { tempFilePath } = req.files.archivo

	 const { secure_url } = await cloudinary.uploader.upload( tempFilePath )
  
	modelo.img = secure_url;
	modelo.save();
  
	res.json( modelo );
  };

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenClodinary
};
