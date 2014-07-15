define([
  'underscore',
  'backbone',
  'util', 
  'associations'
], function (_, Backbone,util) {
    var atributModel = Backbone.AssociatedModel.extend({
        urlRoot: util.getBaseUrl()+"vehicule/atribute",
        defaults: {
            //val:''
        },
        initialize:function(){
            //this.bind('remove',function(){this.destroy();});
        }
        
//        validate: function () {
//            var err;
//            if (!this.attributes.val) {
//                err = { name: "DateTehnice_" + this.attributes.innerID + "__valoare", message: "Camp obligatoriu" };
//                return err;
//            }
//            if (this.attributes.type==='interval') {
//                if (this.attributes.val < this.attributes.min || this.attributes.val > this.attributes.max) {
//                    err = { name: "DateTehnice_" + this.attributes.innerID + "__valoare", message: "In afara intervalului" };
//                    return err;
//                }
//            }
//            return err !== undefined ? err : false;
//        }
    });
    return atributModel;

});
