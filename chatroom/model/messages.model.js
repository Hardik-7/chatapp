const mongoose = require('mongoose')

const messagesSchema = new mongoose.Schema({
    message :{
        type: String, // 
        require: true, 
        trim:true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true 
    },
    roomId:{
      type: mongoose.Schema.ObjectId, // 
      required: true,
      ref:'conversations'
    }
},{
    timestamps:true
})

const messages = mongoose.model('messages', messagesSchema)
module.exports = messages