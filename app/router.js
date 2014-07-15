define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  var app =require('app');
  var BackStack = require('backstack');
 
   // var router = new Backbone.Router({
            // routes: {
            // // Pages
            // 'login': 'login',
            // 'denied': 'denied',
            // 'cereri':'cereri',
            // 'detalii/:id': 'detalii',
            // 'test':'test',
            // 'new/:id_comanda':'new',
            // // Default - catch all
            // '*actions': 'defaultAction'
        // }
        // });
//             
//         
        // router.on("route:defaultAction", function() {
            // requirejs(['modules/dashboard/dashboard'], function(view) {
                // loadView(view,'right');             
            // });
        // });
// 
        // router.on("route:cereri", function() {
            // requirejs(['modules/cerere/bbComenziGrid'], function(view) {
                // loadView(view);
            // });
        // });
//         
        // router.on("route:new", function(options) {
            // requirejs(['text!modules/vehicul/template.html'], function(view) {
                // loadView(viewModel.loadData(), view,null,function(){
                   // Events.trigger('newFactLoaded');//Declansam un event pentru a putea manipula elementele
                // });
            // });
        // });
         // router.on("detalii", function(options) {
            // requirejs(['modules/vehicul/edit'], function(view) {
                // alert('view');
                // loadView(view,'right',options,function(){
                    // Events.trigger('editVehiculLoaded');
                // });
//                 
            // });
        // });
// 
        // router.route("/home/about", function() {
            // require(['text!/home/about'], function(view) {
                // loadView(null, view);
            // });
        // });
// 
        // router.route("/home/contact", function() {
            // require(['text!/home/contact'], function(view) {
                // loadView(null, view);
            // });
        // });
// 
        // router.route("/customer/index", function() {
            // require(['customer-indexViewModel', 'text!/customer/index'], function(viewModel, view) {
                // loadView(viewModel, view, function() {
                    // kendo.bind($("#grid").find(".k-grid-toolbar"), viewModel);
                // });
            // });
        // });
// 
        // router.route("/customer/edit/:id", function() {
            // require(['customer-editViewModel', 'text!/customer/edit'], function(viewModel, view) {
                // loadView(viewModel.loadData(), view);
            // });
        // });

    var loadView = function(View,transition,options, delegate) {
         var view = new View(options);
         var trans = new BackStack.SlideEffect({direction:transition||'left'});
        if (app.navigator.viewsStack.length===0) {
                    app.navigator.pushView(view,{},trans);
                }else{
                    app.navigator.replaceView(view,{},trans);
                }
        if(delegate)
        	eval(delegate);
    };
  // Defining the application router.
  //module.exports=router;
   module.exports = Backbone.Router.extend({
    routes: {
            // Pages
            'login': 'login',
            'denied': 'denied',
            'cereri':'cereri',
            'detalii/:id': 'detalii',
            'newvehicul/:id_comanda':'newvehicul',
            'test':'test',
            //'new/:id_comanda':'newvehicul',
            // Default - catch all
            '*actions': 'defaultAction'
        }
        ,

    defaultAction: function() {
      //console.log("Welcome to your / route.");
      var Dashboard=require('modules/dashboard/views/dashboard');
      loadView(Dashboard,'right');
    },
    cereri:function(){
        var CereriPage = require('modules/cerere/views/bbComenziGrid');
        loadView(CereriPage);
    },
    detalii:function(options){
       var VehiculPage = require('modules/vehicul/views/edit');
       loadView(VehiculPage,'left',{id:options});
        //alert(options);
    },
    login:function(){
        var LoginPage = require('modules/user/views/login');
        var loginView = new LoginPage();
        loginView.render();
    },
    newvehicul:function(options){
    	var VehiculPage = require('modules/vehicul/views/edit');
        loadView(VehiculPage,'left',{id_comanda:options},"view.renderview()");
    }
    
  });
});
