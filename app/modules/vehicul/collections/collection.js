define([
    'jquery',
    'underscore',
    'backbone',
    'vehicul',
    'util'
], function ($, _, Backbone, Model,util) {
    var root = util.getBaseUrl();
    var VehiculeCollection = Backbone.Collection.extend({
        model: Model,
        //url: 'vehicule/getvehicule/'+this.id_comanda,
        meta: function (prop, value) {
            if (value === undefined) {
                return this._meta[prop];
            } else {
                this._meta[prop] = value;
            }
        },
        url: function () {
            var url = root+'vehicule/getvehicule';
            if (this.id_comanda) {
                url += '/'+this.id_comanda;
            }
            return url;
        },
        initialize: function (models, options) {
            if (options) {
                if (options.fk) {
                    this.id_comanda = (options.fk);
                }
            }
            this._meta = {};

        },
        parse: function (response) {
            this.meta('totalSize', response.iTotalRecords);
            this.meta('filteredSize', response.iTotalDisplayRecords);
            return response.aaData;
        },
        setFilter: function (filter) {
            this.url = root+'vehicule/getvehicule/'+this.id_comanda;
            this.url = this.url + '?' + filter;
        },

        addFilter: function (filter) {
            this.url = root+this.url+ filter;
        }

        //        fetch: function(args) {
        //            if (args.ids) {
        //                this.ids = args.ids;
        //            }
        //            if (args.parse === undefined) args.parse = true;
        //            return Backbone.Model.prototype.fetch.call(this, args);
        //        }

    });


    return VehiculeCollection;
});