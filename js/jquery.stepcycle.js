/* jQuery StepCycle v1.1 */
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "stepCycle",
        defaults = {
            transitionTime: 1.5,
            displayTime: 5,
            transition: 'zoom',
            easing: 'linear',
            navDotClass: 'navDot',
            navContainerSelector: '.navDots',
            navSelectedClass: 'selected',
            navItemTemplate: '<a class="navDot" href="#">&nbsp;</a>',
            prevButton: '.cycle_prev',
            nextButton: '.cycle_next',
            childSelector: '.banner_slide',
            ie8CheckSelector: '.ltie9',
            showNav: true
        },
        transitions = {
            'fade': crossFade,
            'zoom': zoomFade,
            'slidePush': slidePush,
            'slideOver': slideOver
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: init,
        startTimer: startTimer,
        setupNav: setupNav,
        transitionSlide: transitionSlide,
        crossFade: crossFade,
        zoomFade: zoomFade,
        slidePush: slidePush,
        slideOver: slideOver
    };

    function init() {

        // Properties
        this.timeout = 0;
        this.navDotClass = this.options.navDotClass;
        this.activeSlide = 0;
        this.transition = transitions[this.options.transition] || crossFade;

        if(isIE8(this.options.ie8CheckSelector)) {
            this.transition = transitions['fade'];
        }

        // Events
        $(this.options.prevButton).click($.proxy(clickPrev, this));
        $(this.options.nextButton).click($.proxy(clickNext, this));

        // Captures slides
        if (!this.options.childSelector) {
            this.slides = $(this.element).children();
        } else {
            this.slides = $(this.element).find(this.options.childSelector);
        }

        // Initialize the slider
        if (this.slides.length > 0) {

            // hide inner element
            if (isIE8(this.options.ie8CheckSelector)) {
                this.slides.find('.banner_image, .banner_overlay').hide();
            }

            // hide elements
            this.slides.hide().first().show();

            if (isIE8(this.options.ie8CheckSelector)) {
                this.slides.first().find('.banner_image, .banner_overlay').show();
            }

            this.startTimer();

            if(this.options.showNav) {
                setupNav(this, this.options);
            } else {
                $(this.options.navContainerSelector).hide();
            }
        }
    }
   
    function startTimer() {

        var plugin = this;

        plugin.timeout = setTimeout(function() {
            plugin.transitionSlide()
        }, plugin.options.displayTime * 1000);
    }

    // setup nav elements
    function setupNav(rotator, options) {

        var $navContainer = $(options.navContainerSelector);

        $navContainer.empty();
        rotator.slides.each(function(index, element) {
            $navContainer.append(options.navItemTemplate);
        });

        rotator.navDots = $navContainer.find('.' + rotator.navDotClass);
        rotator.navDots.removeClass(options.navSelectedClass);
        $(rotator.navDots[rotator.activeSlide]).addClass(options.navSelectedClass);

        rotator.navDots.find('a').click(function(e) {
            e.preventDefault();
            
            var nextSlide = rotator.navDots.find('a').index(this);
            rotator.transitionSlide(nextSlide);
        });
    }

    // transition to the next slide
    function transitionSlide(nextSlide) {

        if (nextSlide == this.activeSlide) {
            return;
        }

        clearTimeout(this.timeout);
        this.slides.stop(true);

        if (nextSlide==undefined) {
            nextSlide = this.activeSlide + 1;
        }

        if (nextSlide >= this.slides.length || nextSlide < 0) {
            nextSlide = 0;
        }

        this.transition(nextSlide);
        this.activeSlide = nextSlide;

        if(this.options.showNav) {
            this.navDots.removeClass(this.options.navSelectedClass);
            $(this.navDots[this.activeSlide]).addClass(this.options.navSelectedClass);
        }
    }

    // crossfade animation
    function crossFade(nextSlide) {

        var plugin = this,
            $currentSlide = $(this.slides[this.activeSlide]),
            $nextSlide = $(this.slides[nextSlide]);

        var fadingSlide = plugin.activeSlide;
        
        if (isIE8(plugin.options.ie8CheckSelector)) {
            $currentSlide
                .fadeOut(plugin.options.transitionTime * 1000)
                .find('.banner_image, .banner_overlay')
                .fadeOut(plugin.options.transitionTime * 1000);
            $nextSlide
                .fadeIn(plugin.options.transitionTime * 1000)
                .find('.banner_image, .banner_overlay')
                .fadeIn(plugin.options.transitionTime * 1000, function() {
                plugin.startTimer();
            });
        } else {
            $currentSlide.animate({'opacity': 0}, plugin.options.transitionTime * 1000, plugin.options.easing);
            $nextSlide.css('opacity', 0).show().animate({'opacity': 1}, plugin.options.transitionTime * 1000, plugin.options.easing, function(){
                plugin.startTimer();
            });
        }
    }

    // zoomfade animation
    function zoomFade(nextSlide) {

        var plugin = this,
            $currentSlide = $(this.slides[this.activeSlide]),
            $nextSlide = $(this.slides[nextSlide]);

        var aniLeft = $currentSlide.width() * -.125;
        var aniTop = $nextSlide.height() * -.125;

        $currentSlide.animate({'width': "125%", "height":"125%", 'opacity': 0, 'left':aniLeft, 'top':aniTop}, plugin.options.transitionTime * 1000/2);
        $nextSlide.hide().css({'left':0, 'top':0, 'width': "100%", "height":"100%", 'opacity': 0}).show().animate({'opacity': 1}, plugin.options.transitionTime * 1000, function(){
            plugin.startTimer();
        });
    }

    // slidepush animation
    function slidePush(nextSlide) {

        var plugin = this,
            $currentSlide = $(this.slides[this.activeSlide]),
            $nextSlide = $(this.slides[nextSlide]);

        var imageWidth = $currentSlide.width();
        plugin.slides.css('z-index', 100);

        if ((nextSlide > plugin.activeSlide) || (plugin.activeSlide == plugin.slides.length-1 && nextSlide == 0)){
            $currentSlide.css({'z-index':999}).animate({'left': -1*imageWidth}, plugin.options.transitionTime * 1000, plugin.options.easing);
            $nextSlide.css({'left': imageWidth, 'z-index':1000}).show().animate({'left': 0}, plugin.options.transitionTime * 1000, plugin.options.easing, function(){
                plugin.startTimer();
            });
        } else {
            $currentSlide.css({'z-index':999}).animate({'left': imageWidth}, plugin.options.transitionTime * 1000, plugin.options.easing);
            $nextSlide.css({'left': -1*imageWidth, 'z-index':1000}).show().animate({'left': 0}, plugin.options.transitionTime * 1000, plugin.options.easing, function(){
                plugin.startTimer();
            });
        }
    }

    // slideover animation
    function slideOver(nextSlide) {

        var plugin = this,
            $currentSlide = $(this.slides[this.activeSlide]),
            $nextSlide = $(this.slides[nextSlide]);

        var imageWidth = $currentSlide.width();
        plugin.slides.css('z-index', 100);
        $currentSlide.css({'z-index':999});

        if ((nextSlide > plugin.activeSlide) || (plugin.activeSlide == plugin.slides.length-1 && nextSlide == 0)){
            $nextSlide.css({'left': imageWidth, 'z-index':1000}).show().animate({'left': 0}, plugin.options.transitionTime * 1000, plugin.options.easing, function(){
                plugin.startTimer();
            });
        } else {
            $nextSlide.css({'left': -imageWidth, 'z-index':1000}).show().animate({'left': 0}, plugin.options.transitionTime * 1000, plugin.options.easing, function(){
                plugin.startTimer();
            });
        }
    }

    var isIE = function() {
        return (navigator.userAgent.indexOf('Trident') > -1);
    }

    var isIE8 = function(ie8CheckSelector) {
        return ($(ie8CheckSelector).length > 0) ;
    }

    //=====================================================
    // EVENTS
    //=====================================================
    function clickPrev(e) {

        e.preventDefault();

        var nextSlide = this.activeSlide - 1;
        
        if (nextSlide < 0) {
            nextSlide = this.slides.length - 1;
        }

        this.transitionSlide(nextSlide);
    }

    function clickNext(e) {

        e.preventDefault();

        var nextSlide = this.activeSlide + 1;
        
        if (nextSlide >= this.slides.length) {
            nextSlide = 0;
        }

        this.transitionSlide(nextSlide);
    }

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );