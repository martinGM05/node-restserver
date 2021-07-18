const {response, request} = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } =  jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'El usuario no existe'
            });
        }

        // Verificar si el uid tienen estado true
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'El usuario no está activo'
            });
        }


        req.usuario = usuario;
        next();
        // req.uid = uid;
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });        
    }
}

module.exports = {
    validarJWT
}