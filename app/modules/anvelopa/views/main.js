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
        _collfBinder:undefined,
        innerID:undefined,
        attributes:function(){
            return {
                   class:'optContainer input-control',
            };
        },
        events: {
            // "change input": "setvalAnvelopa",
            // "change select": "setvalAnvelopa",
            // "check input": "setvalAnvelopa"
        },
        initialize: function (options) {
            var self = this;
            //this.listenTo(Events,'surseAnvFataremoved',self.updateSourcesFata);
            //console.log(options);
            _.bindAll(this,'setvalAnvelopa');
            this.listenTo(Globals.get('anvelopefata'),'change',self.render);
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
           
                // var bindingsHash = {id_roataf: { selector: '[data-name=id_roataf]',
                                           // converter: new Backbone.ModelBinder.CollectionConverter(Globals.get('anvelopefata')).convert} ,
                                   // id_roatas: { selector: '[data-name=id_roatas]',
                                           // converter: new Backbone.ModelBinder.CollectionConverter(Globals.get('anvelopespate')).convert}
                                   // };
            
                                   
               var bindingsHash = Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name');
                this._modelBinder.bind(this.model, this.el, bindingsHash);
                this.listenTo(this.model,'change',this.setvalAnvelopa);
                
                var anvf = this.$el.find('[name="id_roataf"]');
                var anvs = this.$el.find('[name="id_roatas"]');
                
                 // var rowHtml = '<option value=""></option>';
                 // var bindings={};
                 // bindings["id"] = {selAttribute: 'value'};
                 // bindings["text"]={selAtribute:'text'};
                 // var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(rowHtml,bindings);
// 
            	// var collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
// 
            	// // This is very similar to the ModelBinder.bind() function but the collectionBinder will also create nested element views
            	// collectionBinder.bind(Globals.get('anvelopefata'), $('#rf'+self.innerID));
                //self.setselectsources();
                // $.each(Globals.get('anvelopefata').toJSON(), function (index, v) {
                                    // anvf.append($('<option>', { value: v.id })
                                        // .text(v.text));
                                // });
                // $.each(Globals.get('anvelopespate').toJSON(), function (index, v) {
                                    // anvs.append($('<option>', { value: v.id })
                                        // .text(v.text));
                                // });
                anvf.select2({
                    minimumResultsForSearch:-1,
                    data:Globals.get('anvelopefata').toJSON()
                })
                 .on("change",function(e){  
                	// Events.trigger('anvFata:changed',{e:e,view:self});              	
                	// //var f = $('[name="id_roataf"]').not('#'+e.target.id);
                	// //var source=Globals.get('anvelopefata');
                	if(e.added) Globals.get('anvelopefata').get(e.added.id).set('disabled',true);
					if(e.removed) Globals.get('anvelopefata').get(e.removed.id).set('disabled',false);
            			// // if(e.added)
            				// // Globals.get('anvelopefata').remove(e.added.id);
            			// // source=Globals.get('anvelopefata');
            			// // _.each(source.models,function(model){
            				// // console.log(model.get('text'));
            			// // });
                	// // _.each(f,function(el){             		
                		// // $(el).select2('destroy').select2({data:source.toJSON(),minimumResultsForSearch:-1});
                	// // });
                 });
                //Globals.get('anvelopefata').remove(self.model.get('id_roataf'));
                // anvs.select2({
                    // minimumResultsForSearch:-1,
                    // //data:Globals.get('anvelopespate').toJSON()
                // }).change()
                // .on("change",function(e){
                     // // if(e.removed)
                        // // Globals.get('anvelopespate').add(new n_anvelopa({id:e.removed.id,text:e.removed.text}));
                    // // if(e.added)
                    	// // Globals.get('anvelopespate').remove(e.added.id);
                // });
                //anvf.change();
                //anvs.change();
                
                //anvf.closest('.form-group').addClass('vehicul_Anvelope_'+self.innerID+'__id_roataf');
                //anvs.closest('.form-group').addClass('vehicul_Anvelope_'+self.innerID+'__id_roatas');
                 if (!self.del) {
                    this.$el.find('.btnDelAnvelopa').remove();
                }else{
                    this.$el.find('.btnDelAnvelopa').click(function(e){
                    // trigger remove event si transmitem datele curente pentru a fi adaugate la lista de anvelope
                    Events.trigger('anvelopaRemoved',{
                    	innerID:self.innerID,
                        idanvf:anvf.val(),
                        txtanvf:anvf.find(":selected").text(),
                        idanvs:anvs.val(),
                        txtanvs:anvs.find(":selected").text()
                        });
                    self.el.remove();
                    if (self.model.get('EntityState') !== 0) {
                        self.model.set('EntityState', 2);
                    }
                   //Globals.get('anvelopefata').push(self.model.get('id_roataf'));
                   //Globals.get('anvelopespate').push(self.model.get('id_roatas'));
                });
            }
            
            return this;  
            
        },
        
       
         updateSourcesSpate:function(event){
        	optsspate=$('[name="id_roatas"]');
        	var newOptions;
        	 _.each(Globals.get('anvelopespate').models,function(anvelopa){
        		 newOptions+='<option value="'+anvelopa.get('id')+'">'+anvelopa.get('text')+'</option>';
        	 });
        	optsspate.select2('destroy').html(newOptions ).select2();
        },
         // remakeSourcesFata:function(event){
        	// optsfata=$('#optionale standard').find('[name="id_roataf"]');
        	// var newOptions;
        	 // _.each(Globals.get('anvelopefata').models,function(anvelopa){
        		 // newOptions+='<option value="'+anvelopa.get('id')+'">'+anvelopa.get('text')+'</option>';
        	 // });
        	// optsfata.select2('destroy').html(newOptions ).select2();
        // },
         // remakeSourcesSpate:function(event){
        	// optsspate=$('#optionale standard').find('[name="id_roatas"]');
        	// var newOptions;
        	 // _.each(Globals.get('anvelopespate').models,function(anvelopa){
        		 // newOptions+='<option value="'+anvelopa.get('id')+'">'+anvelopa.get('text')+'</option>';
        	 // });
        	// optsspate.select2('destroy').html(newOptions ).select2();
        // },
        
        close: function(){
                    // An example of what your view should probably be doing when it's closed, otherwise you'll end up w/ zombies
                    this._modelBinder.unbind();
                    this.off();
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
                if(self.model.get('echip')===0 && $('#btnAddAnvelopa').length===0){
                	$('#anvelope_container').find('#optionale').find('.panel-body').append('<button class="success" id="btnAddAnvelopa"><i class="icon-plus"></i></button>');
                }
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
        
        setselectsources:function(){
        	//$('.anvelopef').find('option').remove();
        	_.each(Globals.get('anvelopefata').models, function (modelChoice) {         			
          			$('.anvelopef').append("<option value="+ modelChoice.id +">"+ modelChoice.get('text')+"</option>");
        		}); 
        },
        validateMe: function (val) {
            $('.Anvelope').addClass('has-error');
            return true;
        }
    });
    return AnvelopeView;
});