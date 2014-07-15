define(['jquery','underscore','backbone','text!modules/footer/templates/template.html'],function($,_,Backbone,template){
	var FooterView = Backbone.View.extend({
		el:'#footer',
		initialize:function(){
			
		},
		render:function(){
			this.$el.html(template);
		}
	});
	return FooterView;
});