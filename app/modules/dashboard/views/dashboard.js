define(['jquery', 'underscore', 'backbone', 'text!modules/dashboard/templates/dashboard.html'], function($, _, Backbone, template) {
	var client=undefined;
	var DashboardView = Backbone.View.extend({
		//el : '.page',
		initialize : function() {
           
		},
		render : function() {
			var self = this;
			 this.$el.html(template);
		}
	});
	return DashboardView;
});
