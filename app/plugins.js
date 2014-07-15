$.fn.enterAsTab = function(options) {
    $(this).find('input,textarea,button').keypress(function(e) {
        if (e.keyCode == 13) {
            $(this).nextAll('input:visible:not(:disabled):not([readonly]),button:visible:not(:disabled):not([readonly])').first().focus();
            return false;
        }

    });
};

$.fn.toMajuscule = function() {
    $(this).find('input,textarea').keyup(function(e) {
        var ctl = $(e.currentTarget);
        var v = ctl.val();
        //var hiddenDiv = $('#fake'+ctl.attr('name'));
        // if (hiddenDiv.length>0) {
        // hiddenDiv.text(hiddenDiv.text().toU)
        // };
        ctl.val(v.toUpperCase());
        // if (v.length > 40 && v.length <= 41) {
        // console.log(v.length);
        // ctl.height('60px');
        // }else if (v.length<40) {
        // ctl.height('30px');
        // };

    });
};

$.fn.changeTabEnter = function() {
    var self = this;
    //var tabindex = 1; //start tabindex || 150 is last tabindex
    $(this).keypress(function(event) {
        var tabindex = $(event.target).attr('tabindex');
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13' && !$(event.target).hasClass('btn')) {//onEnter
            tabindex++;
            //
            //while element exist or it's readonly and tabindex not reached max do
            while (($("[tabindex='" + tabindex + "']").length == 0 || $("[tabindex='" + tabindex + "']:not([readonly]):not(:disabled)").length == 0) && tabindex != 150) {
                tabindex++;
            }
            //tabindex = getNextTabindex($(":focus").attr("tabindex"));
            //alert(tabindex);
            if (tabindex == 150) {
                tabindex = 1;
            }//reseting tabindex if finished
            $("[tabindex='" + tabindex + "']").focus().select();
            //$('[tabindex=' + getNextTabindex($(":focus").attr("tabindex")) + ']').focus();
            return false;
        }
    });

    $("input,textarea").click(function() {//if changing field manualy with click - reset tabindex
        var input = $(this);
        tabindex = input.attr("tabindex");
    });
};

$.fn.textareaAutoResize = function() {
    var self = this;
    var hiddenDiv = undefined;
    if ($('#fake' + $(this).attr('name')).length === 0) {
        hiddenDiv = $(document.createElement('div'));
        hiddenDiv.attr('id', 'fake' + $(this).attr('name'));
        hiddenDiv.addClass('hiddentextarea common');
        $('body').append(hiddenDiv);
    } else {
        hiddenDiv = $('#fake' + $(this).attr('name'));
    }
    var content = null;
    $(this).keyup(function(event) {
        hiddenDiv = $('#fake' + $(this).attr('name'));
        content = $(this).val();
        content = content.replace(/\n/g, '<br>');
        hiddenDiv.html(content + ' <br> ');

        $(this).css('height', hiddenDiv.height());
        //console.log(hiddenDiv.height());
    });

};

function getNextTabindex(currentTabIndex) {
    return $("[tabindex]").index($("[tabindex=" + currentTabIndex + "]")) + 1;
}

$.fn.serializeObject = function() {

    var self = this, json = {}, push_counters = {}, patterns = {
        "validate" : /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
        "key" : /[a-zA-Z0-9_]+|(?=\[\])/g,
        "push" : /^$/,
        "fixed" : /^\d+$/,
        "named" : /^[a-zA-Z0-9_]+$/
    };

    this.build = function(base, key, value) {
        base[key] = value;
        return base;
    };

    this.push_counter = function(key) {
        if (push_counters[key] === undefined) {
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };

    $.each($(this).serializeArray(), function() {

        // skip invalid keys
        if (!patterns.validate.test(this.name)) {
            return;
        }

        var k, keys = this.name.match(patterns.key), merge = this.value, reverse_key = this.name;

        while (( k = keys.pop()) !== undefined) {

            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            // push
            if (k.match(patterns.push)) {
                merge = self.build([], self.push_counter(reverse_key), merge);
            }

            // fixed
            else if (k.match(patterns.fixed)) {
                merge = self.build([], k, merge);
            }

            // named
            else if (k.match(patterns.named)) {
                merge = self.build({}, k, merge);
            }
        }

        json = $.extend(true, json, merge);
    });

    return json;
};

$.fn.toJSON = function(param) {
    return JSON.stringify(param);
};

