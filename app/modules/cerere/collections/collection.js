/**
 * @author cristian_mar
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'cerere',
    'util'
], function ($, _, Backbone, Model,util) {
    var root = util.getBaseUrl();
    var ComenziCollection = Backbone.Collection.extend({
        model: Model,
        //url: 'variante/getvarianteaprobate',
        meta: function (prop, value) {
            if (value === undefined) {
                return this._meta[prop];
            } else {
                this._meta[prop] = value;
            }
        },
        url: function () {
            var url = root +'comenzi/getcomenzi';
            if (this.meta('quickFilter')) {
                url += this.meta('quickFilter');
            }
            return url;
        },
        initialize: function (models, options) {
            this._meta = {};

        },
         parse: function (response) {
             this.meta('total', response.total);
            // this.meta('filteredSize', response.iTotalDisplayRecords);
             return response.data;
         },
        setFilter: function (filter) {
            this.url = root + 'comenzi/getcomenzi/';
            this.url = this.url + '?' + filter;
        },

        addFilter: function (filter) {
            this.url = root + this.url + filter;
        },

        fetchByIds: function (options) {
            // Save a reference to the existing url
            var baseUrl = this.url;

            // Assign our batch url to the 'url' property and call the server
            this.url = 'personal/getpersonalstatistics?ids=' + options.ids.join(',') + '&datai=' + options.datai + '&datas=' + options.datas;
            this.fetch({
                success: function () {
                    if (typeof (options.success === 'function')) {
                        options.success.call(this);
                    }
                }
            });
            // Restore the 'url' property
            this.url = baseUrl;
        }

        //        fetch: function(args) {
        //            if (args.ids) {
        //                this.ids = args.ids;
        //            }
        //            if (args.parse === undefined) args.parse = true;
        //            return Backbone.Model.prototype.fetch.call(this, args);
        //        }

    });


    return  ComenziCollection;
});