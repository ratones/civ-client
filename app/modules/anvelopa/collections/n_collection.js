define([
  'jquery',
  'underscore',
  'backbone',
  'n_anvelopa'
], function ($, _, Backbone, anvelopaModel) {
    var n_anvelopeCollection = Backbone.Collection.extend({
        model: anvelopaModel,

        initialize: function (models, options) {
           
        },
        url: function () {
        }
        ,active: function() {
           var filtered = this.filter(function(anvelopa) {
              return anvelopa.get("disabled") !== true;
              });
        	return new n_anvelopeCollection(filtered);
  		}

    });
    return n_anvelopeCollection;
});