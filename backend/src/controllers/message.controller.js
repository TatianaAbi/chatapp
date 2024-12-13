const User = require("../models/user.model")
const Message = require("../models/message.model")
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId,io } = require("../lib/socket");


const getUserForSideBar = async (req,res)=>{
try{
  //llamamos al usuario autenticado
  const loggedInUserID = req.user._id;
  //llamamos a todos los usuarios pero excluimos solo al authenticado y no llamamos contraseñas
  const filteredUsers = await User.find({_id: {$ne:loggedInUserID}}).select("-password");
  res.status(200).json(filteredUsers)
}catch(error){
  console.error("error in getUsersForSidebar:",error.message)
  res.status(500).json({error:"internal server error"})
}

}

const getMessages = async(req,res) =>{
 try{
  const {id:userToChatId} = req.params
  const myId = req.user._id;
  const messages = await Message.find({
    $or:[
      {senderId:myId, receiverId:userToChatId},
      {senderId:userToChatId, receiverId:myId}
    ]
  })
  res.status(200).json(messages)
 }catch(error){
  console.log("Error in getMessages controller: ", error.message);
  res.status(500).json({message:"internal error"})
 }
}
const sendMessage = async (req,res)=>{
  try{
    const { text,image } = req.body;
    const {id: receiverId } = req.params;
    const senderId = req.user._id

    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image:imageUrl
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.status(201).json(newMessage)
  }catch(error){
    res.status(500).json({message:"internal error"})
  }
}

module.exports = {getMessages, getUserForSideBar,sendMessage}