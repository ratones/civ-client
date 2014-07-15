define([
  'jquery',
  'underscore',
  'backbone',
  'atribut',
  'util'
], function ($, _, Backbone, atributModel,util) {
    var atributeCollection = Backbone.Collection.extend({
        model: atributModel,
        id_vehicul: undefined,

        initialize: function (models, options) {
            if(options!==undefined){
                this.id_vehicul = options.id_vehicul;
                //this.nr_registr = options.nr_reg;
                ///this.ext = options.ext;
            }
            
        },

        url: function () {
            returnutil.getBaseUrl()+'vehicule/getatributevehicul/'+this.id_vehicul;
        },
        
         byGroup: function(grupa) {
            filtered = this.filter(function(box) {
                return box.get("grupa") === grupa;
            });
            return new atributeCollection(filtered);
        }

    });
    return atributeCollection;
});