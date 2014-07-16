// Use this as a quick template for future modules
define(['jquery', 'underscore', 'backbone',
 'bootstrap',
 'vehicul',
 'modules/atribut/views/main', 
 'modules/anvelopa/views/main', 
 'text!modules/vehicul/templates/vehiculTemplate.html',
  'atribute',
   'atribut',
    'anvelopa',
     'anvelope',
      'globals',
       'n_anvelopa',
        'n_anvelope',
         'events',
         'util',
          //'libs/jquery/jquery-serialize',
            'modelbinder',
             'collectionbinder',
              'select2'], 
  function($, _, Backbone,
       Bootstrap,
       vehiculModel,
       DateTehniceView,
        AnvelopeView,
         vehiculTemplate,
          atributeCollection,
           atributModel,
            anvelopaModel,
             anvelopeCollection,
              Globals,
               n_anvelopa,
                n_anvelope,
                 Events,
                 util
                 ) {
    var root=util.getBaseUrl();
    var VehiculView = Backbone.View.extend({
        //el : '.page',
        dateIndex : 0,
        anvelopeIndex : 0,
        colors : [],
        _modelBinder : undefined,
        _atrcollectionBinder:undefined,
        _anvcollectionBinder:undefined,
        resetDateCounter : 0, ///contor necesar afisarii ferestrei de atentionare la schimbarea ext sau nr_omolog
        events : {
            "click #btnSaveVehicul" : "save",
            "click #btnCopyVehicul" : "copy",
            "click #btnBack" : "back",
            "click #addDate" : "addNewDate",
            'click #btnAddAnvelopa' : 'addanvoptional',
            'focus #nr_omolog' : 'resetError',
            //'focus input,select,.bootstrap-select': 'onInputGetFocus',
            //'change input,select,textarea': 'setmodelvalues',
            'keypress #mentiuni' : 'splittophrases'
        },

        back : function() {
            window.history.back();
        },

        initialize : function(options) {
            var self = this;
            this.options = options;
            //self.template = _.template($(vehiculTemplate).html());
            _.bindAll(this, 'addanvoptional', 'splittophrases');
           var self = this;
            //this.id=util.getId();
             $(this.el).html(vehiculTemplate);
            $('#vin').on('keyup',function(e){$(e.currentTarget).val($(e.currentTarget).val().toUpperCase());});
            if (!this.id) {
                this.model = new vehiculModel({
                    id_comanda : this.options.id_comanda,
                    EntityState : 0
                });
                //self.renderview();
            } else {
                /// get model from database(including tehnic data)
                this.model = new vehiculModel({
                    id : this.id
                });
                this.model.fetch({
                    success : function(vehicul) {
                        self.renderview();
                        self.rendermentiuni();
                    },
                    wait : true
                });
            }
        },
        
        render:function(){
           
        },
        
        renderview : function() {
            var self = this;
            
            //self.$el.html(self.template({ model: self.model.toJSON() }));//.hide().animate({width: 'toggle'});
            Globals.set('anvelopefata', null).set('anvelopespate', null);
                this._modelBinder = new Backbone.ModelBinder();
                
                this.listenTo(this.model, 'change', self.modelchanged);
                this.listenTo(this.model, 'change:nr_registru', self.resetvehicul);
                this.listenTo(this.model, 'change:extensie', self.reloaddate);
                this.listenTo(this.model, 'change:vin', self.validatenewvin);
                
                this._modelBinder.bind(this.model, $('#vehiculTemplate'));
                
            if (self.id) {
                this.dateInitialized=true;
                this.anvInitialized=true;
                
                

                var processresult = self.model.get('motiv_respingere').split(';');
                var ls = $('.process_errors ul');
                $.each(processresult, function(key, value) {
                    if (value !== "" && value !== undefined) {
                        var elem = value.split(':');
                        var li = "<li>";
                        if (elem[0] !== "" && elem[0] !== undefined) {
                            li += "<strong>" + elem[0] + ":</strong>";
                        }
                        if (elem[1] !== "" && elem[1] !== undefined) {
                            li += "<i style='color:red'> " + elem[1] + "</i>";
                        }
                        if (elem[2] !== "" && elem[2] !== undefined) {
                            li += " (Cod:" + elem[2] + ")";
                        }
                        li += "</li>";
                        ls.append(li);
                    }
                });
            }

            
            if(self.id){
                self.renderdate();
                self.renderanvelope();
            }
			
			if(!self.iscopy)
            	self.setcombos();

        },
        
        rendermentiuni:function(){
        	var mentiuni = this.model.get('mentiuni').split('\n');
                for ( i = 0; i < mentiuni.length; i++) {
                    $('#ment' + (i + 1)).val(mentiuni[i]);
                }
        },

        setcombos : function() {
            var self = this;
            $('#nr_registru').select2({
            	containerCssClass:'size4',
                ajax : {// instead of writing the function to execute the request we use Select2's convenient helper
                    url : root + "vehicule/getNrOmologare",
                    dataType : 'json',
                    data : function(term, page) {
                        if (self.id && self.model.get('nr_registru') !== "" && term === "") {
                            term = self.model.get('nr_registru').substring(0, 4);
                        }
                        return {
                            q : term // search term
                        };
                    },
                    results : function(data, page) {// parse the results into the format expected by Select2.
                        // since we are using custom formatting functions we do not need to alter remote JSON data
                        return {
                            results : data,
                            id : function(item) {
                                return item;
                            },
                            text : function(item) {
                                return item;
                            }
                        };
                    }
                }
                ,
                initSelection : function(element, callback) {
                    var data = {
                        id : element.val(),
                        text : element.val()
                    };
                    callback(data);
                }
            });

            $('#extensie').select2({
            	containerCssClass:'span2',
                ajax : {// instead of writing the function to execute the request we use Select2's convenient helper
                    url : root + "vehicule/getextensiinr",
                    dataType : 'json',
                    data : function(term, page) {
                        return {
                            q : term, // search term
                            nr_registru : self.model.get('nr_registru')
                        };
                    },
                    results : function(data, page) {// parse the results into the format expected by Select2.
                        // since we are using custom formatting functions we do not need to alter remote JSON data
                        return {
                            results : data,
                            id : function(item) {
                                return item;
                            },
                            text : function(item) {
                                return item;
                            }
                        };
                    }
                },
                initSelection : function(element, callback) {
                    var data = {
                        id : element.val(),
                        text : element.val()
                    };
                    callback(data);
                }
            });

            $('.selectcolor').select2({
                multiple : true,
                containerCssClass:'size4',
                separator : '-',
                maximumSelectionSize : 3,
                ajax : {// instead of writing the function to execute the request we use Select2's convenient helper
                    url : root + "vehicule/getcolors",
                    dataType : 'json',
                    //                    data: function (term, page) {
                    //                        return {
                    //                            q: term, // search term
                    //                        };
                    //                    },
                    results : function(data, page) {// parse the results into the format expected by Select2.
                        // since we are using custom formatting functions we do not need to alter remote JSON data
                        return {
                            results : data,
                            id : function(item) {
                                return item.text;
                            }
                        };
                    }
                },
                initSelection : function(element, callback) {
                    var data = [];
                    $(element.val().split("-")).each(function() {
                        data.push({
                            id : this,
                            text : this
                        });
                    });
                    callback(data);
                }
            });

            $('#id_motor').select2({
               containerCssClass:'size4',
                ajax : {// instead of writing the function to execute the request we use Select2's convenient helper
                    url : root + "vehicule/getMotoare",
                    dataType : 'json',
                    data : function(term, page) {
                        return {
                            q : term, // search term,
                            nr_registru : self.model.get('nr_registru'),
                            ext : self.model.get('extensie')
                        };
                    },
                    results : function(data, page) {
                        //  // parse the results into the format expected by Select2.
                        // since we are using custom formatting functions we do not need to alter remote JSON data
                        return {
                            results : data
                        };
                        //, id: function (item) { return item; },text:function (item) { return item; } };
                    }
                },
                initSelection : function(element, callback) {
                    var data = {
                        id : element.val(),
                        text : self.model.get('cod_motor')
                    };
                    callback(data);
                }
            });
        },

        resetvehicul : function() {
            var self = this;
            if(!self.iscopy){          
	            self.model.set('Atribute', new atributeCollection());
	            self.model.set('Anvelope', new anvelopeCollection());
	            $('#extensie').select2("val", "").trigger("change");
	            self.model.set('an_fabr', "");
	            $.get(root + 'vehicule/getwvta', {
	                nr_registru : self.model.get('nr_registru')
	            }, function(response) {
	                $('#wvta').val(response.wvta);
	                self.model.set('wvta', response.wvta);
	            });
	            $('#id_motor').select2("val", "").trigger("change");
            }
            self.model.set('serie_motor', "");
            $('#culoare').select2("val", "").trigger("change");
            self.dateIndex = 0;
            self.anvelopeIndex = 0;
            //self.renderview();

        },

        reloaddate : function() {
            var self = this;
            var params = {
                nr_reg : this.model.get('nr_registru'),
                ext : this.model.get('extensie'),
                id : self.model.id && self.model.id !== 0 ? self.model.id : 0
            };
            if(params.nr_reg && params.ext ){
                
                if(!self.iscopy){
	                $('#id_motor').select2("val", "");
	                self.model.set('serie_motor', "");
               }
                $.ajax({
                    url : root + 'vehicule/getatributevehicul',
                    data : params,
                    dataType : 'json',
                    type : 'GET',
                    success : function(response) {
                        self.model.get('Atribute').reset(response.atribute); 
                         if(!self.dateInitialized)
                            self.renderdate();  
                        
                        self.model.set('mentiuni',response.mentiuni);
                        	self.rendermentiuni();
                                         
                    },
                    error : function(response) {
                        alert('err');
                    }
                });
                // TODO: delete originals from server and add new standard echip
                self.reloadanvelope();
            }
        },

        reloadanvelope : function() {
            var self = this;
            self.loadAnvList();
            var params = {
                nr_reg : this.model.get('nr_registru'),
                ext : this.model.get('extensie'),
                id : self.model.id && self.model.id !== 0 ? self.model.id : 0
            };
            $.ajax({
                url : root + 'vehicule/getanvelopevehicul',
                data : params,
                dataType : 'json',
                type : 'GET',
                success : function(response) {
                    self.model.get('Anvelope').reset(response);
                     if(!self.anvInitialized)
                            self.renderanvelope();  
                },
                error : function(response) {
                    alert('err');
                }
            });
        },

        save : function(e) {
            e.preventDefault();

            util.resetErrors();
            var self = this;
            // var mentiuni_array = [];
            // _.each($('.mentiuni'), function(el) {
                // mentiuni_array.push($(el).val());
            // });
            // self.model.set('mentiuni', mentiuni_array.join('\n'));
            var options = {
                success : function(model) {
                     var opt={message:"Inregistrarea a fost salvata!",type:"success"};
                     util.showNotification(opt);
                },
                error : function(model, response) {
                    // we get the errors as a string. This was implemented so that we can show
                    // both errors comming from server and from client. We modded the validate
                    // function of the model so that it returns a JSON string containing an element named errors
                    // from server we get the same result
                    if (response.status !== 403) {
                    	var opt={message:"Eroare la salvare!",type:"danger"};
                 		util.showNotification(opt);
                        var data = eval('(' + response.responseText + ')');
                        //console.log(data);
                        util.showError(model, data);
                    }
                }
            };
            //var novalid = self.model.validateIt(self.model.toJSON()); /// try to validate model before send it to server
            //if (novalid) {
            //    return options.error(self.model, novalid); //if model doesn't pass client validation we return the validation messages
            //} else {
            self.model.save({}, options);
            /// model passed client validation, but it is possible not to pass server vaidation
            // }

            //self.notify();
        },

        renderdate : function() {
            var self = this;
            /// for each date tehnice in model we render a view and we pass a local id in order to
            //
            /// identify the control that holds the model.
            if(!self.iscopy){
	            var atrs = _.groupBy(self.model.get("Atribute").toJSON(),"grupa");
	            $.each(atrs, function(i, grp) {
	                ///append accordion element to dom
	                var html =
	                	 '<div class="accordion-frame" id="'+i+'">' 
                			+ '<a class="heading"  href="#">'
                				+ i.charAt(0).toUpperCase() + i.slice(1) 
                			+ '</a>'
                			+ '<div class="panel-body content"></div>'
	                	+ '</div>' ;
	                	
	                $('#date_tehnice_container').find('#date-accordion').append(html);
	            });
	            $('#date_tehnice_container').find('#date-accordion').accordion();
            }
            //console.log(atrs);
            //create collection binder
            var viewCreator = function(model) {
                model.set('innerID',self.dateIndex);
                self.dateIndex++;
                return new DateTehniceView({
                    model : model,
                    innerID: self.dateIndex - 1
                });

            };
            var elManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(viewCreator,false);
            this._atrcollectionBinder = new Backbone.CollectionBinder(elManagerFactory);
            this._atrcollectionBinder.bind(self.model.get('Atribute'), $('#date_tehnice_container'));
            self.dateInitialized=true;
        },

        renderanvelope : function() {
            var self = this;
            if ($('#anvelope_container').find('#standard').length === 0) {
                var html = 
                	 '<div class="accordion-frame" id="standard">' 
	                + '<a class="heading"  href="#">' 
	                + 'Anvelope echipare standard' 
	                + '</a>' 
                 	+ '<div  class="panel-body content"></div>' 
                + '</div>' 
               + '<div class="accordion-frame" id="optionale">' 
	                + '<a class="heading"  href="#">' 
	                + 'Anvelope optionale' 
	                + '</a>' 
                 	+ '<div  class="panel-body content">'
                 		
                 	+ '</div>' 
                + '</div>';
                
                $('#anvelope_container').find('#anvelope-accordion').append(html).accordion();
            }
            self.loadAnvList();
            var viewCreator = function(model) {
                self.anvelopeIndex++;
                return new AnvelopeView({
                    model : model,
                    innerID : self.anvelopeIndex - 1
                });
            };
            var elManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(viewCreator, false);
            this._anvcollectionBinder = new Backbone.CollectionBinder(elManagerFactory);
            this._anvcollectionBinder.bind(self.model.get('Anvelope'), $('#anvelope_container'));
            self.anvInitialized=true;
        },

        loadAnvList : function() {
            var self = this;
            self.listenTo(Events, 'anvelopaRemoved', self.removeanvoptional);
            var source = {};
            $.ajax({
                url : root + 'vehicule/GetListaAvelope',
                async : false,
                data : {
                    nr_registru : self.model.get('nr_registru'),
                    ext : self.model.get('extensie')
                },
                success : function(response) {
                    source = response;
                    var n_anv_fata = new n_anvelope(source.anvelopef);
                    var n_anv_spate = new n_anvelope(source.anvelopes);
                    //if (!Globals.get('anvelopefata')) {
                    Globals.set('anvelopefata', n_anv_fata);
                    //}
                    //if (!Globals.get('anvelopespate')) {
                    Globals.set('anvelopespate', n_anv_spate);
                    //}
                }
            });
        },

        addanvoptional : function(e) {
            var self = this;
            e.preventDefault();
            if (self.model.get('Anvelope').byEchipare(1).models.length < 4 && ((self.model.get('Anvelope').byEchipare(1).models.length === 0 && Globals.get('anvelopefata').length > 0) || self.model.get('Anvelope').byEchipare(1).models.length > 0 && Globals.get('anvelopefata').length > 0)) {
                var optAnv = new anvelopaModel({
                    EntityState : 0,
                    echip : 1
                });
                self.model.get('Anvelope').add(optAnv);
            }

        },

        removeanvoptional : function(e) {
            Globals.get('anvelopefata').add(new n_anvelopa({
                id : e.idanvf,
                text : e.txtanvf
            }));
            Globals.get('anvelopespate').add(new n_anvelopa({
                id : e.idanvs,
                text : e.txtanvs
            }));
            //$('.vehicul_Anvelope_' + e.innerID + '__id_roataf').closest('.optContainer').remove();
            //this.anvelopeIndex--;
        },

        confirmresetdate : function() {
            var self = this;
            var result = false;
            if (self.id && this.model.get('Atribute').models.length > 0) {
                var content = "<table>" + "<tr>" + "<td><span class='label label-danger'>!ATENTIE!</span><td>" + "</tr>" + "<tr>" + "<td>Modificarea acestui camp va rezulta in stergerea datelor tehnice!<td>" + "</tr>" + "<tr>" + "<td>Dupa modificare va trebui sa  recompletati formularul!<td>" + "<tr>" + "</tr>" + "</table>";
                bootbox.confirm(content, function(res) {
                    if (res)
                        self.resetvehicul();
                    result = res;
                });
            } else {
                result = true;
            }
            return result;
        },

        modelchanged : function(e) {
            var self = this;
            if (this.model.get('EntityState') === 3) {
                this.model.set('EntityState', 1);
            }
            $.each(e.changedAttributes(), function(i, value) {
                console.log(i);
                util.removeError($('.' + i));
                //.parent('.form-group'));
            });
        },

        
        hideFieldError : function(field) {
            // hide field error after change
            field.closest('.form-group').removeClass('has-error');
            //field.popover('hide');
            //field.on('hidden.bs.popover', function () {
            //field.popover('destroy');
            //});
            field.closest('.form-group').find('.help-inline').text('');

        },

        resetErrors : function() {
            $('.form-group').removeClass('has-error');
            $('help-inline').text('');
        },
        resetFieldError : function(fieldName) {
            //var $controlGroup = this.$el.find('.' + fieldName);
            fieldName.removeClass('has-error');
            fieldName.find('.help-inline').text('');
        },

        validatenewvin : function(e) {
            var vin = e.get('vin');
            var regex = /^[0-9A-Za-z]+$/;
            var errors = [];
            if (vin !== undefined && vin.length > 0) {
                if (regex.test(vin) && vin.length === 17) {
                    return true;
                } else {
                    errors.push({
                        name : 'vehicul_vin',
                        message : 'Valoare incorecta!'
                    });
                    this.showErrors({}, errors);
                    return false;
                }
            } else {
                errors.push({
                    name : 'vehicul_vin',
                    message : 'Camp obligatoriu!'
                });
                this.showErrors({}, errors);
                return false;
            }
        },

        splittophrases : function(e) {
            var a = [];
            if (e.which !== 13) {
                var t = $(e.target);
                var v = t.val();
                if (v.length > 49 && v.length % 50 === 0) {
                    a = v.split(' ');
                    a[a.length - 2] = a[a.length - 2] + '\n';
                    t.val(a.join(" "));
                }

            }

        },

        close : function() {
            // An example of what your view should probably be doing when it's closed, otherwise you'll end up w/ zombies
            this._modelBinder.unbind();
            this.off();
            this.undelegateEvents();
            this.remove();
        },

        notify : function() {
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
            }

            // Let's check if the user is okay to get some notification
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                var notification = new Notification("Hi there!");
            }

            // Otherwise, we need to ask the user for permission
            // Note, Chrome does not implement the permission static property
            // So we have to check for NOT 'denied' instead of 'default'
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function(permission) {

                    // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === "granted") {
                        var notification = new Notification("Hi there!");
                    }
                });
            }
        },
        
        copy:function(){
        	this.iscopy=true;
        	this._modelBinder.unbind();
        	this._atrcollectionBinder.unbind();
        	this._anvcollectionBinder.unbind();
            this.off();
            //this.undelegateEvents();
        	Backbone.history.navigate('#new');
        	var newmodel = new vehiculModel(this.model.toJSON());
        	this.id=undefined;
        	newmodel.set('EntityState',0).set('vin',"").set('culoare',"").set('serie_motor',"").set('id',undefined);//.set('Atribute',{}).set('Anvelope',{});       	
        	this.model = newmodel;
        	console.log(newmodel);
        	this.dateInitialized=false;
        	this.renderview();
        	this.resetvehicul();
        	this.reloaddate();
        	this.renderanvelope();
        	this.rendermentiuni();
        }
    });
    return VehiculView;
});
