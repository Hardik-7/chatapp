const Conversation = require('../model/conversation.model')
const Message = require('../model/messages.model')
const catchAsync = require('../utils/catchAsync')

// create room 
exports.createRoom = catchAsync(async (req, res, next) => { 
    const { name, type = 1 } = req.body
    const authUser = req.user
    if(type === 1 && !name){
        return next({statusCode:400, message:"Name field is required"})
    }
    const isExist = await Conversation.findOne({name:name.toLowerCase()})
    if(isExist){
        return next({statusCode:403, message:"Name already exists, try with different names"})
    }
    const room = await Conversation.create({name, users:[authUser._id]})
    res.status(201).json({
        success:true,
        message:"Create room successfully",
        date:room,
    })  
    
})

// list rooms
exports.listRooms = catchAsync(async (req, res, next) => { 
    const { search } = req.query
    // const authUser = req.user
    const room = await Conversation.find({
        ...(search) && {
            name:{
                $regex: search,
                $options:'i' //case insensitive
            }
        }
    })
    if(!room.length){
        return next({statusCode:404, message:"Not found"})
    }
    res.status(200).json({
        success:true,
        message:"Get rooms successfully",
        date:room,
    })
    
})

// get messages
exports.getMessages = catchAsync(async (req, res, next) => { 
    const authUser = req.user
    const { roomId } = req.params
    if(!roomId){
        return next({statusCode:400, message:"Room ID  required"})
    }
    const room = await Conversation.findOne({_id:roomId, users:authUser._id})
    if(!room){
        return next({statusCode:404, message:"Not found"})
    }
    const messages = await Message.find({roomId})
    if(!messages.length){
        return next({statusCode:404, message:"Not found"})
    }
    res.status(200).json({
        success:true,
        message:"get room successfully",
        date:messages,
    })
})

