// Use this as a quick template for future modules
define([
  'jquery',
  'underscore',
  'backbone',
  'anvelopa',
  'anvelope',
  'text!modules/anvelopa/templates/dropTemplate.html',
  'globals',
  'n_anvelopa',
  'events',
  'bootstrap',
  //'libs/bootstrap/bootstrap-spinedit',
  'select2',
  //'libs/bootstrap/select2_locale_ro',
  'modelbinder'
], function ($, _, Backbone, anvelopaModel, anvelopeCollection, dropTemplate,Globals,n_anvelopa,Events) {
    var AnvelopeView = Backbone.View.extend({
        tagName:'div',
        html:undefined,
        _modelBinder:undefined,
        anvf:undefined,
        innerID:undefined,
        // attributes:function(){
            // return {
                   // class:'optContainer input-control',
            // };
        // },
        events: {
        },
        initialize: function (options) {
            var self = this;
            _.bindAll(this,'setvalAnvelopa');
            this.listenTo(Globals.get('anvelopefata'),'update',self.updateSourcesFata);
            this.listenTo(Globals.get('anvelopespate'),'update',self.updateSourcesSpate);
            this._modelBinder=new Backbone.ModelBinder();
           var echipare = self.model.get('echip');
           self.innerID = options.innerID;
           this.model.set('innerID',self.innerID);
           var container,del;
           switch(echipare){
               case 0:
                   this.container='standard';
                   this.del=false;
                   break;
               case 1:
                   this.container='optionale';
                   this.del=true;
                   break;                      
           }
           self.render();
        },
        render:function(){
            var self = this;
            
            if(self.model.get('EntityState')!==2){
            	var template = _.template($(dropTemplate).html());
            	self.$el.html(template({listaAnvelopeFata:Globals.get('anvelopefata').toJSON(),
            							listaAnvelopeSpate:Globals.get('anvelopespate').toJSON(),
            							innerid:self.innerID}));
            }
            
           
             
            $('#anvelope_container').find('#' + self.container).find('.panel-body').append(self.$el);
                                   
               var bindingsHash = Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name');
                this._modelBinder.bind(this.model, this.el, bindingsHash);
                this.listenTo(this.model,'change',this.setvalAnvelopa);
                
                this.anvf = this.$el.find('[name="id_roataf"]');
                this.anvs = this.$el.find('[name="id_roatas"]');

              this.anvf.select2({
              		width:'100%',
                    minimumResultsForSearch:-1,
                    data:Globals.get('anvelopefata').toJSON()
                })
                 .on("change",function(e){  
                	if(e.added) Globals.get('anvelopefata').get(e.added.id).set('disabled',true);
					if(e.removed) Globals.get('anvelopefata').get(e.removed.id).unset('disabled');
					Globals.get('anvelopefata').trigger('update');
                 });
                 
                this.anvs.select2({
                	width:'100%',
                    minimumResultsForSearch:-1,
                    data:Globals.get('anvelopespate').toJSON()
                })
                .on("change",function(e){
                      if(e.added)
                         Globals.get('anvelopespate').get(e.added.id).set('disabled',true);;
                     if(e.removed)
                    	 Globals.get('anvelopespate').get(e.removed.id).unset('disabled');
                	 Globals.get('anvelopespate').trigger('update');
                });
                
                
                 if (!self.del) {
                    this.$el.find('.btnDelAnvelopa').remove();
                }else{
                    this.$el.find('.btnDelAnvelopa').click(function(e){
                    // trigger remove event si transmitem datele curente pentru a fi adaugate la lista de anvelope
                    Events.trigger('anvelopa:removed',{
                        idanvf:self.anvf.val(),
                        idanvs:self.anvs.val(),
                        });
                    self.el.remove();
                    if (self.model.get('EntityState') !== 0) {
                        self.model.set('EntityState', 2);
                    }
                });
            }
            
            return this;  
            
        },
        
       
         updateSourcesFata:function(event){
         	this.anvf.removeClass('select2-offscreen').select2({
         			minimumResultsForSearch:-1,
         			data:Globals.get('anvelopefata').toJSON()
         		});
        },
        updateSourcesSpate:function(event){
         	this.anvs.removeClass('select2-offscreen').select2({
         			minimumResultsForSearch:-1,
         			data:Globals.get('anvelopespate').toJSON()
         		});
        },
        
        close: function(){
                    // An example of what your view should probably be doing when it's closed, otherwise you'll end up w/ zombies
                    this._modelBinder.unbind();
                    //this.off();
                    this.undelegateEvents();
                    this.remove();
        },
                
        setvalAnvelopa: function (e) {
            var self = this;
            if (self.model.get('EntityState')===3) {
                    self.model.set('EntityState',1);
                }
                // $.each(e.changedAttributes(),function(i,value){
                     // if(i==='id_roataf'){
                        // Globals.get('anvelopefata').remove(Number(value)); 
                    // }
                    // else if(i==='id_roatas'){
                        // Globals.get('anvelopespate').remove(Number(value)); 
                    // }
                // });
                // if(self.model.get('echip')===0 && $('#btnAddAnvelopa').length===0){
                	// $('#anvelope_container').find('#optionale').find('.panel-body').append('<button class="success" id="btnAddAnvelopa"><i class="icon-plus"></i></button>');
                // }
                //self.setselectsources();
                // $.each(e.previousAttributes(),function(i,value){
                     // if(i==='id_roataf'){
                        // Globals.get('anvelopefata').add(Number(value)); 
                    // }
                    // else if(i==='id_roatas'){
                        // Globals.get('anvelopespate').add(Number(value)); 
                    // }
                // });                    
        
        },

        validateMe: function (val) {
            $('.Anvelope').addClass('has-error');
            return true;
        }
    });
    return AnvelopeView;
});