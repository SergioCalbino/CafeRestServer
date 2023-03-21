const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProducto, crearProducto, obtenerProductoPorId, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorID } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();


router.get('/', obtenerProducto);

router.get('/:id', [
    check('id',' El id no es válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] , obtenerProductoPorId)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El id no es valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorID ),
], validarCampos,
crearProducto);

router.put('/:id', [
    validarJWT,
    // check('categoria', 'El id no es valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
], validarCampos,
actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], eliminarProducto
);



module.exports = router