define([
    'underscore',
    'backbone',
    'atribut',
    'atribute',
    'anvelopa',
    'anvelope',
    'util',
    'associations',
    'moment'
], function (_, Backbone,
     atributModel, 
     atributeCollection,
     anvelopaModel,
     anvelopeCollection,
      util) {
    var root = util.getBaseUrl();
    var VehiculModel = Backbone.AssociatedModel.extend({
        urlRoot: root+"vehicule/edit",
        //idAttribute: "cod",
        relations: [{
            type: Backbone.Many,
            key: 'Atribute',
            relatedModel: atributModel,
            collectionType: atributeCollection,
            reverseRelation: {
                key: 'id_vehicul',
                includeInJSON: 'id_veh'
                // 'relatedModel' is automatically set to 'vehiculModel'; the 'relationType' to 'HasOne'.
            }
        },
        {type: Backbone.Many,
            key: 'Anvelope',
            relatedModel: anvelopaModel,
            collectionType: anvelopeCollection,
            reverseRelation: {
                key: 'id_vehicul',
                includeInJSON: 'id_veh'
                // 'relatedModel' is automatically set to 'vehiculModel'; the 'relationType' to 'HasOne'.
            }
        }
        ],

        defaults: {
            Atribute:new atributeCollection(),
            Anvelope:new anvelopeCollection()
        },

        addRelated: function (rel) {
            this.attributes.Atribute.add(rel);
        },
        removeRelated: function (rel) {
            this.attributes.Atribute.remove(rel);
        },

        convertDates: function () {
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
        initialize: function () {
            // this.attributes.data_avizare = this.attributes.data_avizare!==null && moment(this.attributes.data_avizare).isValid()? moment(this.attributes.data_avizare):null;
            // this.attributes.data_post = this.attributes.data_post!==null && moment(this.attributes.data_post).isValid()? moment(this.attributes.data_post):null;
            // this.attributes.data_apb_dot = this.attributes.data_apb_dot!==null && moment(this.attributes.data_apb_dot).isValid()? moment(this.attributes.data_apb_dot):null;
            // this.attributes.data_apb_ci = this.attributes.data_apb_ci!==null && moment(this.attributes.data_apb_ci).isValid()? moment(this.attributes.data_apb_ci):null;
            // this.attributes.data_apb_li = this.attributes.data_apb_li!==null && moment(this.attributes.data_apb_li).isValid()? moment(this.attributes.data_apb_li):null;
            // this.attributes.timestamp = this.attributes.timestamp!==null && moment(this.attributes.timestamp).isValid()? moment(this.attributes.timestamp):null;         
        }
        
//      toJSON:function(){
//          var json = Backbone.Model.prototype.toJSON.call(this);
//          json.data_avizare = (this.get('data_avizare')!==null && this.get('data_avizare')!==undefined) && moment(this.get('data_avizare')).isValid()? moment(this.get('data_avizare')):null;
//          json.data_post = this.get('data_post')!==null && this.get('data_post')!==undefined && moment(this.get('data_post')).isValid()? moment(this.get('data_post')):null;
//          json.data_apb_dot = this.get('data_apb_dot')!==null && this.get('data_apb_dot')!==undefined  && moment(this.get('data_apb_dot')).isValid()? moment(this.get('data_apb_dot')):null;
//          json.data_apb_ci = this.get('data_apb_ci')!==null && this.get('data_apb_ci')!==undefined  && moment(this.get('data_apb_ci')).isValid()? moment(this.get('data_apb_ci')):null;
//          json.data_apb_li = this.get('data_apb_li')!==null && this.get('data_apb_li')!==undefined && moment(this.get('data_apb_li')).isValid()? moment(this.get('data_apb_li')):null;
//          json.timestamp = this.get('timestamp')!==null && this.get('timestamp')!==undefined && moment(this.get('timestamp')).isValid()? moment(this.get('timestamp')):null;
//          return json;
//      }



    });
    return VehiculModel;

});
