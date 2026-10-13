const mongoose = require("mongoose")

const todoSchema =  mongoose.Schema({
    email:{
        type:String
    },
    todoTitle:{
        type: String
    },
    todo:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("todoInfo",todoSchema)