const path = require("path");
const { v4: uuidv4 } = require("uuid");

const subirArchivos = ( files,  extensionesPermitidas = ['jpg','png', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise ((resolve, reject) => {
      
      const { archivo } = files; // Esto es como el req files
      const archivoCortado = archivo.name.split('.');
      const extension = archivoCortado[archivoCortado.length - 1];
    
    if (!extensionesPermitidas.includes(extension)) {
       return reject(`La extensión ${extension} no es válida, ${extensionesPermitidas} `)
           
    }

    const nombreTemp = uuidv4() + '.' + extension
    const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp) // Esto lo construi para agregar el archivo a la carpeta de uploads
  
    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
  
     resolve (nombreTemp);
    })

})
    
}

module.exports = {
    subirArchivos
}
