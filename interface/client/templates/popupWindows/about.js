/**
Template Controllers

@module Templates
*/


/**
The about template

@class [template] popupWindows_about
@constructor
*/
Template['popupWindows_about'].onCreated(function () {
});

Template['popupWindows_about'].helpers({

    'nodeVersion':function () {
        return  web3.version.node;
    }

});





