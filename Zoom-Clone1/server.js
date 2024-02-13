const express = require('express')
const app = express() //setting up app
const server = require('http').Server(app) //setting up server
const io =  require('socket.io')(server)  // to import socket
const { ExpressPeerServer } = require('peer')
const {v4:uuidv4} = require('uuid') //importing the library
const peerServer = ExpressPeerServer(server,{
    debug:true
})
app.use('/peerjs',peerServer)
app.set('view engine','ejs')
app.use(express.static('public')) //to use the public folder in the server

app.get('/',(req,res)=> {
    res.redirect(`/${uuidv4()}`) //the main root, automatically generate unique id using uuid
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId: req.params.room}) //tthen it renders the room
})

io.on('connection', socket => {
    console.log('New user connected');
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)

        })
    });
});
 

server.listen(process.env.PORT||3030)