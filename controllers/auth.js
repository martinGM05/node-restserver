const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {
    
    const { correo, password } = req.body;
    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'El correo no existe'
            });
        }

        // Si el usuario está activo en la bd
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario no está activo'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar el jwt
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error al intentar iniciar sesión'
        });
    }
}

const googleSignIn = async(req, res = response) => {
    
    const { id_token } = req.body;

    try {
        const { correo, nombre, img} = await googleVerify(id_token);

        // Verificar si el email existe
        let usuario = await Usuario.findOne({correo});
        if (!usuario) {
            //Se crea
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB es activo
        if (usuario.estado === false) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el jwt
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        });

    }catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: 'Token de Google no es válido'
        });
    }
}

const renovarToken = async(req, res = response) => {
    const {usuario} = req;

    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}