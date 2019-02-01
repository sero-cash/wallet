/**
Template Controllers

@module Templates
*/

/**
The request account popup window template

@class [template] popupWindows_startmining
@constructor
*/

var getHashRate = function (template) {
    console.log(" web3.sero.hashrate::", web3.sero.hashrate)
    TemplateVar.set(template, 'hashrate', web3.sero.hashrate);

};

var hashrateIntervalId = null;

Template['popupWindows_hashrate'].onCreated(function () {

    console.log('hashrating::',localStorage.getItem('hashrating'))

    if (localStorage.getItem('hashrating') === true){
        TemplateVar.set('hashrating', true);

        hashrateIntervalId = setInterval(function () {
            getHashRate(template);
        }, 2000);
    }

});



Template['popupWindows_hashrate'].onRendered(function () {

});

Template['popupWindows_hashrate'].onDestroyed(function () {
    console.log("this.hashrateIntervalId3  ",hashrateIntervalId);
    Meteor.clearInterval(hashrateIntervalId);
    web3.sero.stopHashrate(function (res) {
        console.log(res)
    });
    TemplateVar.set('hashrating', false);
});


Template['popupWindows_hashrate'].events({

    // stop hashrate
    'click .cancel': function () {
        console.log("this.hashrateIntervalId3  ",hashrateIntervalId);
        Meteor.clearInterval(hashrateIntervalId);
        web3.sero.stopHashrate(function (res) {
            console.log(res)
        });
        GlobalNotification.info({
            content: TAPi18n.__('mist.applicationMenu.develop.hashrate.stopSuccess'),
            duration: 3
        });
        TemplateVar.set('hashrating', false);
        localStorage.setItem('hashrating', false)
    },

    // start hashrate
    'click .ok': function () {
        var template = Template.instance();
        var mining = web3.sero.mining;
        if(!mining){
            GlobalNotification.warning({
                content: TAPi18n.__('mist.applicationMenu.develop.hashrate.error'),
                duration: 3
            });
        }else {
            web3.sero.startHashrate(function (res) {
                console.log(res)
            });

            console.log("this.hashrateIntervalId:",hashrateIntervalId);

            Meteor.clearInterval(hashrateIntervalId);
            hashrateIntervalId = setInterval(function () {
                getHashRate(template);
            }, 2000);

            console.log("this.hashrateIntervalId2:",hashrateIntervalId);

            GlobalNotification.info({
                content: TAPi18n.__('mist.applicationMenu.develop.hashrate.startSuccess'),
                duration: 3
            });

            TemplateVar.set('hashrating', true);
            localStorage.setItem('hashrating', true)
        }
    },
});


Template['popupWindows_hashrate'].helpers({

    'showHashrate': function () {

        return TemplateVar.get('hashrate')?TemplateVar.get('hashrate'):0;
    }
});
