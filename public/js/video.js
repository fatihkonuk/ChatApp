const Socket = io.connect();

//! Set Socket Id
Socket.on('id', data => {
    Socket.id = data;
});


const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

function joinStream() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        Socket.emit('join-stream', stream);
        myVideo.classList.add('left');
        addVideoStream(myVideo, stream);
        // Socket.on('user-connected', users => {
        //     // users.forEach(user => {
        //     //     if (user._id == Socket.id) {
        //     //         myVideo.classList.add('left');
        //     //         addVideoStream(myVideo, stream);
        //     //     }else {
        //     //         connectToNewUser(stream);
        //     //     }
        //     // });
        // })
        Socket.on('user-connected', ({userId,stream}) => {
            if (userId != Socket.id) {
                connectToNewUser(stream);
            }
        })
    });
}

const addVideoStream = (video,stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const connectToNewUser = (stream) => {
    const video = document.createElement('video');
    video.classList.add('right');
    addVideoStream(video,stream);
}

function leaveStream() {
    Socket.emit('leave-stream');
}