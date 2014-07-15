// Use this as a quick template for future modules
define([
  'jquery',
  'underscore',
  'backbone',
  'atribut',
  'atribute',
  'text!modules/atribut/templates/textTemplate.html',
  'text!modules/atribut/templates/freeTemplate.html',
  'text!modules/atribut/templates/dropTemplate.html',
  //'bootstrap',
  //'bootstrap_spin',
  'select2',
  //'libs/bootstrap/select2_locale_ro',
  'modelbinder'
], function ($, _, Backbone, dateTehniceModel, dateTehniceCollection, textTemplate, freeTemplate, dropTemplate) {
    var DateTehniceView = Backbone.View.extend({
        //el: '#date_tehnice_container',
        tagName:'div',
        attributes:function(){
            return {
                class:'form-group Atribute_'+this.model.get('innerID')+'__val'
            };
        },
        _modelBinder:undefined,
        html:undefined,
        events: {
//            "change input": "setVal",
//            "change select": "setVal",
//            "check input": "setVal"
        },
        initialize: function (options) {
            //console.log(options);
            var self = this;
            //_.bindAll(this);
            this._modelBinder = new Backbone.ModelBinder();
            //this.model.set("val",$('val'+this.options.innerID).val());
            //this.model.set("innerID", this.options.innerID);
            switch (this.model.get("tip")) {
                case "interval":
                    this.html=textTemplate;
                    this.interval = true;
                    break;
                case "lista":
                    this.html= dropTemplate;
                    this.source = this.model.get('source');
                    break;
                case "liber":
                    this.html = freeTemplate;
                    break;
                default:
                    this.html = freeTemplate;
                    break;

            }

          
            self.render();
            //$('.selectpicker').selectpicker({ title: self.model.get("val"),multiple:true});
            //$('#atr' + self.model.get('innerID')).find('input,select').on('change', self.setVal);
        },
        
        render:function(){
            var self = this;
            var grp = self.model.get('grupa');
           
             if(self.model.get('EntityState')!==2){
                this.$el.html(this.html);
                $('#date_tehnice_container').find('#' + grp).find('.panel-body').append(this.$el);
             }
                
            
            if (this.source !== "" && this.source !== undefined && this.source !== null) {
                var ctl = this.$el.find('[name="val"]');
                                $.each(this.source.split(','), function (index, v) {
                                    ctl.append($('<option>', { value: v })
                                        .text(v));
                                });
                ctl.select2({
                    minimumResultsForSearch:-1,
                    width:'80px'
                });
//                if (self.model.get('EntityState')===0) {
//                    self.model.set('val',source.split(',')[0]);
//                }
            }


            if (this.interval) {
                var v = (this.model.get("val")==="" || this.model.get("val")===null)  && this.model.get("min")!==0?this.model.get("min"):this.model.get("val");
                var min = this.model.get("val")!==null && this.model.get("min")===0 ? this.model.get("val"):this.model.get("min");
                var max = this.model.get("val")!==null && this.model.get("max")===0 ? this.model.get("val"):this.model.get("max");
                if (this.model.get("val")!==null) {
                    v = Number(this.model.get("val"));
                    min=this.model.get("min")===0?this.model.get("val"):this.model.get("min");
                    max=this.model.get("max")===0?this.model.get("val"):this.model.get("max");
                }
                else{
                    if(this.model.get("min")===0 && this.model.get("max")!==0){
                        v = this.model.get("max");
                        min = this.model.get("max");
                        max = this.model.get("max");
                    }
                    else if(this.model.get("max")===0 && this.model.get("min")!==0){
                        v = this.model.get("min");
                        min = this.model.get("min");
                        max = this.model.get("min");
                    }
                    else{
                        
                    }
                }
                var frmt;
                switch(this.model.get("grupa")){
                    case "mase":
                    frmt="# kg";
                    break;
                    case "dimensiuni":
                    frmt="# mm";
                    break;
                    default:
                    frmt="#";
                    break;
                }

            this.$el.find('[name="val"]').spinedit({ value: v, minimum: min, maximum: max });
            }
            this._modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));
            this.listenTo(this.model,'change',function(e){
                if (self.model.get('EntityState')===3) {
                    self.model.set('EntityState',1);
                };
             });
            return this;  
        },
        
         close: function(){
                    // An example of what your view should probably be doing when it's closed, otherwise you'll end up w/ zombies
                    this._modelBinder.unbind();
                    this.off();
                    this.undelegateEvents();
                    this.remove();
                },

        validateMe: function (val) {
            $('.DateTehnice').addClass('error');
            return true;
        },

        setVal: function (e) {
            var self= this;
            if (this.validateMe($("#val" + this.model.get('innerID')).val())) {
                    var changed = e.currentTarget;
                    var value = $(e.currentTarget).val();
                    var obj = {};
                    obj['val'] = value;
                    this.model.set(obj);
                    if (this.model.get('EntityState') !== 0) {
                        this.model.set('EntityState', 1);
                    }
                }
            //console.log(this.model.get("val"));
        }
    });
    return DateTehniceView;
});