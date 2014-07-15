define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var _ = require("underscore");
  var $ = require("jquery");
  var plugins = require('plugins');
  var Backbone = require("backbone");
  var BackStack=require('backstack');
  var Metro = require('bootstrap');
  //var sm = require('smartmenus');
  //var smbs = require('smartmenusbs');
  //var smkb = require('smartmenuskb');
  //var Bootstrap = require('bootstrap');
  //var Nedb = require("nedb");
  var Vm = require('vm');
  var AppView = require('modules/main/views/main');
  var db = {};
  // if (window.requireNode) {
                // var Datastore = requireNode('nedb'), path = requireNode('path');
                // //new Datastore({ filename: path.join(requireNode('nw.gui').App.dataPath, 'something.db') });
                // db.tarife = new Datastore({ filename: path.join(requireNode('nw.gui').App.dataPath, 'tarife.db') });
                // db.facturi = new Datastore({ filename: path.join(requireNode('nw.gui').App.dataPath, 'facturi.db') });
                // db.coduri = new Datastore({ filename: path.join(requireNode('nw.gui').App.dataPath, 'coduri.db') });
// 
                // // You need to load each database (here we do it asynchronously)
                // db.coduri.loadDatabase();
                // db.tarife.loadDatabase();
                // //console.log(path.join(requireNode('nw.gui').App.dataPath, 'something.db'));
            // }else{
                // db.coduri = new Nedb();
                // db.tarife = new Nedb();
            // }
    
  // Alias the module for easier identification.
  var app = module.exports;
  app.db = db; 
  // The root path to run the application through.
  app.root = "/app-civ/";
  var appView = new AppView();
  appView.render();
  app.navigator = new BackStack.StackNavigator({el: '.page',firstView:appView});
     //$('body').html(app.navigator.render().el);
    //app.navigator.pushView(appView);
});
