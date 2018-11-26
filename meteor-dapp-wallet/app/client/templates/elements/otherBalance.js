/**
Template Controllers

@module Templates
*/

/**
The balance template

@class [template] elements_otherBalance
@constructor
*/

Template['elements_otherBalance'].onCreated(function(){
    this._intervalId = null;
});

Template['elements_otherBalance'].helpers({
    /**
    Gets currently selected unit

    @method (convertedBalance)
    */
    'convertedBalance': function(){
        var balance = TemplateVar.get('otherBalance');

        if(balance){
            return TemplateVar.get('otherBalance');
        }
    },
    /**
    Get the current balance and count it up/down to the new balance.

    @method (otherbalance)
    */
    'otherbalance': function(){
        var template = Template.instance();
        var otherbalanceArr=[];
        var getAddress = this.address;
        web3.sero.getBalance(getAddress, function (e, balance) {
            if(!e){
                if (typeof balance.tkn !== 'undefined'){
                    var tknBalance = balance.tkn;
                    for(var key in tknBalance){
                        if( key !== "SERO" ){
                            var otherbalance = {};
                            otherbalance.name = key;
                            otherbalance.bal = tknBalance[key].toString();
                            otherbalanceArr.push(otherbalance);
                        }
                    }
                }
                console.log('otherbalanceArr:',otherbalanceArr);

                Meteor.clearInterval(template._intervalId);

                template._intervalId = Meteor.setInterval(function(){
                    TemplateVar.set(template, 'otherBalance', otherbalanceArr);
                    Meteor.clearInterval(template._intervalId);
                }, 1);
          }
        })
    }
});
