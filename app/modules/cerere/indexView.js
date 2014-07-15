
define([
  'jquery',
  'underscore',
  'backbone',
  'cereri',
  'cerere',
  'modules/cerere/rowView',
  'text!modules/cerere/indexTemplate.html',
  'events',
  'modules/cerere/editor',
  'vm',
  'globals',
  'modules/user/usermodel',
  'bootstrap',
  'datatables',
  //'libs/backbone/bbGrid',
  'moment',
  'select2',
], function ($, _, Backbone, comenziCollection, comandaModel,
     RowView,
     comandaTemplate, Events,
     EditorView,
     Vm,
     GlobalVars,
     UserSession) {
    var CereriView = Backbone.View.extend({
        //el: '.page',
        //wizard: undefined,
        filterIndex: 0,
        fieldIndex: 0,
        fieldsVarianta: [],
        fieldsAtribute: [],
        filterFields: [],
        filterconditions: [],
        events: {
            'click #btnAddCerere': 'addcomanda'
        },
        constraint: undefined,
        collection: comenziCollection,
        rows: [],

        filterHandler: function (filter, callback) {
            if (this.options.constraint !== undefined && this.options.constraint !== "") {
                filter = this.options.constraint;
                this.options.constraint = undefined;
            }
            this.constraint = filter;
            GlobalVars.set('filterComenzi', filter);
            //this.collection.setFilter(filter);
            this.collection.fetch({ 
                data: filter,
                type: 'POST',
                success: callback,
                reset: true
            });
        },

        refresh: function () {
            this.collection.fetch({ data: this.constraint,
                type: 'POST', success: function(){$("#comenziTable").dataTable().fnDraw();}, reset: true
            });
            
        },

        initialize: function () {
            var view = this;
            // view.initializeGrid();
            // return;
            _.bindAll(this, 'clearfilters','addcomanda');
            view.listenTo(Events, 'comandaChanged', view.refresh);
            this.$el.html(comandaTemplate).hide().animate({width: 'toggle'});
            this.collection = new comenziCollection([], {});
            // invoke filter handler when param:change event is triggered
            view.bind("param:change", this.filterHandler);
            var tbl = $('#comenziTable');
            tbl.dataTable({
                "bLengthChange": false,
                "bProcessing": true,
                "bEditable": true,
                "bServerSide": true,
                "bFilter": true,
                "bStateSave": true,
                "bAutoWidth": false,
                "sPaginationType": "bs_normal",
                "sDom": "<'row'<'col-6'f><'col-6'l>r>t<'row'<'col-6'i><'col-6'p>>",
                "aoColumns": [

                {
                    "mData": null,
                    "sDefaultContent": "<div><i class='glyphicon glyphicon-chevron-right fakelink drop-details'></i></div>",
                    "bSortable": false
                },
                 { "mDataProp": "id" ,"bSortable": false},
                 { "mDataProp": "data_comanda", "sType": "date", "sClass": "data_cerere" },
                 { "mDataProp": "nr_client", "sClass": "nr_client" },
                 { "mDataProp": "data_client", "sClass": "data_client" },
                 { "mDataProp": "status", "sClass": "status" },
                 {
                     "mData": null,
                     "sDefaultContent": "<div style='text-align:center'><button title='Modifica' class='btnEditComanda btn btn-primary btn-circle'><i class='glyphicon glyphicon-pencil'></i></button>&nbsp;" +
                                        "<button title='Sterge' class='btnDeleteComanda btn btn-danger btn-circle'><i class='glyphicon glyphicon-trash'></i></button>&nbsp;"+
                                        "<button title='Trimite comanda' class='btnTrimiteComanda btn btn-warning btn-circle'><i class='glyphicon glyphicon-share'></i></button></div>",
                     "bSortable": false,
                     "sClass": "command-column",
                     "sWidth" : '200px'
                 }
              ],
                "aoColumnDefs": [
//                    {
//                        // `data` refers to the data for the cell (defined by `mData`, which
//                        // defaults to the column being worked with, in this case is the first
//                        // Using `row[0]` is equivalent.
//                        "mRender": function (data, type, row) {
//                            switch (row['status']) {
//                                case "AVIZAT":
//                                    return "<b style='color:blue'>" + row['status'] + "</b>";
//                                    break;
//                                case "AVIZAT LIMITAT":
//                                    return "<b style='color:blue'>" + row['status'] + "</b>";
//                                    break;
//                                case "NEAVIZAT":
//                                    return "<b style='color:red'>" + row['status'] + "</b>";
//                                    break;
//                                default:
//                                    return "<b>" + row['status'] + "</b>";
//                                    break;
//
//                            }
//                        },
//                        "aTargets": [8]
//                    },
                    {
                        "mRender": function (data, type, row) {
                        return row['data_comanda']!==null?moment(row['data_comanda']).format('DD.MM.YYYY'):"";
                        },
                        "aTargets": [2]
                    },
                    {
                        "mRender": function (data, type, row) {
                        return row['data_client']!==null?moment(row['data_client']).format('DD.MM.YYYY'):"";
                        },
                        "aTargets": [4]
                    }
                    
//                //{ "bVisible": false, "aTargets": [0, 3] }
                ],
                "fnStateSave": function (oSettings, oData) {
                    localStorage.setItem('DataTables_' + window.location.pathname, JSON.stringify(oData));
                },
                "fnStateLoad": function (oSettings) {
                    return JSON.parse(localStorage.getItem('DataTables_' + window.location.pathname));
                },
                "fnCreatedRow": function (nRow, aData, iDataIndex) {
                    // create a view for the row
                    var rowModel = view.collection.get(aData.id);
                    view.rows.push(new RowView({ id: aData.id, el: nRow, model: rowModel }));

                },
                "sAjaxSource": "",
                fnServerData: function (sSource, aoData, fnCallback, settings) {
                     var arrCols = new Array();
                     var objCols = this.fnSettings().aoColumns;
 
                     for(var i=0; i<objCols.length; i++)
                       {
                           arrCols.push(objCols[i].mDataProp);
                        }
                            //endFor
                    aoData.push({ "name": "sColNames", "value": arrCols.join("|") });
                    // function used to populate the DataTable with the current
                    // content of the collection
                    var populateTable = function () {
                        // clear out old row views
                        rows = [];

                        // these 'meta' attributes are set by the collection's parse method                                     
                        var totalSize = view.collection.meta('totalSize');
                        var filteredSize = view.collection.meta('filteredSize');

                        return fnCallback({ iTotalRecords: totalSize,
                            iTotalDisplayRecords: filteredSize,
                            aaData: view.collection.toJSON()
                        });
                    };

                    var refresh = function () { view.trigger("param:change", params, populateTable); };

                    //
                    aoData.shift(); // ignore sEcho
                    var params = $.param(aoData); //
                    //repopulate table after add cerere
                    //view.listenTo(Events, 'comandaChanged', refresh);
                    if (params !== view.constraint) {
                        // trigger param:change event with new parameters. Pass in
                        // populateTable function so fnCallback can be called after
                        // the data has been refreshed. Note that we cannot just call
                        // <a href="/ref#fnDraw">fnDraw</a> on the collection reset event since closure state
                        // in the fnCallback passed to this method would be lost.
                        view.trigger("param:change", params, populateTable);
                    }
                    else {
                        // no filter change, just populate the table
                        populateTable();
                    }
                }
            });

            $("tfoot input").keyup(function () {
                /* Filter on the column (the index) of this element */
                tbl.fnFilter(this.value, $(this).data('index'));
            });

            var oSettings = tbl.fnSettings();
            //var jqInputs = $('.individual-search');

            for (var i = 0; i < oSettings.aoPreSearchCols.length; i++) {
                $('*[data-index="' + i + '"]').val(oSettings.aoPreSearchCols[i].sSearch);
            }

            view.listenTo(Events, 'advancedFilterApply', function () {
                tbl.fnSort([[1, 'asc']]);
            });
            view.listenTo(Events, 'clearFilters', function () {
                tbl.fnFilter("", 0);
            });
            
            view.initializeGrid();
        },


        initializeGrid:function() {
             this.collection = new comenziCollection([], {});
             //this.collection.fetch({ data: this.constraint,
             //type: 'POST', success: function(){}
             //});
            var self = this;
            var ClearExampleGrid = new bbGrid.View({
                container : $('#bbgrid'),
                collection : self.collection,
                rows : 3,
                rowList : [3, 25, 50, 100],
                enableSearch : true,
                loadDynamic : true,
                autofetch:true,
                //postdata : self.constraint,
                colModel : [{
                    title : 'ID',
                    name : 'id'
                }, {
                    title : 'WVTA',
                    index : true,
                    name : 'nr_client'
                }, {
                    title : 'NrOm',
                    name : 'data_client'
                }, {
                    title : 'status',
                    name : 'status'
                }],
                onReady : function() {
                    $('a', this.$el).removeAttr('href');
                }
            });
        }, render: function () {
            var datatable = $('#comenziTable');
            // SEARCH - Add the placeholder for Search and Turn this into in-line formcontrol
            var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
            search_input.attr('placeholder', 'Cautare');
            search_input.addClass('form-control input-small');
            search_input.css('width', '250px').css('margin-right', '15px');

            // SEARCH CLEAR - Use an Icon
            var clear_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] a');
            clear_input.html('<i class="icon-remove-circle icon-large"></i>');
            clear_input.css('margin-left', '5px');

            // LENGTH - Inline-Form control
            var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
            length_sel.addClass('form-control input-small');
            length_sel.css('width', '75px');

            // LENGTH - Info adjust location
            var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_info]');
            length_sel.css('margin-top', '18px').css('margin-left', '15px');
        }, clearfilters: function () {
            this.constraint = undefined;
            Events.trigger("clearFilters");

        }, addcomanda:function(e) {
            e.preventDefault();
            var newCerere = new comandaModel({
                id : 0,
                nume_beneficiar : UserSession.get("company"),
                EntityState : 0
            });
            var editor = Vm.create(this, 'EditorView', EditorView, {
                model : newCerere
            });
            editor.render();
        }, fillgrid:function() {
            this.$el.html(comandaTemplate).hide().animate({
                width : 'toggle'
            });
            this.collection = new comenziCollection();
            this.collection.fetch({
                type : 'POST',
                reset : true
            });
            var grid = new bbGrid.View({
                container : $('#bbGrid'),
                loadDynamic : true,
                rows : 5,
                rowList : [5, 25, 50, 100],
                enableSearch : true,
                //autofetch:true,
                collection : this.collection,
                colModel : [{
                    title : 'ID',
                    name : 'id'
                }, {
                    title : 'Full Name',
                    index : true,
                    name : 'nr_client'
                }, {
                    title : 'Company',
                    name : 'data_client'
                }, {
                    title : 'Email',
                    name : 'status'
                }]
            });
        }
        });


    return CereriView;
});
