const onlineUsers = document.getElementById('online-users');

const messageScreen = document.getElementById('messages');
const feedbackScreen = document.getElementById('feedback');
const messageBox = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

const socket = io.connect();

//! Set Socket Id
socket.on('id', data => {
    socket.id = data;
});

//! Get Online Users
socket.on('onlineUsers', users => {
    let list = '';
    users.forEach(user => {
        let bg = user.isOnline ? '' : 'list-group-item-dark';
        if (user.role == 'admin') {
            list += `
            <li class="list-group-item ${bg}">
                ${user.username} - (Admin)
            </li>
            `
        }else {
            list += `
            <li class="list-group-item ${bg}">
                ${user.username}
            </li>
            `
        }
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
        let hours = new Date(message.sendAt).getHours();
        hours = hours < 10 ? '0' + hours : hours;
        let minutes = new Date(message.sendAt).getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let direction = socket.id == message.userId ? 'right' : 'left';

        list += `
        <div class="message ${direction}">
            <div class="user-name">${message.userName}</div>
            <div class="user-msg">${message.message}</div>
            <div class="time">${hours}:${minutes}</div>
        </div>
        `
    });
    messageScreen.innerHTML = list; 
});

//! Chat Data Flow
document.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') {
        sendBtn.click();
    }
})

sendBtn.addEventListener('click', () => {
    if (messageBox.value == '') return;
    socket.emit('chat', {
        message: messageBox.value,
    });
    messageBox.value = '';
});
socket.on('chat', message => {
    feedbackScreen.innerHTML = '';
    let hours = new Date(message.sendAt).getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = new Date(message.sendAt).getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let direction = socket.id == message.userId ? 'right' : 'left';

    messageScreen.innerHTML += `
    <div class="message ${direction}">
        <div class="user-name">${message.userName}</div>
        <div class="user-msg">${message.message}</div>
        <div class="time">${hours}:${minutes}</div>
    </div>
    `
    const aud = new Audio('../audio/notfication.mp3');
    aud.play();
});

//! Feedback Data Flow
message.addEventListener('input', () => {
    if (messageBox.value != '') {
        socket.emit('feedback', socket.id);
    }else if (messageBox.value == ''){
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
