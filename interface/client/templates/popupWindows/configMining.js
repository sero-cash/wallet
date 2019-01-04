/**
Template Controllers

@module Templates
*/

/**
The request account popup window template

@class [template] popupWindows_startmining
@constructor
*/

Template['popupWindows_configMining'].onRendered(function () {
    var template = this;

    template.$('input.number').focus();

    template.autorun(function () {
        var data = Session.get('data');

        if (data && data.masterPasswordWrong) {
            TemplateVar.set('minerStarting', false);

            Tracker.afterFlush(function () {
                template.$('input.number').focus();
            });

            GlobalNotification.warning({
                content: TAPi18n.__('mist.popupWindows.unlockMasterPassword.errors.wrongPassword'),
                duration: 3
            });

            Session.set('data', false);
        }
    });
});


Template['popupWindows_configMining'].events({
    'click .cancel': function () {
        ipc.send('backendAction_closePopupWindow');
    },
    'submit form': function (e, template) {
        e.preventDefault();
        var nums = template.find('input[type="number"]').value;

        TemplateVar.set('configMining', true);

        ipc.send('backendAction_configMining' , nums);

        template.find('input[type="number"]').value = '';
        nums = null;

        GlobalNotification.info({
            content: TAPi18n.__('mist.applicationMenu.develop.configMining.success'),
            duration: 5
        });
        setTimeout(function () {
            ipc.send('backendAction_closePopupWindow');
        }, 3000);
    }
});
