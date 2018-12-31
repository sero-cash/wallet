/**
Template Controllers

@module Templates
*/


/**
The about template

@class [template] popupWindows_about
@constructor
*/
Template['popupWindows_oneKeyRepair'].onCreated(function () {
});

Template['popupWindows_oneKeyRepair'].helpers({


});


Template['popupWindows_oneKeyRepair'].events({
    'click .cancel': function () {
        ipc.send('backendAction_closePopupWindow');
    },

    'click .ok': function () {

        ipc.send('backendAction_oneKeyRepair');

        GlobalNotification.info({
            content: TAPi18n.__('mist.applicationMenu.develop.oneKeyRepairDesc'),
            duration: 4
        });
        setTimeout(function () {
            ipc.send('backendAction_closePopupWindow');
        }, 3000);
    }
});
