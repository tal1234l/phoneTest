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
                changeUIState('LOGGED_IN');
            },
            loginfailed: function () {
                alert("Login failed");
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

changeUIState = function(state) {
    switch (state) {
        case 'LOGGED_OUT':
            $("#loginForm").show();
            $("#logoutForm").hide();
            break;
        case 'LOGGED_IN':
            $("#loginForm").hide();
            $("#logoutForm").show();
            break;
    }
}

initKandy();