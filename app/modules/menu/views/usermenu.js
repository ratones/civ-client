define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/menu/templates/usermenuTemplate.html',
  'modules/user/models/usermodel',
  'util'
], function ($, _, Backbone, usermenuTemplate, User,util) {
    var UserMenuView = Backbone.View.extend({
        el: '#user-options',
        events:{
            'click #logout':'logout'
        },
        initialize: function () {
            
        },

        render: function () {
            this.usertemplate = _.template($(usermenuTemplate).html());
            this.$el.html(this.usertemplate(User.toJSON()));
        },
         logout:function(e){
            e.preventDefault();
            $.ajax(
                {
                    type: "POST",
                    url:util.getBaseUrl()+'account/logoff',
                    data:{},
                    contentType:'application/json',
                    dataType: 'json',
                    success:function(response){
                
                    },
                    error:function(response){}
                }
            );
            //localStorage.setItem('prograrom',null);
            //$.removeCookie('prograrom',{ path: '/' });
            User.set('isAuthenticated', false);
            User.set('name', "");
            User.set('apikey', 'notset');
            User.set('uid', null); 
        }
    });

    return UserMenuView;
});
