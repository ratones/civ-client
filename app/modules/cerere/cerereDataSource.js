define(['util', 'cerere', 'events'], function(utils, CerereModel, Events) {
    var baseurl = utils.getBaseUrl() + 'comenzi/';
    var cerereModel = new kendo.backboneModel(CerereModel);
    var CereriDataSource = new kendo.data.DataSource({
        change : function() {
            Events.trigger("cereriDataSourceChanged", {
                data : this
            });
            // viewModel.set("vehicule", this.view());
        },
        schema : {
            total : "total",
            data : "data",
            errors : 'Errors',
            model :cerereModel
        },
        error : function(e) {
            var errs = e.xhr.responseJSON.Errors;
            if (errs) {
                Events.trigger("cereriDataSourceError", {
                    data : errs
                });
            }
        },
        pageSize : 20,
        serverPaging : true,
        serverFiltering : true,
        serverSorting : true,
        type : "json",
        transport : {
            read : {
                url : baseurl + "GetComenzi",
                type : "POST",
                dataType : "json",
                contentType : 'application/json'
            },
            create : {
                url : baseurl + "edit",
                type : "POST",
                dataType : "json"
            },
            update : {
                url : baseurl + "edit",
                type : "PUT",
                dataType : "json",
                contentType : "application/json"
            },
            destroy : {
                url : baseurl + "edit",
                type : "DELETE",
                dataType : "json",
                contentType : "application/json"
            },
            parameterMap : function(options, operation) {
                if (operation !== "read") {
                    // var d = new Date(options.data_comanda);
                    // var c = new Date(options.data_client);
                    // options.data_comanda = kendo.toString(new Date(d), "dd.MM.yyyy");
                    // options.data_client = kendo.toString(new Date(d), "dd.MM.yyyy");
                    return kendo.stringify(options);
                } else {
                    if (options.filter) {
                        for (var i = 0; i < options.filter.filters.length; i++) {
                            options.filter.filters[i].oper = options.filter.filters[i].operator;
                            // inlocuim proprietatea operator pt ca este cuvant rezervat in C#
                            if (options.filter.filters[i].field === 'data_comanda' || options.filter.filters[i].field === 'data_client') {
                                options.filter.filters[i].value = kendo.toString(options.filter.filters[i].value, "dd.MM.yyyy");
                            }
                        }
                    }
                    return kendo.stringify(options);
                }
            }
        }
    });
    return CereriDataSource;
});
