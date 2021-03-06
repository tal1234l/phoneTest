/**
 * Created by I067942 on 18/12/14.
 */

// grab the room from the URL
var room = location.search && location.search.split('?')[1];

// This object will take in an array of XirSys STUN / TURN servers
// and override the original peerConnectionConfig object
var peerConnectionConfig;

$.ajax({
    type: "POST",
    dataType: "json",
    url: "https://api.xirsys.com/getIceServers",
    data: {
        ident: "talw",
        secret: "60b0c873-4e56-49f7-8ce0-144e2968857c",
        domain: "www.phonetest.com",
        application: "default",
        room: "12345",
        secure: 1
    },
    success: function (data, status) {
        // data.d is where the iceServers object lives
        peerConnectionConfig = data.d;
        console.log(peerConnectionConfig);
    },
    async: false
});


// create our webrtc connection
var webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: '',
    // immediately ask for camera access
    autoRequestMedia: false,
    debug: false,
    detectSpeakingEvents: true,
    autoAdjustMic: false,
    //this variable is used for Xirsys stun and turn servers
    peerConnectionConfig: peerConnectionConfig
    });

// when it's ready, join if we got a room from the URL
webrtc.on('readyToCall', function () {
    // you can name it anything
    if (room) webrtc.joinRoom(room);
    });

function showVolume(el, volume) {
    if (!el) return;
    if (volume < -45) { // vary between -45 and -20
    el.style.height = '0px';
    } else if (volume > -20) {
    el.style.height = '100%';
    } else {
    el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
    }
}
webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type == 'volume') {
    showVolume(document.getElementById('volume_' + peer.id), data.volume);
    }
});

// we got access to the camera
webrtc.on('localStream', function (stream) {
    $('form>button').attr('disabled', null);
    });
// we did not get access to the camera
webrtc.on('localMediaError', function (err) {
    });

// local screen obtained
webrtc.on('localScreenAdded', function (video) {
    video.onclick = function () {
        video.style.width = video.videoWidth + 'px';
        video.style.height = video.videoHeight + 'px';
    };
document.getElementById('localScreenContainer').appendChild(video);
$('#localScreenContainer').show();
});
// local screen removed
webrtc.on('localScreenRemoved', function (video) {
    document.getElementById('localScreenContainer').removeChild(video);
    $('#localScreenContainer').hide();
    });

// a peer video has been added
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    var remotes = document.getElementById('remotes');
    if (remotes) {
    var container = document.createElement('div');
    container.className = 'videoContainer';
    container.id = 'container_' + webrtc.getDomId(peer);
    container.appendChild(video);

    // suppress contextmenu
    video.oncontextmenu = function () { return false; };

// show the remote volume
var vol = document.createElement('div');
vol.id = 'volume_' + peer.id;
vol.className = 'volumeBar';
video.onclick = function () {
    video.style.width = video.videoWidth + 'px';
    video.style.height = video.videoHeight + 'px';
    };
container.appendChild(vol);

// show the ice connection state
if (peer && peer.pc) {
    var connstate = document.createElement('div');
    connstate.className = 'connectionstate';
    container.appendChild(connstate);
    peer.pc.on('iceConnectionStateChange', function (event) {
    switch (peer.pc.iceConnectionState) {
    case 'checking':
    $(connstate).text('Connecting to peer...');
    break;
    case 'connected':
    case 'completed': // on caller side
    $(connstate).text('Connection established.');
    break;
    case 'disconnected':
    $(connstate).text('Disconnected.');
    break;
    case 'failed':
    $(connstate).text('Connection failed.');
    break;
    case 'closed':
    $(connstate).text('Connection closed.');
    break;
    }
});
}

remotes.appendChild(container);
setLogoutButton(false);
}
});
// a peer was removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var remotes = document.getElementById('remotes');
    var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
    remotes.removeChild(el);
    }
});

// local volume has changed
webrtc.on('volumeChange', function (volume, treshold) {
    showVolume(document.getElementById('localVolume'), volume);
    });

// Since we use this twice we put it here
function setRoom(name) {
    $('form').remove();
    $('h1').text("Room number: "+name);
    $('#subTitle').text('Link to join: ' + location.href);
    $('body').addClass('active');
    }

if (room) {
    setRoom(room);
    } else {
    $('form').submit(function () {
        var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
        webrtc.createRoom(val, function (err, name) {
            console.log(' create room cb', arguments);

            var newUrl = location.pathname + '?' + name;
            if (!err) {
                history.replaceState({foo: 'bar'}, null, newUrl);
setRoom(name);
} else {
    console.log(err);
    }
});
return false;
});
}
//logout button
var logoutButton = $('#leaveRoom'),
    setLogoutButton = function (bool) {
        if(bool)
            {logoutButton.attr('disabled', 'disabled');}
        else
            {logoutButton.removeAttr("disabled");}
    };
    logoutButton.text('Leave Room');
setLogoutButton(true);
$('#leaveRoom').click(function() {
    webrtc.leaveRoom();
    setLogoutButton(true);
    window.location.href = location.origin;
});


//share screen button
var button = $('#screenShareButton'),
setButton = function (bool) {
    button.text(bool ? 'share screen' : 'stop sharing');
    };
if (!webrtc.capabilities.screenSharing) {
    button.attr('disabled', 'disabled');
    }
webrtc.on('localScreenRemoved', function () {
    setButton(true);
    });

setButton(true);

button.click(function () {
    if (webrtc.getLocalScreen()) {
    webrtc.stopScreenShare();
    setButton(true);
    } else {
    webrtc.shareScreen(function (err) {
        if (err) {
            setButton(true);
        } else {
    setButton(false);
    }
});

}
});
