const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = socket(server);

//* Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/chatapp-db').then(() => {
    console.log('Database Connected');
});

//* Routes
const pageRoute = require('./routes/pageRoute');
const authRoute = require('./routes/authRoute');

//* Template Engine
app.set('view engine', 'ejs');

//* Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/chatapp-db' })
}));

//* Global Variable
global.userIN = null;

app.use('*', (req,res,next) => {
    global.userIN = req.session.userID;
    next();
})
app.use(pageRoute);
app.use('/users', authRoute);

//* Socket.io
io.on('connection', async socket => {
    //* Set Socket Id
    socket.id = global.userIN;
    socket.emit('id', socket.id);
    const user = await User.findById(socket.id);
    if (user) {
        user.isOnline = true;
        await user.save();
    }

    //* Get Online Users
    const users = await User.find();
    io.sockets.emit('onlineUsers', users);

    //* Set Offline User
    socket.on('offlineUser', async () => {
        setTimeout(async () => {
            const users = await User.find();
            io.sockets.emit('onlineUsers', users);
        },1000);
    })

    //* Get Chat History
    const messages = await Message.find().sort('sendAt');
    socket.emit('chatHistory', messages);

    //* Chat Data Flow
    socket.on('chat', async data => {
        const user = await User.findById(socket.id);
        if (user) {
            const message = await Message.create({
                message: data.message,
                userId: user._id,
                userName: user.name,
            });
            io.sockets.emit('chat', message);
        }
    })

    //* Feedback Data Flow
    socket.on('feedback', async data => {
        const user = await User.findById(data);
        if (user) {
            socket.broadcast.emit('feedback', user);
        }
    });
    socket.on('clear', () => {
        socket.broadcast.emit('clear');
    });
    
    socket.on("disconnect", async () => {
        const user = await User.findById(socket.id);
        if (user) {
            user.isOnline = false;
            await user.save();
        }
        const users = await User.find();
        io.sockets.emit('onlineUsers', users);
    });

}); 

