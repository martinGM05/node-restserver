const { Router } = require("express");
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const { existeCategoria, existeProducto } = require("../helpers/db-validators");

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto } = require("../controllers/productos");

const router = Router();

router.get("/", obtenerProductos);

// Obtener una categoria por id - publico
router.get("/:id", [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
], obtenerProducto);

// Crear categoria - privado - cualquier persona con un token válido
router.post("/", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
    ],crearProducto);

// Actualizar - privado - cualquier persona con un token válido
router.put("/:id", [
    validarJWT,
    // check('categoria', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
],actualizarProducto);

// Borrar categoria - ADMIN
router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);

module.exports = router;