/**
Template Controllers

@module Templates
*/

/**
The send transaction info template

@class [template] views_modals_sendTransactionInfo
@constructor
*/

// Set basic variables
Template['views_modals_sendTransactionInfo'].helpers({
    /**
    Calculates the fee used for this transaction in ether

    @method (estimatedFee)
    */
    'estimatedFee': function() {
        console.log('',this.gasPrice,this.estimatedGas,(this.estimatedGas && this.gasPrice));
        if(this.estimatedGas && this.gasPrice)
            return SeroTools.formatBalance(new BigNumber(this.estimatedGas, 10).times(new BigNumber(this.gasPrice, 10)), '0,0.0[00000000000000] unit', 'sero');
    }
});
