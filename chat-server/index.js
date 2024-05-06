const app = require('express')();
const http = require('http').Server(app);
const io = require ('socket.io')(http,{
    cors:{
        origin: true,
        credentials: true,
        methods: ["GET","POST"]
    }
});

const usuariosEnLinea = [];


io.on('connection',(socket)=>{
    console.log("Nuevo Usuario Conectado");

    socket.on("newUser",(user)=>{
        usuariosEnLinea.push(user);
    });
    socket.emit('usuarios-activos', usuariosEnLinea);

    socket.on("senMessage",(messageInfo)=>{
        console.log("Enviando un mensaje");
        console.log(messageInfo);
        socket.broadcast.emit( "receiveMessage",messageInfo);
    });
        
    });  

    io.on('disconnect', () => {
        console.log('Usuario desconectado');

        socket.on('eliminar-usuario', (username) => {
            const index = usuariosEnLinea.findIndex(u => u === username);
            if (index !== -1) {
              usuariosEnLinea.splice(index, 1);
              io.emit('usuarios-activos', usuariosEnLinea);
            }
          });    
    });
    app.get('/getTotalUsers', (req, res) => {
        res.send('<h1>Usuarios en línea:</h1><p>' + usuariosEnLinea.join(', ') + '</p>');
    });

http.listen(8080,()=>{
    console.log("Escuchando");
});

