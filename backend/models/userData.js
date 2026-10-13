const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const secret = "todopie1234//"

const userSchema =  mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    },
    salt:{
        type: String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
















userSchema.pre("save",async function(next){
  try{
    console.log("This : ",this)
    if(!this.isModified("password")) return next()

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password,salt)
    this.password = hashedPassword
    this.salt = salt
    next()
  } 
  catch(err){
    console.log(err)
  } 
})








userSchema.static("matchingPassword",async function(email,password){
    const user = await this.findOne({email})

    if(!user){
       throw new Error("User not found");
    }
    else{
        const salt = user.salt
        const hashedPassword = await bcrypt.hash(password,salt)
        if(user.password === hashedPassword){
            const token = jwt.sign({
                _id: user._id,
                email: user.email
            },secret)

            return token
        }
        else{
            throw new Error("Invalid Password");
        }
    }
})




module.exports = mongoose.model("userInfo",userSchema)