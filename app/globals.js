/**
 * variabile globale (set si get)
 * @param {type} $
 * @param {type} _
 * @param {type} Backbone
 * @param {type} Vm
 * @returns {_L5.GlobalVariables}
 */
define(['jquery', 'underscore', 'backbone','vm'],
function ($, _, Backbone,Vm) {
    var GlobalVariables = Backbone.Model.extend({
        defaults: {
            filter: "",
            currPage: "",
            callFuncOnRedirect:"",
            apiurl:""
        },
        initialize: function () {
            
        }

    });

    return new GlobalVariables();
});
