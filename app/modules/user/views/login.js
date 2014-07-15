define(['app','jquery','underscore','backbone','../models/usermodel','text!../templates/loginTemplate.html','modules/menu/views/usermenu','bootstrap','modelbinder'],
function(app,$,_,Backbone,User,loginTemplate,UserMenu){
	var LoginView = Backbone.View.extend({
        el: 'body',
        model: undefined,
        currentpage: "",
        _modelBinder:undefined,
        events: {
            'click #btnLogin': 'login',
            'hidden.bs.modal #login': 'redirect',
            "focus input": "onInputGetFocus"
        },

        initialize: function () {
            
            this.model = User;
            this.listenTo(User, 'change:isAuthenticated', this.redirect);
             this.listenTo(User, 'change:apikey', function (e) {
                $.ajaxSetup({
                     headers: {
                        'ApiKey': e.get('apikey')
                    }
                }); 
            });
            this._modelBinder=new Backbone.ModelBinder();
            this.listenTo(this.model, 'error', this.showErrors);
        },

        render: function () {
            this.template = _.template($(loginTemplate).html());
            this.$el.append(this.template());
            $('#username-placeholder').replaceWith($('#username'));
            $('#password-placeholder').replaceWith($('#password'));
            $('#login').modal('show');
            //var bindings = Backbone.ModelBinder.createDefaultBindings($('#login'), 'data-name');
            this._modelBinder.bind(this.model, $('#login'));
        },

        update: function () {

        },

        login: function (event) {
            var self = this;
            //event.preventDefault();
            var options = {
                wait: true,
                success: function () {
                    self.hideErrors();
                    $('#login').modal('hide');
                    //window.location.replace(page);
                },
                error: function (model, response) {
                    var data = eval('(' + response.responseText + ')');
                    self.showErrors(model, data.errors);
                }
            };
            var attrs = $('#login').find('form').serializeObject();
            self.model.login(attrs, options);
        },

        showErrors: function (model, errors) {
            _.each(errors, function (error) {
                var controlGroup = $('.' + error.name);
                controlGroup.addClass('has-error');
                controlGroup.find('.help-inline').text(error.message);
            }, this);
        },

        hideErrors: function () {
            this.$('.form-group').removeClass('has-error');
            this.$('.help-inline').text('');

        },

        onInputGetFocus: function (e) {
            this.resetFieldError($(e.target).attr('name'));
        },

        resetFieldError: function (fieldName) {
            var $controlGroup = this.$el.find('.' + fieldName);
            $controlGroup.removeClass('has-error');
            $controlGroup.find('.help-inline').text('');
        },


        redirect: function () {
            $('#login').remove();
             var menu = new UserMenu();
            menu.render();
            //console.log(this.model.isAuthenticated());
            if (!this.model.isAuthenticated()) {
                User.set('isAuthenticated', false);
                User.set('name', '');
               
                window.location.hash='#';
                //app.router.defaultAction();
            }
            else {
                //Backbone.history.navigate(this.options.page, this.options.callback);
            }
        }
	});
	return LoginView;
});
