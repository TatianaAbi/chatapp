const {Server} = require("socket.io")
const http = require("http")
const express = require("express")

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:["http://localhost:5173"]
  }
})
function getReceiverSocketId(userId) {
  return userSocketMap[userId]
}
const userSocketMap = {};
//evento de conecion 
io.on("connection",(socket)=>{
  console.log("a user connected", socket.id)
    //el usuario al connectarse crea un objecto socker que representa esta conexion
  const userId = socket.handshake.query.userId
  //se comprueba de que el id del usuario conectado exista y se crea el objecto 
  if(userId) userSocketMap[userId] = socket.id
  //el socket.id es la conexion cada ventana abierta es una conexion nueva pero del mismo userId
  io.emit("getOnlineUsers",Object.keys(userSocketMap))


  socket.on("disconnect",()=>{
    console.log("a user disconnect", socket.id)
    delete userSocketMap[userId]
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

  })
})


module.exports = { app,io,server, getReceiverSocketId}