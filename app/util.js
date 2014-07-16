define(['jquery'],
    function($) {

        var util;
        
        util = {
            getId:
                function() {
                    var array = window.location.href.split('/');
                    var id = array[array.length - 1];
                    return id;
                },
            getBaseUrl:function(){
                return "http://localhost:52070/api/";
            },
            showNotification:function(options){
               var not= $.Notify({
		          content: options.message ,
		          type:options.type
        		});             
            },
            
            showError:function(model,errors) {    
            	 _.each(errors.data, function(error) {
                    var controlGroup = $('.' + error.name);
                    controlGroup.addClass('error-state');
                    controlGroup.find('.help-inline').text(error.message);
                    //controlGroup.popover({ content: error.message, placement: 'left', container: 'body', trigger: 'focus' });
            	}, this);
        	},
        	removeError:function(container){
        		container.removeClass('error-state');
            	container.find('.help-inline').text('');
        	},
        	resetErrors : function() {
	            $('.input-control').removeClass('error-state');
	            $('help-inline').text('');
        	}
        };

        return util;

    });