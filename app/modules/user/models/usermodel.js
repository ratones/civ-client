define(['jquery','underscore','backbone','util','events'],function($,_,Backbone,util,Events){
	var User = Backbone.Model.extend({
		url:util.getBaseUrl()+'users/user',
		defaults:{
		    username:"",
		    password:"",
			isAuthenticated:false,
			name:'',
			uid:null,
			roles:['user'],
			apikey:""
		},
		initialize:function(){
            //var api = $.cookie('prograrom');                    
            //atasam la request header apikey, daca aceasta se schimba(la login, de ex.)
		},
		isuserinrole: function (rolestosearch,roles) {
            if(!roles){
                roles=this.getuserroles();
            }
            if (_.intersection(rolestosearch, roles).length > 0) {
                return true;
            }
            return false;
        },
        
        getuserroles:function(){
            var roles=[];
            //var api = JSON.parse(Globals.decrypt('2',$.cookie('prograrom')));
            var api = JSON.parse(localStorage.getItem("prograrom"));
            roles=api.roles;
            if(roles.length===0){
            $.ajax({
                url:Globals.get('rooturl')+'utils/getroles',
                data:null,
                async:false,
                success:function(response){
                     roles=response;
                    }
                });
            }
            return roles;
        },
		login:function(model, options){
		 var self = this;
		      var attrs = model;
            if (self.verifyme(attrs)) {
                //client validation failed - return errors
                return options.error(self, self.verifyme(attrs));
            }
            else {
                //client validation passed - try login on server
                attrs['RememberMe'] = false;
                $.ajax
                    ({
                        type: "POST",
                        //the url where you want to sent the userName and password to
                        url: util.getBaseUrl()+'Account/LogOn',
                        contentType: 'application/json',
                        dataType: 'json',
                        async: false,
                        //json object to sent to the authentication url
                        data: JSON.stringify(attrs),
                        success: function (response) {
                            //data = eval('(' + response + ')');
                            //alert(response.errors.length);
                            if (response.errors.length > 0) {
                                var responseText = JSON.stringify(response);
                                res = { responseText: responseText };
                                return options.error(response.model, res);
                            }
                            self.set('isAutenticated', true);
                            self.set('name', response.displayname);
                            self.set('roles', response.roles);
                            self.set('uid', response.uid);
                            self.set('apikey', response.apikey);
                            //var menu = new UserMenu();
                            //menu.render();
                            self.attributes['isAuthenticated'] = true;
                            return options.success(self, response.redirect);
                        },
                        error: function () { alert('Server error!'); }
                    });
                //return options.success();
            }
        },

        verifyme: function (attrs) {
            var response;
            var obj;

            var err = [];
            if (!attrs.username) {
                err.push({ name: 'username', message: 'Username is required.' });
            }
            if (!attrs.password) {
                err.push({ name: 'password', message: 'Password is required.' });
            }
            obj = { errors: err };
            var responseText = JSON.stringify(obj);
            response = { responseText: responseText };
            return err.length > 0 ? response : false;
        },
		isAuthenticated:function(){
		    return this.attributes.isAuthenticated;
		}
	});
	return new User();
});
