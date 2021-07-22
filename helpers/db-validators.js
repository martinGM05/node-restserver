const Role = require("../models/role");
const {Usuario, Categoria, Producto} = require("../models");

const esRoleValido =  async(rol = '' )=> {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
          throw new Error(`El rol ${rol} no está registrado en la base de datos`)
    }
}

const emailExiste = async(correo = '')=>{

    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
      throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}

const existeUsuarioPorId = async(id)=>{
    //Verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
      throw new Error(`El id no existe: ${id}`);
    }
} 

const existeCategoria = async(id) =>{
    //Verificar si la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
      throw new Error(`El id ${id}, no existe`);
    }
}

const existeProducto = async(id) =>{
  //Verificar si la categoria existe
  const existeProducto = await Producto.findById(id);
  if(!existeProducto){
    throw new Error(`El id ${id}, no existe`);
  }
}


module.exports ={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}