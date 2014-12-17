/**
 * Created by I067942 on 16/12/14.
 */

domainKey = "DAK759f6f54f2a641b5bfc5817209b5299d";
domainName = "@proj1.com";
// called when page is done loading to set up (initialize) the KandyAPI.Phone
setup = function() {
    // initialize KandyAPI.Phone, passing a config JSON object that contains listeners (event callbacks)
    KandyAPI.Phone.setup({
        // respond to Kandy events...
        listeners: {
            loginsuccess: function () {
                changeUIState('READY_FOR_CALLING');
            },
            loginfailed: function () {
                alert("Login failed");
            },
            callincoming: function (call, isAnonymous) {
                if (!isAnonymous) {
                    $('#otherPartyName').val(call.callerName);
                } else {
                    $('#otherPartyName').val('anonymous');
                }
                changeUIState('BEING_CALLED');
            },
            // when an outgoing call is connected
            oncall: function (call) {
                changeUIState("ON_CALL");
            },
            // when an incoming call is connected
            // you indicated that you are answering the call
            callanswered: function (call, isAnonymous) {
                changeUIState("ON_CALL");
            },
            callended: function() {
                $('#theirVideo').empty();
                changeUIState('READY_FOR_CALLING');
            },
            localvideoinitialized: function (videoTag) {
                $('#myVideo').append(videoTag);
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
    KandyAPI.Phone.login(domainKey, $("#logInId").val(), $('#passwd').val());
}

logout = function() {
    KandyAPI.Phone.logout(function () {
        changeUIState('LOGGED_OUT');
    });
}

answerVideoCall = function() {
    changeUIState("ANSWERING_CALL");
    KandyAPI.Phone.answerVideoCall();
}

makeCall = function() {
    KandyAPI.Phone.makeVideoCall($('#callOutUserId').val()+domainName);
    changeUIState('CALLING');
}

endCall = function() {
    KandyAPI.Phone.endCall();
    changeUIState('READY_FOR_CALLING');
}

changeUIState = function(state) {
    switch (state) {
        case 'LOGGED_OUT':
            $('#logInForm').show();
            $('#loggedIn').hide();
            $('#someonesCalling').hide();
            $("#callOut").hide();
            $("#calling").hide();
            $('#onCall').hide();
            break;
        case 'READY_FOR_CALLING':
            $('#logInForm').hide();
            $('#loggedIn').show();
            $('#someonesCalling').hide();
            $('#callOut').show();
            $('#calling').hide();
            $('#onCall').hide();
            $('#loggedInAs').text($('#logInId').val());
            break;
        case 'BEING_CALLED':
            $('#logInForm').hide();
            $('#loggedIn').hide();
            $('#someonesCalling').show();
            $('#callOut').hide();
            $('#calling').hide();
            $('#onCall').hide();
            break;
        case 'CALLING':
            $('#logInForm').hide();
            $('#loggedIn').hide();
            $('#someonesCalling').hide();
            $('#callOut').hide();
            $('#calling').show();
            $('#onCall').hide();
            break;
        case 'ON_CALL':
            $('#logInForm').hide();
            $('#loggedIn').hide();
            $('#someonesCalling').hide();
            $('#callOut').hide();
            $('#calling').hide();
            $('#onCall').show();
            break;
    }

}