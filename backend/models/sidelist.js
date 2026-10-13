const mongoose = require("mongoose")

const listSchema =  mongoose.Schema({
    email:{
        type:String
    },
    sideList:{
        type: String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("listInfo",listSchema)