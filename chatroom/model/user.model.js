const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required: true,
        trim:true
    },
    username :{
        type : String,
        index : true,
        unique : true,
        required: true,
        trim:true,
        lowercase:true
    },
    password :{
        type : String,
        required: true,
        select: false
    },
    chatRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        // unique: true,
        ref: 'conversations',
    }],
   
},{
    timestamps:true
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function(enterdPassword){
   return await bcrypt.compare(enterdPassword, this.password)
}

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn :process.env.JWT_EXP_TIME })
}


const User = mongoose.model('users', userSchema)
module.exports = User

