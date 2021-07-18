const { Router } = require("express");
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorId} = require("../helpers/db-validators");
const { usuariosGet,
      usuariosPut,
      usuariosPost,
      usuariosPatch,
      usuariosDelete } = require("../controllers/usuarios");
      

const {
      validarCampos,
      validarJWT, 
      esAdminRole, 
      tieneRole
} = require('../middlewares');

const router = Router();

router.get("/", usuariosGet);

router.put("/:id", [
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom( existeUsuarioPorId ),
      check('rol').custom( esRoleValido ),
      validarCampos
],usuariosPut);

router.post("/", [
      check('nombre', 'El nombre es obligatorio').notEmpty(), 
      check('password', 'El password debe ser más de 6 letras').isLength({min: 6}), 
      check('correo','No es un correo válido').isEmail().custom(emailExiste),
      // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']), 
      check('rol').custom( esRoleValido ),
      validarCampos
],usuariosPost);

router.delete("/:id", [
      validarJWT,
      //esAdminRole,
      tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom( existeUsuarioPorId ),
      validarCampos
], usuariosDelete);

router.patch("/", usuariosPatch);

module.exports = router;
