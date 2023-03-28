const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares/validar-campos');


const { login, googleSingIn } = require('../controllers/auth');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenClodinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivo } = require('../middlewares');



const router = Router();

router.post('/',  validarArchivo, cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'Debe ser un mongoID válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
], actualizarImagenClodinary);

router.get('/:coleccion/:id', [
    check('id', 'Debe ser un mongoID válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos,
    mostrarImagen
])



module.exports = router;