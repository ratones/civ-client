requirejs.config({
    paths:{
      //packages
        "lodash" : "../vendor/bower/lodash/dist/lodash.underscore",
        "underscore" : "../vendor/bower/underscore/underscore",
        "jquery" : "../vendor/bower/jquery/dist/jquery.min",
        "cookie":"../vendor/bower/jquery-cookie/jquery.cookie",
        "bootstrap":'../vendor/bower/Metro-UI-CSS/min/metro.min',
         'jqwidgets':'../vendor/local/jquery.widget.min',
        'jqeasing':'../vendor/local/jquery.easing.1.3.min',
        'jqmousewheel':'../vendor/local/jquery.mousewheel',
        //"bootstrap":"../vendor/bower/bootstrap/dist/js/bootstrap.min",
        "metro_spin":"../vendor/bower/metro-spinedit/js/metro-spinedit",
        //jqui:'../vendor/local/jquery-ui.min',
        "backbone": "../vendor/bower/backbone/backbone",
        "associations":"../vendor/bower/backbone-associations/backbone-associations-min",
        "bbgrid":"../vendor/bower/bbGrid-metro/bbGrid.metro",
        "bootbox":"../vendor/bower/bootbox/bootbox",
        //"notify":"../vendor/local/bootstrap-notify/js/bootstrap-notify",
        //"datepicker":'../vendor/bower/bootstrap-datepicker/js/bootstrap-datepicker',
        //"datatables":"../vendor/bower/datatables/media/js/jquery.dataTables",
        "modelbinder":"../vendor/bower/Backbone.ModelBinder/Backbone.ModelBinder.min",
        "collectionbinder":"../vendor/bower/Backbone.ModelBinder/Backbone.CollectionBinder",
        "backstack":"../vendor/bower/backstack/backstack",
        "moment":"../vendor/bower/moment/min/moment.min",
        "select2":"../vendor/bower/select2/select2.min",
        "text" : "../vendor/bower/requirejs-text/text",
        'fileupload':'../vendor/bower/jquery-file-upload/js/jquery.fileupload',
        'fileuploadif':'../vendor/bower/jquery-file-upload/js/jquery.iframe-transport',
        "jquery.ui.widget":'../vendor/bower/jquery-file-upload/js/vendor/jquery.ui.widget',
        //models
        'cerere' : '../app/modules/cerere/models/model',
        'vehicul' : '../app/modules/vehicul/models/model',
        'atribut' : '../app/modules/atribut/models/model',
        'anvelopa' : '../app/modules/anvelopa/models/model',
        'n_anvelopa' : '../app/modules/anvelopa/models/n_model',
        //collections
        'cereri':'../app/modules/cerere/collections/collection',
        'vehicule':'../app/modules/vehicul/collections/collection',
        'atribute':'../app/modules/atribut/collections/collection',
        'anvelope':'../app/modules/anvelopa/collections/collection',
        'n_anvelope':'../app/modules/anvelopa/collections/n_collection',
        //datasources
        'cereriDataSource':'../app/modules/cerere/cerereDataSource',
        //views
        'cerere-indexView' : '../app/modules/cerere/views/indexView',
        // // utils
        'util' : 'util',
        'plugins':'plugins'
    },
    shim : {
    	jqui:["jquery"],
    	jqwidgets:["jquery"],
    	jqeasing:["jquery"],
    	jqmousewheel:["jquery"],
        bootstrap:["jquery","jqwidgets","jqeasing","jqmousewheel"],
        'plugins' : ['jquery'],
        'modelbinder':['backbone'],
        'collectionbinder':['modelbinder'],
        'backbone':['jquery','underscore'],
        'backstack':['backbone'],
        'bbgrid':['backbone']
    },
   
    priority : ['text', 'router', 'app'],
    jquery : '2.0.3',
    waitSeconds : 30
});