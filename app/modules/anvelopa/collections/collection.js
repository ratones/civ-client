define([
  'jquery',
  'underscore',
  'backbone',
  'anvelopa',
  'util'
], function ($, _, Backbone, anvelopaModel,util) {
    var anvelopeCollection = Backbone.Collection.extend({
        model: anvelopaModel,
        id_vehicul: undefined,

        initialize: function (models, options) {
            if(options!==undefined){
                this.id_vehicul = options.id_vehicul;
                //this.nr_registr = options.nr_reg;
                ///this.ext = options.ext;
            }
            
        },

        url: function () {
            return util.getBaseUrl()+'vehicule/getanvelopevehicul/'+this.id_vehicul;
        },
        
        byEchipare: function(echip) {
           var filtered = this.filter(function(anvelopa) {
              return anvelopa.get("echip") === 1;
              });
        	return new anvelopeCollection(filtered);
  		}
  		,undeleted: function() {
           var filtered = this.filter(function(anvelopa) {
              return anvelopa.get("EntityState") !== 2;
              });
        	return new anvelopeCollection(filtered);
  		}

    });
    return anvelopeCollection;
});