
const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require("../middlewares/validar-jwt");
const validaRoles = require("../middlewares/validar-roles");


module.exports = {
    ...validaRoles,
    ...validarJWT,
    ...validarCampos,
}