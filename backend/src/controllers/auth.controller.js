const { generateToken } = require('../lib/utils')
const User = require('../models/user.model')
const bcrypt  = require('bcryptjs')
const cloudinary = require('../lib/cloudinary')

const signup =  async (req,res)=> {
  const {fullName,email,password} = req.body
  try {
    if(!fullName || !email || !password ){
       return res.status(400).json({message:"all fields are required"})
    }
    if (password.length < 6) {
      return res.status(400).json({message:"password must be at least 6 characters"})
    }
    const user = await User.findOne({email})

    if(user) return res.status(400).json({message: "email already exist"})
    
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser =new User({
      fullName,
      email,
      password: hashedPassword
    })
    if(newUser){
      generateToken(newUser._id,res);
      await newUser.save();

      res.status(201).json({
        _id:newUser._id,
        fullname:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic
     })
    }else{
      res.status(400).json({message: "Invalid user data"})
    }
  }catch(error){
    console.log('el error es '+ error.message)
    res.status(500).json({message:"internal error"})
  }
}

const login = async (req,res)=> {
  const {email,password}= req.body  
  try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"invalid credentials"})
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
      return res.status(400).json({message:"Invalid credentials"})
    }
    generateToken(user._id,res)
    res.status(200).json({
      _id:user._id,
      fullName: user.fullName,
      email:user.email,
      profilePic:user.profilePic
    })
  }catch(error){
    console.log("error in login controller",error.message)
    res.status(500).json({message:"internal server error"})
  }
}

const logout = (req,res)=> {
  try{
  res.cookie("jwt","",{ maxAge:0 });
  res.status(200).json({message:"logged out successfully"})
  }catch(error){
   console.log("error in logout controller",error.message)
   res.status(500).json({ message: "Internal Server Error" });
  }
}

const updateProfile = async (req,res)=>{
try{
  const {profilePic} =req.body 
  const userId = req.user._id

  if(!profilePic){
    return res.status(400).json({message:"profile pic is required"})
  }
  const uploadResponse = await cloudinary.uploader.upload(profilePic)
  const updatedUser = await User.findByIdAndUpdate(userId,
    {profilePic:uploadResponse.secure_url},
    {new:true})

  res.status(200).json(updatedUser)
}catch(error){
  console.log(error)
  res.status(500).json({message:"internal error"})
}
}

const checkAuth = async (req,res)=>{
  try{
    
    res.status(200).json(req.user)
    }catch(error){
     console.log("error in logout controller ", error.message);
     res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { signup,login,logout,checkAuth, updateProfile}