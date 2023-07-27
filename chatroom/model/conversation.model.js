const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim:true, 
    unique: true,
    lowercase:true
  },
  type :{
    type: Number, // 
    default: 1,
  },
  users: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    // unique: true
  }]
},{
  timestamps:true
})

const conversation = mongoose.model('conversations', conversationSchema)
module.exports = conversation