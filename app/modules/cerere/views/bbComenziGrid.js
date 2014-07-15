define(['app',
'jquery',
'underscore',
'backbone',
'cereri',
'vehicule',
'cerere',
'text!modules/cerere/templates/indexTemplate.html',
'modules/cerere/views/editor',
'modules/user//models/usermodel',
'vm',
'moment',
'bbgrid',
'fileupload',
'fileuploadif']
,function(app,$,_,Backbone,Collection,Vehicule,comandaModel,pageTemplate,EditorView,UserSession,Vm,moment){
    var collection = new Collection();
    var CereriPage = Backbone.View.extend({
 
       render:function(){
          this.$el.html(pageTemplate);
          var grid = new Grid();
       },
       
    });
        
    var Grid =  bbGrid.View.extend({
	
    container: '#bbGrid',
    
    collection: new Collection([],{}),
    rows:25,
    rowList: [5,10, 25, 50, 100],
    enableSearch:true,
    loadDynamic:true,
    autofetch:true,
    colModel: [{ title: 'ID', name: 'id',index:true,searchable:true },
               { title: 'Data',name: 'data_comanda', index:true,template:"date",searchable:true },
               { title: 'Numar client',index:true, name: 'nr_client',searchable:true  },
               { title: 'Data client', name: 'data_client', index:true,template:"date",searchable:true  },
               { title: 'status', name: 'status', index:true,searchable:true  },
               { actions:"commands"}],
   template:{
       date:function(value){
           if(value){
               return moment(value).isValid?moment(value).format('DD.MM.YYYY'):value;
           }
       }
   },
   actions:{
       commands:function(id,attributes){
           return '<button title="Importa lista" class="warning btnImportCerere" data-id="'+attributes.id+'"><i class="icon-folder"></i></button>&nbsp;'+
                   '<button title="Edit" class="primary btnEditCerere" data-id="'+attributes.id+'"><i class="icon-pencil"></i></button>&nbsp;'+
                   '<button title="Sterge" class="danger btnDeleteCerere" data-id="'+attributes.id+'"><i class="icon-remove"></i></button>&nbsp;'+
                   '<button title="Trimite" class="info btnSendCerere" data-id="'+attributes.id+'"><i class="icon-mail"></i></button>';
       }
   },
    subgrid: true,
    subgridAccordion: true,    
    onRowExpanded: function($el, rowid) {
        //alert(rowid);
        var coll = new Vehicule([],{id_comanda:rowid});
        var subgrid =  bbGrid.View.extend({
            container: $el,
            rows:25,
            rowList: [10, 25, 50, 100],
            enableSearch:true,
            loadDynamic:true,
            autofetch:true,
            colModel: [ { title: 'VIN', name: 'vin',index:true,searchable:true  },
                        { title: 'WVTA',index:true, name: 'wvta',searchable:true },
                        { title: 'Numar Omologare', name: 'nr_registru',index:true,searchable:true },
                        { title: 'status', name: 'status', index:true,searchable:true  },
                        { actions:'commands'}],
            buttons: [{
                         title: '<i class="icon-plus"></i>',
                         cls:'success',
                         onClick: function(){
                             window.location.hash='#newvehicul/'+rowid;
                            //Backbone.history.navigate('#newvehicul');
                         }    
                        }],
           actions:{
                commands:function(id,attributes){
                    return '<button class="btn-details primary " data-id="'+attributes.id+'" title="Vezi detalii"><i class="icon-pencil"></i></button>&nbsp;'+
                    	   '<button class="btn-delete danger " data-id="'+attributes.id+'" title="Sterge"><i class="icon-remove"></i></button>';
                }
                
           },
           events:{
           	 'click .btn-delete':'deleteVehicul'
           	 ,'click .btn-details':'editVehicul'
           },
           deleteVehicul:function(e){
           		if(myConfirm({title:'Confirma stergere!',message:'Sigur stergeti aceasta inregistrare?'}))alert('da');
	           var id=$(e.currentTarget).data('id');
	           var mdl = this.collection.get(id);
	           //mdl.destroy();

	       }
	       ,editVehicul:function(e){
	       		var id=$(e.currentTarget).data('id');
	       		window.location.hash='#detalii/'+id;
	       }
            ,collection: new Vehicule([],{fk:rowid})
	        });
	        return new subgrid();
   		}//end subgrid
   		,onReady: function(){
	       _.bindAll(this,'addcomanda','editcomanda');
	        $('a', this.$el).removeAttr('href');
	        $('#btnAddCerere').on('click',this.addcomanda);
	        $('.btnEditCerere').on('click',this.editcomanda);
	        
	        $('#fileupload').fileupload({
	                                url : 'http://localhost:52070/Files/UploadHandler.ashx',
	                                maxFileSize : 5000000,
	                                acceptFileTypes : /(\.|\/)(.xls)$/i,
	                                // formData : [{
	                                    // name : 'newsid',
	                                    // value : news.id
	                                // }]
	                            });
         }
        
         ,addcomanda:function(e){
            var self = this;
            e.preventDefault();
            var newCerere = new comandaModel({ nume_beneficiar: UserSession.get("company"),EntityState:0,id_benef:2 });
            //self.collection.add(newCerere);
            var editor = Vm.create(this, 'EditorView', EditorView,{model:newCerere});
            editor.render();
        }
        
        ,editcomanda:function(e){
        	 var self = this;
            e.preventDefault();
            var cerere = self.collection.get($(e.currentTarget).data('id'));
            //self.collection.add(newCerere);
            var editor = Vm.create(this, 'EditorView', EditorView,{model:cerere});
            editor.render();
        }
        
        
        
        ,upload:function(){}
    });
    
return  CereriPage;
});
