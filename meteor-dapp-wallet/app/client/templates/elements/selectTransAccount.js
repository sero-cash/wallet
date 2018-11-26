/**
Template Controllers

@module Templates
*/

/**
The select account template

@class [template] elements_selectTransAccount
@constructor
*/

Template['elements_selectTransAccount'].onCreated(function(){
    if(this.data ) {
        if(this.data.value) {
            TemplateVar.set('value', this.data.value);
        } else if(this.data.accounts && this.data.accounts[0]) {
            TemplateVar.set('value', this.data.accounts[0].address);
        }
    }
    this.balArr = [];
});


Template['elements_selectTransAccount'].helpers({
    /**

    @method (getRandom)
    */
    'getRandom':function(){
      var len = 4
  　　 var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  　　 var maxPos = $chars.length;
  　　 var pwd = '';
  　　 for (i = 0; i < len; i++) {
  　　　　 pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　　 }
  　　 return pwd;
    },

    /**
    Check if its a normal account

    @method (isAccount)
    */
    'isAccount': function(){
        return this.type === 'account' && Template.parentData(1).showAccountTypes;
    },
    /**
    Return the selected attribute if its selected

    @method (selected)
    */
    'selected': function(){
        return (TemplateVar.get('value') === this.address)
            ? {selected: true}
            : {};
    },
    /**
    Check if the current selected unit is not ether

    @method (isNotSeroUnit)
    */
    'isNotSeroUnit': function() {
        return SeroTools.getUnit() !== 'sero';
    },
    /**
    Check if the current selected unit is not ether

    @method (isNotSeroUnit)
    */
    'isAddress': function() {
        return web3.isAddress(TemplateVar.get('value'));
    }
});

Template['elements_selectTransAccount'].events({
    /**
    Set the selected address.

    @event change select
    */
    'change select': function(e){
        TemplateVar.set('value', e.currentTarget.value);
    }
});
