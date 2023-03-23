const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = socket(server);

//* Database Connection
mongoose.connect('mongodb+srv://fatihkonuk000:x52JSMknXLL3TeFc@cluster0.ed4ho5b.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('Database Connected');
});

//* Routes
const pageRoute = require('./routes/pageRoute');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');

//* User Middlewares
const roleMiddleware = require('./middlewares/roleMiddleware');

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
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://fatihkonuk000:x52JSMknXLL3TeFc@cluster0.ed4ho5b.mongodb.net/?retryWrites=true&w=majority' })
}));
app.use(methodOverride('_method', {
    methods: ['POST', 'GET'],
}));

//* Global Variable
global.userIN = null;

app.use('*', (req,res,next) => {
    global.userIN = req.session.userID;
    next();
})
app.use('/admin', roleMiddleware, adminRoute);
app.use('/users', authRoute);
app.use('/', pageRoute);

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

    //* Send Online Users
    const users = await User.find();
    io.sockets.emit('onlineUsers', users);

    //* Set Offline User
    socket.on('offlineUser', async () => {
        setTimeout(async () => {
            const users = await User.find();
            io.sockets.emit('onlineUsers', users);
        },1000);
    })

    //* Send Chat History
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

