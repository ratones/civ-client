define([
    'jquery',
    'underscore',
    'cerere',
    'backbone',
    'bootstrap',
    'events',
    'text!modules/cerere/templates/editorTemplate.html',
    'moment',
    // 'libs/jquery/jquery-serialize',
   //'datepicker',
    // 'libs/bootstrap/bootstrap-spinedit',
    // 'libs/bootstrap/jquery.bootstrap-growl.min',
    'modelbinder'//we add dependency to suplimentary js
], function ($, _, cerereModel, Backbone, Bootstrap,Events, editorTemplate,moment) {
    var EditorView = Backbone.View.extend({
        el: 'body',
        // holds the container element of the editor. We need it to destroy it on hide
        // else we will get a bunch of elements and make a mess
        control: undefined,
		_modelBinder:undefined,
        events: {
            //assign functions to DOM events
            'click #btnSaveComanda': 'save'
            //'focus input': 'onInputGetFocus'
            //"change input": "setVal",
            //"change select": "setVal"
        },
        initialize: function () {
            //this.model = new cerereModel();
            _.bindAll(this, 'remove','save','setVal');
             // set the template for the view
            this.template = _.template($(editorTemplate).html());
           
            Backbone.ModelBinder.SetOptions({converter:this.dateconverter});
            this._modelBinder = new Backbone.ModelBinder();
           
            //$("#nr_client").spinedit({value:this.model.get("nr_client"),minimum:4500,maximum:4600});
        },
        
        render:function(){
        	var self=this;
             $.Dialog({
				overlay: true,
				shadow: true,
				flat: false,
				icon: '<i class="icon-pencil"></i>',
				title: 'Cerere',
				content: '',
				width:'500px',
				padding:10,
				onShow: function(_dialog){
					var content = _dialog.children('.content');
					content.html(self.template({model:self.model.toJSON()}));
					$('.datep').datepicker();
				}
			});
           
            this.model.on('change',this.setVal);
             this._modelBinder.bind(this.model,$('#cerereEditor'));//,Backbone.ModelBinder.createDefaultBindings($('#cerereEditor'), 'data-name'));
             
        },
        dateconverter:function(dir, val, attName, model, boundEls){
        	//console.log(attName);
        	switch(attName){
        		case "data_comanda":
        			return moment(val,'DD.MM.YYYY');
        		break;
        		case "data_client":
        			return moment(val,'DD.MM.YYYY');
    			break;
        		default:
        			return val;
    			break;
        	}
        },
        setVal: function (e) {
            console.log(e.changedAttributes());
            if (this.model.get('EntityState') === 3) {
                this.model.set('EntityState', 1);
            }
        },
                
        update: function () { },

        save: function (event) {
            var self = this;
            event.preventDefault(); // prevent form submit
            var options = {
                success: function () {
                    self.hideErrors(); // on success save we hide the validation errors
                    self.control.modal('hide');
                    Events.trigger('comandaChanged');
                    $.bootstrapGrowl("Inregistrarea a fost salvata", {
                        ele: 'body', // which element to append to
                        type: 'success', // (null, 'info', 'error', 'success')
                        offset: { from: 'top', amount: 20 }, // 'top', or 'bottom'
                        align: 'right', // ('left', 'right', or 'center')
                        width: 250, // (integer, or 'auto')
                        delay: 4000,
                        allow_dismiss: true,
                        stackup_spacing: 10 // spacing between consecutively stacked growls.
                    });
                },
                error: function (model, response) {
                    // we get the errors as a string. This was implemented so that we can show 
                    // both errors comming from server and from client. We modded the validate
                    // function of the model so that it returns a JSON string containing an element named errors
                    // from server we get the same result
                    //var data = eval('(' + response.responseText + ')');
                    self.showErrors(model, model.modelerrors);
                }
            };
            //var frmData = this.control.find('form').serializeObject(); // jquery plugin that converts form into a json object
            //console.log(frmData);
            // we call the save function with the data from the form
            // so that if data is invalidated on the client the save is not called
            this.model.save({}, options);
        },

        showErrors: function (model, errors) {
            // we add error class to the group containing errors
            _.each(errors, function (error) {
                var controlGroup = $('.' + error.name);
                controlGroup.addClass('has-error');
                controlGroup.find('.help-inline').text(error.message);
            }, this);
        },

        hideErrors: function () {
            // hide all errors if save is successfull
            this.$('.form-group').removeClass('has-error');
            this.$('.help-inline').text('');

        },

        onInputGetFocus: function (e) {
            // hide error on current field(it is annoying to edit a red field, isn't it?)
            this.resetFieldError($(e.target).attr('name'));
        },

        resetFieldError: function (fieldName) {
            var $controlGroup = this.$el.find('.' + fieldName);
            $controlGroup.removeClass('has-error');
            $controlGroup.find('.help-inline').text('');
        },
        remove: function () {
            // we remove the modal window from DOM(we don't need it since we came from a table row)
            // if we don't remove it for every call we get an element and it's going to be a mess
            this.control.remove();
            // we unbind the view so that upon a new call we get a new view(empty an ready for action)
            // $(this.el).removeData().unbind();
        }
    });
    return EditorView;
});


