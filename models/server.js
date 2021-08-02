const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileupload = require('express-fileupload');
const { socketController } = require('../sockets/controller');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
      buscar: '/api/buscar',
      uploads: '/api/uploads',
    }

    // Conectar a base de datos
    this.conectarDB();

    //Middlewares = funciones que añaden fucionalidades al servidor
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    //Sockets
    this.sockets();

  }

  async conectarDB(){
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // Lectura y parseo del body
    this.app.use(express.json());
    // Directorio publico
    this.app.use(express.static("public"));
    // Fileupload - Carga de archivos
    this.app.use(fileupload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath : true,
    }));
  }

  routes() {
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.usuarios, require('../routes/usuarios'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.productos, require('../routes/productos'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.uploads, require('../routes/uploads'));
  }

  sockets(){
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
