const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

};

const googleSingIn = async (req, res, next) => {

    const { id_token } = req.body;

    try {

        const googleUser = await googleVerify(id_token)
        
        const { nombre, img, correo } = googleUser;
        console.log(googleUser)

        let usuario = await Usuario.findOne( { correo } );

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ";P",
                img,
                rol: "USER_ROLE",
                google: true,
              };

            usuario = new Usuario( data );
            await usuario.save()
        }
        
        // Verificar si el usuario tiene estado en falso
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloquedo, hable con el administrador'
            })
        }
        
        // console.log(usuario.id)
        const token = await generarJWT( usuario.id );
        
        
        
        // console.log(usuario)
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: 'El token no fue verificado',
            ok: false
        })
        
    }


}



module.exports = {
    login,
    googleSingIn
}
