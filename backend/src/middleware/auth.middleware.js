const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js")

const protectRoute = async (req,res,next)=>{
  try{
    const token = req.cookies.jwt;
    if(!token){
      return res.status(401).json({message:"unauthorized"})
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
      return res.status(401).json({message:"unauthorized"})
    }

    const user = await User.findById(decoded.userId).select("-password")

    if(!user){
      return res.status(400).json({message:"user not found"})
    } 
    
    req.user = user
    next()
  }catch(error){
    console.log(error)
    res.status(500).json({message:"internal error"})
  }
}

module.exports = {protectRoute}