require("dotenv").config()

// DBConnect()
const PORT = process.env.PORT || 3000

const app = require('./app')
const http = require('http').Server(app);
const io = require('socket.io')(http);

// connect db 
const DBConnect = require('./config/db.config')
DBConnect();

http.listen(PORT, function(){
    console.log(`server running on localhost:${PORT}`);
});

// socket connecation
const { socketConnection, socketAuth } = require('./utils/socket')

io.use(socketAuth)
io.on('connection', (socket) => {
    socketConnection(io, socket);
});



