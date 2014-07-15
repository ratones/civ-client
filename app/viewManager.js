define(['backstack'], function(BackStack) {
    var CycleView =  new BackStack.StackNavigator({
    el: '.page'
    });
    return  CycleView;
});
