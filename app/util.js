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
                $('.notifications').notify({
		          message: { text: options.message },
		          type: options.type,
		          fadeOut: {
		            delay: 300000
		          }
        		}).show();               
            },
            
            showError:function(model,errors) {    
            	 _.each(errors.data, function(error) {
                    var controlGroup = $('.' + error.name);
                    controlGroup.addClass('has-error');
                    controlGroup.find('.help-inline').text(error.message);
                    //controlGroup.popover({ content: error.message, placement: 'left', container: 'body', trigger: 'focus' });
            	}, this);
        	},
        	removeError:function(container){
        		container.removeClass('has-error');
            	container.find('.help-inline').text('');
        	},
        	resetErrors : function() {
	            $('.form-group').removeClass('has-error');
	            $('help-inline').text('');
        	}
        };

        return util;

    });