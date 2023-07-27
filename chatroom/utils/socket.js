
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const Conversation = require('../model/conversation.model')
const Message = require('../model/messages.model')

// sockets events
let users = [];

const addUser = (userId, socketId) => {
   !users.some(user => user.userId === userId) && users.push({socketId, userId})
}

const getUser = (userId) => users.find(user => user.userId === userId)

const removeUser = (socketId) => {
   users = users.filter(user => user.socketId != socketId)
}

// socket auth middleware
const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.headers.authorization
    if (!token) {
      return next(new Error('A token is required for authentication'));
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;  

    const user = await User.findById(userId);
    if (!user) {
      return next(new Error('User not found'));
    }
    addUser(decoded.id, socket.id)
    socket.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// socket connecation services
const socketConnection = async (io, socket) => {
    const user = socket.user

    console.log('A user connected : ', user.username);

    // join room 
    socket.on('joinRoom', async (roomId) => {
      try {
        const chatRoom = await Conversation.findById(roomId);
        if (!chatRoom) {
          return socket.emit('error', 'Chat room not found');
        }
       
        // prevent duplicate entry
        await Conversation.updateOne({_id: roomId}, {$addToSet: {users: user._id}})
        await User.updateOne({_id: user._id}, {$addToSet: {chatRooms:roomId}})
  
        socket.join(roomId);

        io.to(roomId).emit('userJoined', { user: { _id: user._id, username: user.username } });
  
        socket.emit('joinSuccess', { roomId });
      } catch (err) {
        console.log(err)
        socket.emit('error', 'Something went wrong !');
      }
    });


    // leave room event
    socket.on('leaveRoom', async (roomId) => {
      try {
        // Find the chat room by its ID
        const chatRoom = await Conversation.findById(roomId);
        if (!chatRoom) {
          return socket.emit('error', 'Chat room not found');
        }
  
        // Remove the user 
        chatRoom.users.pull(user._id);
        await chatRoom.save();
  
        user.chatRooms.pull(roomId);
        await user.save();
  
        // Leave the user from the room
        socket.leave(roomId);
  
        io.to(roomId).emit('userLeft', { userId: user._id });
  
        socket.emit('leaveSuccess', { roomId });
      } catch (err) {
        socket.emit('error', 'Something went wrong !');
      }
    });
  

    socket.on('sendMessage', async (data) => {
      try {
        const { message, roomId } = data
        const messageData = await Message.create({
          roomId,
          userId: user._id,
          message,
        });
  
        // send message to connected room users
        io.to(roomId).emit('message', {
          messageId: messageData._id,
          roomId: messageData.roomId,
          userId: messageData.userId,
          message: messageData.message,
          timestamp: messageData.createdAt,
        });

      } catch (err) {
        // console.log(err)
        socket.emit('error', 'Something went wrong !');
      }
    });
 
    socket.on("disconnect", () => {
       removeUser(socket.id)
    });
}

module.exports = {
    socketConnection,
    socketAuth
}