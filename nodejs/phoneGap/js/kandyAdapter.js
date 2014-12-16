/**
 * Created by I067942 on 16/12/14.
 */

// called when page is done loading to set up (initialize) the KandyAPI.Phone
initKandy = function() {

    // initialize KandyAPI.Phone, registering listener functions for Kandy events we want to react to
    KandyAPI.Phone.setup({
        // respond to Kandy events...
        listeners: {
            loginsuccess: function () {
                changeUIState('READY_FOR_CALLING');
            },
            loginfailed: function () {
                alert("Login failed");
            },
            oncall: function (call) {
                changeUIState("ON_CALL");
            },
            callended: function() {
                changeUIState('READY_FOR_CALLING');
            },
            // a video tag is being provided (required for both audio and video calls)
            // you must insert it into the DOM for communication to happen (although for audio calls, it can remain hidden)
            remotevideoinitialized: function (videoTag) {
                $('#theirVideo').append(videoTag);
            }
        }
    });
}

login = function() {
        KandyAPI.Phone.login($("#domainApiId").val(), $("#loginId").val(), $('#passwd').val());
}

logout = function() {
    KandyAPI.Phone.logout(function () {
        changeUIState('LOGGED_OUT');
    });
}

makeCall = function() {
    KandyAPI.Phone.makeVoiceCall($('#callOutUserId').val());
    changeUIState('CALLING');
}

endCall = function() {
    KandyAPI.Phone.endCall();
    changeUIState('READY_FOR_CALLING');
}

changeUIState = function(state) {
    switch (state) {
        case 'LOGGED_OUT':
            $("#loginForm").show();
            $("#logOut").hide();
            $("#callOut").hide();
            $("#calling").hide();
            $('#onCall').hide();
            break;
        case 'READY_FOR_CALLING':
            $("#loginForm").hide();
            $("#logOut").show();
            $('#callOut').show();
            $('#calling').hide();
            $('#onCall').hide();
            $('#currentUser').text($('#loginId').val());
            break;
        case 'CALLING':
            $("#loginForm").hide();
            $("#logOut").hide();
            $('#callOut').hide();
            $('#calling').show();
            $('#onCall').hide();
            break;
        case 'ON_CALL':
            $("#loginForm").hide();
            $("#logOut").hide();
            $('#callOut').hide();
            $('#calling').hide();
            $('#onCall').show();
            break;
    }
}

initKandy();