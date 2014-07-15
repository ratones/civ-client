/**
 * @author cristian_mar
 */
define(['underscore', 'backbone', 'vehicul', 'vehicule', 'util', 'associations', 'moment'], function(_, Backbone, vehiculModel, vehiculeCollection, util) {
    var ComandaModel = Backbone.AssociatedModel.extend({

        urlRoot : util.getBaseUrl() + "comenzi/edit",
        //idAttribute: "cod",
        relations : [{
            type : Backbone.Many,
            key : 'Vehicule',
            relatedModel : vehiculModel,
            collectionType : vehiculeCollection,
            reverseRelation : {
                key : 'id',
                includeInJSON : 'Cerere'
                // 'relatedModel' is automatically set to 'vehiculModel'; the 'relationType' to 'HasOne'.
            }
        }],
        fields:{
                    id:{type:"number"},
                    data_comanda:{type:"date"},
                    nr_client:{type:"string"},
                    data_client:{type:"date"},
                    id_benef:{type:"number"},
                    status:{type:"string"}
        },
        
        // isNew : function() {
            // if (this.id === 0 || !this.id)
                // return true;
            // else
                // return false;
        // },
        defaults : {
            EntityState : 0,
            idField:"id",
            Vehicule : []//new vehiculeCollection()
        },

        addRelated : function(rel) {
            this.attributes.Vehicule.add(rel);
        },
        removeRelated : function(rel) {
            this.attributes.Vehicule.remove(rel);
        },

        convertDates : function() {
            // this.attributes.data_avizare = moment(this.attributes.data_avizare) !== null && moment(this.attributes.data_avizare).isValid()
            // ? moment(this.attributes.data_avizare)
            // : null;
            // this.attributes.data_post = moment(this.attributes.data_post) !== null && moment(this.attributes.data_post).isValid()
            // ? moment(this.attributes.data_post)//.format('DD.MM.YYYY')
            // : null;
            // this.attributes.data_apb_dot = moment(this.attributes.data_apb_dot) !== null && moment(this.attributes.data_apb_dot).isValid()
            // ? moment(this.attributes.data_apb_dot)//.format('DD.MM.YYYY')
            // : null;
            // this.attributes.data_apb_li = moment(this.attributes.data_apb_li) !== null && moment(this.attributes.data_apb_li).isValid()
            // ? moment(this.attributes.data_apb_li)//.format('DD.MM.YYYY')
            // : null;
            // this.attributes.data_apb_ci = moment(this.attributes.data_apb_ci) !== null && moment(this.attributes.data_apb_ci).isValid()
            // ? moment(this.attributes.data_apb_ci)//.format('DD.MM.YYYY')
            // : null;
            // this.attributes.timestamp = moment(this.attributes.timestamp) !== null && moment(this.attributes.timestamp).isValid()
            // ? moment(this.attributes.timestamp)//.format('DD.MM.YYYY')
            // : null;

            //        save: function (model,options) {
            //            if (moment(this.attributes.data_avizare) !== null && moment(this.attributes.data_avizare).isValid()) {
            //                this.attributes.data_avizare = null;
            //                this.attributes.data_post = moment(this.attributes.data_post).format('DD.MM.YYYY');
            //                this.attributes.data_apb_dot = null;
            //                this.attributes.data_apb_li = null;
            //                this.attributes.data_apb_ci = null;
            //                this.attributes.timestamp =null;
            //            }
            //            return Backbone.Model.prototype.save.call(this,options);
        },
        initialize : function() {
            // this.attributes.data_avizare = this.attributes.data_avizare!==null && moment(this.attributes.data_avizare).isValid()? moment(this.attributes.data_avizare):null;
            // this.attributes.data_post = this.attributes.data_post!==null && moment(this.attributes.data_post).isValid()? moment(this.attributes.data_post):null;
            // this.attributes.data_apb_dot = this.attributes.data_apb_dot!==null && moment(this.attributes.data_apb_dot).isValid()? moment(this.attributes.data_apb_dot):null;
            // this.attributes.data_apb_ci = this.attributes.data_apb_ci!==null && moment(this.attributes.data_apb_ci).isValid()? moment(this.attributes.data_apb_ci):null;
            // this.attributes.data_apb_li = this.attributes.data_apb_li!==null && moment(this.attributes.data_apb_li).isValid()? moment(this.attributes.data_apb_li):null;
            // this.attributes.timestamp = this.attributes.timestamp!==null && moment(this.attributes.timestamp).isValid()? moment(this.attributes.timestamp):null;
        }
        // tryparsedate:function(datefield){
        // var returnDate = null;
        // if (this.get(datefield)!==null && this.get(datefield)!==undefined) {
        // if(moment(this.get(datefield)).isValid())
        // returnDate = moment(this.get(datefield));
        // else if(moment(this.get(datefield),'DD.MM.YYYY').isValid())
        // returnDate = moment(this.get(datefield),'DD.MM.YYYY');
        // else
        // returnDate = null;
        // }
        // return returnDate;
        // },
        //
        // toJSON:function(){
        // var json = Backbone.Model.prototype.toJSON.call(this);
        //
        // json.data_comanda = this.tryparsedate('data_comanda');
        // json.data_client = this.tryparsedate('data_client');
        // return json;
        // }

    });
    return ComandaModel;

});
