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

    });
    return n_anvelopeCollection;
});