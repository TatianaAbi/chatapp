const express = require('express')
const authRoutes = require("./routes/auth.route")
const messageRoutes = require("./routes/message.route.js")
const dotenv = require('dotenv')
const {connectDB} = require('./lib/db.js')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const {app,server} = require("../src/lib/socket.js")

dotenv.config()
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)


server.listen(PORT,()=>{
  console.log('escuchando.... en ' + PORT)
  connectDB()
})
