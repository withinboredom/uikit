(function(addon) {
    var component;

    if (jQuery && jQuery.UIkit) {
        component = addon(jQuery, jQuery.UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-accordion", ["uikit"], function(){
            return component || addon(jQuery, jQuery.UIkit);
        });
    }
})(function($, UI){

    UI.component('accordion', {

        defaults: {
            showfirst  : true,
            collapse   : true,
            animated   : true,
            easing     : 'swing',
            duration   : 500,
            toggle    : '.uk-accordion-title',
            containers : '.uk-accordion-content',
            clsactive  : 'uk-active'
        },

        init: function() {

            var $this = this;

            this.element.on('click', this.options.toggle, function(e) {

                e.preventDefault();

                $this.toggleItem($(this).data('wrapper'), $this.options.animated, $this.options.collapse);
            });

            this.update();

            if (this.options.showfirst) {
                this.toggleItem(this.toggle.eq(0).data('wrapper'), false, false);
            }
        },

        toggleItem: function(wrapper, animated, collapse) {

            wrapper.data('toggle').toggleClass(this.options.clsactive);

            var active = wrapper.data('toggle').hasClass(this.options.clsactive);

            if (collapse) {
                this.toggle.not(wrapper.data('toggle')).removeClass(this.options.clsactive);
                this.content.not(wrapper.data('content')).parent().stop().animate({ height: 0 }, {easing: this.options.easing, duration: animated ? this.options.duration : 0});
            }

            if (animated) {

                wrapper.stop().animate({ height: active ? getHeight(wrapper.data('content')) : 0 }, {easing: this.options.easing, duration: this.options.duration, complete: function() {
                    if(active) UI.Utils.checkDisplay(wrapper.data('content'));
                }});

            } else {

                wrapper.stop().height(active ? "auto" : 0);

                if(active) UI.Utils.checkDisplay(wrapper.data('content'));
            }

            this.element.trigger('uk.accordion.toggle', [active, wrapper.data('toggle'), wrapper.data('content')]);
        },

        update: function() {

            var $this = this, $content, $wrapper, $toggle;

            this.toggle = this.find(this.options.toggle);
            this.content = this.find(this.options.containers);

            this.content.each(function(index) {

                $content = $(this);

                if ($content.parent().data('wrapper')) {
                    $wrapper = $content.parent();
                } else {
                    $wrapper = $(this).wrap('<div data-wrapper="true" style="overflow:hidden;height:0;position:relative;"></div>').parent();
                }

                $toggle = $this.toggle.eq(index);

                $wrapper.data('toggle', $toggle);
                $wrapper.data('content', $content);
                $toggle.data('wrapper', $wrapper);
                $content.data('wrapper', $wrapper);
            });

            this.element.trigger('uk.accordion.update', [this]);
        }

    });

    // helper

    function getHeight(ele) {

        var $ele = $(ele), height = "auto";

        if ($ele.is(":visible")) {
            height = $ele.outerHeight();
        } else {

            var tmp = {
                position   : $ele.css("position"),
                visibility : $ele.css("visibility"),
                display    : $ele.css("display")
            };

            height = $ele.css({position: 'absolute', visibility: 'hidden', display: 'block'}).outerHeight();

            $ele.css(tmp); // reset element
        }

        return height;
    }

    // init code
    UI.ready(function(context) {

        setTimeout(function(){

            $("[data-uk-accordion]", context).each(function(){

                var $ele = $(this);

                if(!$ele.data("accordion")) {
                    UI.accordion($ele, UI.Utils.options($ele.attr('data-uk-accordion')));
                }
            });

        }, 0);
    });

    return UI.accordion;
});