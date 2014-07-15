/** View representing a row of that table */
/**
 * 
 * @param {type} $
 * @param {type} _
 * @param {type} comandaModel
 * @param {type} Backbone
 * @param {type} Bootstrap
 * @param {type} Vm
 * @param {type} Events
 * @param {type} UserSession
 * @returns {unresolved}
 */
define([
    'jquery',
    'underscore',
    'cerere',
    'backbone',
    'bootstrap',
    'vm',
    'events',
    'modules/user/usermodel',
    //'views/vehicule/vehiculeView',
    'modules/cerere/editor',
    'bootbox'
], function ($, _, comandaModel, Backbone, Bootstrap, Vm, Events,UserSession,
    //DetailsView,
    EditorView,bootbox) {
    var ComandaRowView = Backbone.View.extend({
        //DOM events have some functions...
        events: {
            "click .drop-details": "toggleVehicule",
            "click .btnEditComanda":"openform",
            "click .btnDeleteComanda":"deletemodel",
            "click .btnTrimiteComanda":"sendcomanda"
        },

        initialize: function () {
           _.bindAll(this,'toggleVehicule','openform','deletemodel','sendcomanda');
          this.length = this.$el.find('td').length; 
          this.$el.attr('id', 'comandaRow'+this.id);
         } ,
        render:function(){
           
        },

        deletemodel: function () {
            var self = this;
            bootbox.confirm("Sigur doriti stergerea acestei inregistrari?<br /> Operatia este irevocabila!", function (res) {
                if (res) {
                    self.model.destroy({
                        success: function () {
                            Events.trigger('comandaChanged');
                        }
                    });
                }
            });
        },
        
        openform:function(e){
            e.preventDefault();
            var self = this;
            var editor = Vm.create(this, 'EditorView', EditorView, { model: self.model });
            editor.render();  
        },
        
        toggleVehicule: function (e) {
            var drop = $(e.currentTarget);
            if (drop.hasClass('glyphicon-chevron-right')) {// see if the dropbutton is + then we need to show the details
                drop.removeClass('glyphicon-chevron-right'); // we change the lass so that will show a - sign now
                drop.addClass('glyphicon-chevron-down');
                //we create a new td that will hold the details table. The new td will have a colspan so that will stretch 
                // to the width of the parent datatable. We adjust some padding and margins and that's it
                var container = $("<tr style='display:none'><td class='dataTable_details' id='detailsVehicule"+this.id+"' colspan='" + this.length + "'><div class='detailsPage'></div></td></tr>");
                this.$el.after(container);
                var details = new DetailsView({ id_comanda: this.model.get('id'),el:'#detailsVehicule'+this.id });
                details.render();
                container.show("blind");
            } else {
                drop.removeClass('glyphicon-chevron-down');
                drop.addClass('glyphicon-chevron-right');
                this.$el.next('tr').hide("blind", function () { $(this).remove(); });
            }
        },
                
        sendcomanda:function(){
            $.post('comenzi/postcomanda',{id:this.model.id},function(response){});
        }

    });

    return ComandaRowView;
});

 