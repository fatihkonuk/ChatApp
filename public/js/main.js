const onlineUsers = document.getElementById('online-users');

const messageScreen = document.getElementById('messages');
const feedbackScreen = document.getElementById('feedback');
const message = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

const socket = io.connect('http://localhost:3000');

//! Set Socket Id
socket.on('id', data => {
    socket.id = data;
});

//! Get Online Users
socket.on('onlineUsers', users => {
    let list = '';
    users.forEach(user => {
        let bg = user.isOnline ? '' : 'list-group-item-dark';
        list += `
        <li class="list-group-item ${bg}">
            ${user.username} 
        </li>
        `
    });
    onlineUsers.innerHTML = list;
});

//! Set Offlie User
function setOffline() {
    socket.emit('offlineUser');
}

//! Get Chat History
socket.on('chatHistory', messages => {
    let list = '';
    messages.forEach(message => {
        let hour = new Date(message.sendAt).getHours();
        let minute = new Date(message.sendAt).getMinutes();
        let direction = socket.id == message.userId ? 'right' : 'left';

        list += `
        <div class="message ${direction}">
            <div class="user-name">${message.userName}</div>
            <div class="user-msg">${message.message}</div>
            <div class="time">${hour}:${minute}</div>
        </div>
        `
    });
    messageScreen.innerHTML = list; 
});

//! Chat Data Flow
sendBtn.addEventListener('click', () => {
   socket.emit('chat', {
    message: message.value,
   });
   message.value = '';
});
socket.on('chat', message => {
    feedbackScreen.innerHTML = '';

    let hour = new Date(message.sendAt).getHours();
    let minute = new Date(message.sendAt).getMinutes();
    let direction = socket.id == message.userId ? 'right' : 'left';

    messageScreen.innerHTML += `
    <div class="message ${direction}">
        <div class="user-name">${message.userName}</div>
        <div class="user-msg">${message.message}</div>
        <div class="time">${hour}:${minute}</div>
    </div>
    `
});

//! Feedback Data Flow
message.addEventListener('input', () => {
    if (message.value != '') {
        socket.emit('feedback', socket.id);
    }else if (message.value == ''){
        socket.emit('clear');
    }
});
socket.on('feedback', user => {
    if (user._id != socket.id) {
        feedbackScreen.innerHTML = `${user.name} Yazıyor...`
    }
});
socket.on('clear', () => {
    feedbackScreen.innerHTML = '';
});

