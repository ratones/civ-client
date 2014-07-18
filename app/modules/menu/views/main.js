define([
	'jquery'
	,'underscore'
	,'backbone'
	,'text!modules/menu/templates/template.html'
	,'modules/menu/views/usermenu'
]
,function($,_,Backbone,template,UserMenu,Metro){
	var MenuView = Backbone.View.extend({
		el:'#mainmenu',
		events: {
                        
        },
		initialize:function(){
            if (window.gui) {
                //Window Controls
                window.frame = gui.Window.get();

                //Additional properties for the window frame to match AppJS' window.frame.state
                window.frame.state = 'normal';

                //Event listeners to capture window state changes and record the state...
                //Available in AppJS, missing in node-webkit...
                window.frame.on('minimize', function(e) {
                    window.frame.state = 'minimized';
                });

                window.frame.on('maximize', function(e) {
                    window.frame.state = 'maximized';
                    window.frame.isMaximized = true;
                });

                window.frame.on('unmaximize', function(e) {
                    window.frame.state = 'normal';
                    window.frame.isMaximized = false;
                });

                window.frame.on('restore', function(e) {
                    window.frame.isMaximized ? window.frame.state = 'maximized' : window.frame.state = 'normal';
                });

                window.frame.on('enter-fullscreen', function(e) {
                    window.frame.state = 'fullscreen';
                });

                window.frame.on('leave-fullscreen', function(e) {
                    window.frame.isMaximized ? window.frame.state = 'maximized' : window.frame.state = 'normal';
                });

                //Manage window active state for styling...
                //As I post this in the node-webkit group, I'm not sure why I have both of these variants for active/inactive state
                window.frame.on('blur', function(e) {
                    window.frame.active = false;
                    jQuery(document.body).addClass('inactive');
                });

                window.frame.on('focus', function(e) {
                    window.frame.active = true;
                    jQuery(document.body).removeClass('inactive');
                });

                window.addEventListener('blur', function(e) {
                    window.frame.active = false;
                    jQuery(document.body).addClass('inactive');
                });

                window.addEventListener('focus', function(e) {
                    window.frame.active = true;
                    jQuery(document.body).removeClass('inactive');
                });
            }

		},
		render:function(){
			this.$el.html(template);
			var overlayInterval;
			$('#launchTop').on('mouseover',function(){
				overlayInterval = setTimeout(showOverlay,500);
			});
			// $('#launchTop').on('mouseout',function(){
				// clearTimeout(overlayInterval);
			// });
			var showOverlay = function(){
				console.log('show');
				 $('#topmenu').animate({height:'30px'},500,function(){
				 	//clearTimeout(overlayInterval);
				 	//$('.window-btns').animate({opacity:1},100);
				 	$('.navigation-bar-content').on('mouseout',function(){
				 		setTimeout(function(){
				 			$('#topmenu').animate({height:'0px'},500);
				 		},500);
					});
			 	});
			};
			 //$('a[href="' + window.location.hash + '"]').parent().addClass('active');
			 $.Metro.initDropdowns();
            var usermenu = new UserMenu();
            usermenu.render();
		},
		
		events: {
            //'click a': 'highlightMenuItem',
             'click #closeapp':'exitapp',
             'click #refreshapp':'refreshapp',
            'click #minapp':'minimize',
            'mouseup .btn':'blurbtn',
            'click #fullscreenapp':"fullscreen"
        },
        blurbtn:function(e){
            $(e.currentTarget).blur();
        },
        highlightMenuItem: function (ev) {
            $('.active').removeClass('active');
            $(ev.currentTarget).parent().addClass('active');
        },

        minimize:function(e){
            window.frame.minimize();
            $(document.body).removeClass('maximized');
        },
        fullscreen:function(e){
             switch(window.frame.state) {
                    case 'maximized' :
                        window.frame.restore();
                        $(document.body).removeClass('fullscreen');
                        $(e.currentTarget).find('i').removeClass('glyphicon-resize-small').addClass('glyphicon-resize-full');
                        break;
                    case 'normal' :
                        window.frame.maximize();
                        $(document.body).addClass('fullscreen');
                         $(e.currentTarget).find('i').removeClass('glyphicon-resize-full').addClass('glyphicon-resize-small');
                        break;
                };
        },
        restore:function(){

          
            //Helper function with logic to toggle the action of the maximize
            //button between maximize and restore.
            var maximizeWindow = function(event) {
                switch(window.frame.state) {
                    case 'maximized' :
                        window.frame.unmaximize();
                        $(document.body).removeClass('maximized');
                        break;
                    case 'normal' :
                        window.frame.maximize();
                        $(document.body).addClass('maximized');
                        break;
                };
            };

            //Helper function with logic to toggle the action of the fullscreen
            //button between fullscreen and restore.
            var fullscreenWindow = function(event) {
                switch(window.frame.state) {
                    case 'fullscreen' :
                        window.frame.restore();
                        $(document.body).removeClass('fullscreen');
                        break;
                    case 'normal' :
                        window.frame.fullscreen();
                        $(document.body).addClass('fullscreen');
                        break;
                };
            }; 

        },
        
        exitapp:function(){
            if(window.gui)
                gui.App.quit();
        }
        ,refreshapp:function(){
        	if(window.gui)
        		window.gui.Window.get().reload();
        } 
	});
	return MenuView;
});