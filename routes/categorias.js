const { Router } = require("express");
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");

const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

// Obtener una categoria por id - publico
router.get("/:id", [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
], obtenerCategoria);

// Crear categoria - privado - cualquier persona con un token válido
router.post("/", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
    ],crearCategoria);

// Actualizar - privado - cualquier persona con un token válido
router.put("/:id", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id').custom(existeCategoria),
    validarCampos
],actualizarCategoria);

// Borrar categoria - ADMIN
router.delete("/:id", [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);

module.exports = router;