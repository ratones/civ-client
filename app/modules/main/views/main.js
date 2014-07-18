define(['jquery','underscore','backbone','text!modules/main/templates/template.html','vm','plugins'],function($,_,Backbone,template,Vm){
	var AppView = Backbone.View.extend({
		el:'#main',
		initialize:function(){
			
		},
		render:function(){
			
			this.$el.html(template);
			 requirejs(['modules/menu/views/main'], function (Menu) {
                var menu = Vm.create({}, 'Menu', Menu);
                menu.render();
            });
            requirejs(['modules/footer/views/main'], function (Footer) {
                var footer = Vm.create({}, 'Footer', Footer);
                footer.render();
            });
		}
	});
	return AppView;
});