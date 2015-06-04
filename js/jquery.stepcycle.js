/*
    jQuery StepCycle v1.0 

    Usage: 
    <div class="banner-slider">

        <ul class="banner-slider_nav"></ul>
        
        <div class="banner">
            <img class="banner_image" src="/images/banner-placeholder.jpg" />
            <div class="banner_overlay">
                <div class="banner_overlay_container">
                    <h1 class="banner_overlay_header">Title</h1>
                    <h2 class="banner_overlay_subhead">Sub-Title</h2>
                    <a class="banner_overlay_cta button button--color4 button--inline " href="#"  data-buttontext="Get started now">Get started now<span class="icon icon--arrow icon--flushright"></span></a>
                </div>
            </div>
        </div>
        <div class="banner">
            <img class="banner_image" src="/images/banner-placeholder2.jpg" />
            <div class="banner_overlay">
                <div class="banner_overlay_container">
                    <h1 class="banner_overlay_header">Title</h1>
                    <h2 class="banner_overlay_subhead">Sub-Title</h2>
                    <a class="banner_overlay_cta button button--color4 button--inline " href="#"  data-buttontext="Get started now">Get started now<span class="icon icon--arrow icon--flushright"></span></a>
                </div>
            </div>
        </div>
    </div>

    <script>
        $(document).ready(function(e){
            $('.banner-slider').stepCycle({transition:'fade', childSelector: '.banner', transitionTime: .75, navContainer: '.banner-slider_nav', navDot:'banner-slider_nav_item', navItemTemplate: '<li class="banner-slider_nav_item banner-slider_nav_item--is-selected"><a href="#">&bull;</a></li>',navSelectedClass: 'banner-slider_nav_item--is-selected'});
        })
    </script>
*/

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "stepCycle",
        defaults = {
            transitionTime: 1.5,
            displayTime: 5,
            transition: 'zoom',
            easing: 'linear',
            navDot: 'navDot',
            navContainer: '.navDots',
            navSelectedClass: 'selected',
            navItemTemplate: '<a class="navDot" href="#">&nbsp;</a>',
            prevButton: '.cycle_prev',
            nextButton: '.cycle_next',
            childSelector: false,
            ie8CheckSelector: '.ltie9',
            showNav: true
        },
        transitions = {
            'fade':crossFade,
            'zoom':zoomFade,
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

    Plugin.prototype.init = function() {

        var $el = $(this.element),
            rotator = this,
            options = this.options;

        // Properties
        this.timeout = 0;
        this.navDotClass = options.navDot;
        this.activeSlide = 0;
        this.transition = transitions[options.transition] || crossFade;
        this.transitionSlide = transitionSlide;
        this.startTimer = startTimer;

        // Events
        $(options.prevButton).click($.proxy(clickPrev, this));
        $(options.nextButton).click($.proxy(clickNext, this));

        // Captures slides
        if (!options.childSelector) {
            this.slides = $el.children();
        } else {
            this.slides = $el.find(options.childSelector);
        }
        
        // Initialize the slider
        if (this.slides.length > 0) {

            this.slides.hide().first().show();
            this.startTimer(rotator, options);

            if(options.showNav) {
                setupNav(rotator, options);
            } else {
                $(options.navContainer).hide();
            }
        }
    };
   
    function startTimer(rotator, options) {

        rotator.timeout = setTimeout(function() {
            rotator.transitionSlide(undefined, options)
        }, options.displayTime * 1000);
    }

    // setup nav elements
    function setupNav(rotator, options) {

        var navContainer = $(options.navContainer);

        navContainer.empty();
        rotator.slides.each(function(index, element) {
            navContainer.append(options.navItemTemplate);
        });

        rotator.navDots = navContainer.find('.' + rotator.navDotClass);
        rotator.navDots.removeClass(options.navSelectedClass);
        $(rotator.navDots[rotator.activeSlide]).addClass(options.navSelectedClass);

        rotator.navDots.find('a').click(function(e) {
            e.preventDefault();
            
            var nextSlide = rotator.navDots.find('a').index(this);
            rotator.transitionSlide(nextSlide, rotator.options);
        });
    }

    // handle previous button click
    function clickPrev(e) {

        e.preventDefault();

        var nextSlide = this.activeSlide - 1;
        
        if (nextSlide < 0) {
            nextSlide = this.slides.length - 1;
        }

        this.transitionSlide(nextSlide, this.options);
    }

    // handle next button click
    function clickNext(e) {

        e.preventDefault();

        var nextSlide = this.activeSlide + 1;
        
        if (nextSlide >= this.slides.length) {
            nextSlide = 0;
        }

        this.transitionSlide(nextSlide, this.options);
    }

    // transition to the next slide
    function transitionSlide(nextSlide, options) {

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

        this.transition(nextSlide, this.startTimer);
        this.activeSlide = nextSlide;

        if(options.showNav) {
            this.navDots.removeClass(options.navSelectedClass);
            $(this.navDots[this.activeSlide]).addClass(options.navSelectedClass);
        }
    }

    // crossfade animation
    function crossFade(nextSlide, callback) {

        var rotator = this,
            options = this.options,
            $currentSlide = $(rotator.slides[rotator.activeSlide]),
            $nextSlide = $(rotator.slides[nextSlide]);
        
        ie8OpacityAnimationFix(rotator, $currentSlide);
        ie8OpacityAnimationFix(rotator, $nextSlide);

        var fadingSlide = rotator.activeSlide;
        
        if (isIE8(options.ie8CheckSelector)) {
            $currentSlide.fadeOut(options.transitionTime * 1000);
            $nextSlide.fadeIn(options.transitionTime * 1000, function(){callback(that);});
        } else {
            $currentSlide.animate({'opacity': 0}, options.transitionTime * 1000, options.easing);
            $nextSlide.css('opacity', 0).show().animate({'opacity': 1}, options.transitionTime * 1000, options.easing, function(){callback(rotator, options);});
        }
    }

    // zoomfade animation
    function zoomFade(nextSlide, callback) {

        var rotator = this,
            options = this.options,
            $currentSlide = $(rotator.slides[rotator.activeSlide]),
            $nextSlide = $(rotator.slides[nextSlide]);

        var aniLeft = $currentSlide.width() * -.125;
        var aniTop = $nextSlide.height() * -.125;

        $currentSlide.animate({'width': "125%", "height":"125%", 'opacity': 0, 'left':aniLeft, 'top':aniTop}, options.transitionTime * 1000/2);
        $nextSlide.hide().css({'left':0, 'top':0, 'width': "100%", "height":"100%", 'opacity': 0}).show().animate({'opacity': 1}, options.transitionTime * 1000, function(){callback(rotator, options);});
    }

    // slidepush animation
    function slidePush(nextSlide, callback) {

        var rotator = this,
            options = this.options,
            $currentSlide = $(this.slides[rotator.activeSlide]),
            $nextSlide = $(rotator.slides[nextSlide]);

        var imageWidth = $currentSlide.width();
        rotator.slides.css('z-index', 100);

        if ((nextSlide > rotator.activeSlide) || (rotator.activeSlide == rotator.slides.length-1 && nextSlide == 0)){
            $currentSlide.css({'z-index':999}).animate({'left': -1*imageWidth}, options.transitionTime * 1000, options.easing);
            $nextSlide.css({'left': imageWidth, 'z-index':1000}).show().animate({'left': 0}, options.transitionTime * 1000, options.easing, function(){callback(rotator, options);});
        } else {
            $currentSlide.css({'z-index':999}).animate({'left': imageWidth}, options.transitionTime * 1000, options.easing);
            $nextSlide.css({'left': -1*imageWidth, 'z-index':1000}).show().animate({'left': 0}, options.transitionTime * 1000, options.easing, function(){callback(rotator, options);});
        }
    }

    // slideover animation
    function slideOver(nextSlide, callback) {

        var rotator = this,
            options = this.options,
            $currentSlide = $(rotator.slides[rotator.activeSlide]),
            $nextSlide = $(rotator.slides[nextSlide]);

        var imageWidth = $currentSlide.width();
        rotator.slides.css('z-index', 100);
        $currentSlide.css({'z-index':999});

        if ((nextSlide > rotator.activeSlide) || (rotator.activeSlide == rotator.slides.length-1 && nextSlide == 0)){
            $nextSlide.css({'left': imageWidth, 'z-index':1000}).show().animate({'left': 0}, options.transitionTime * 1000, options.easing, function(){callback(rotator, options);});
        } else {
            $nextSlide.css({'left': -imageWidth, 'z-index':1000}).show().animate({'left': 0}, options.transitionTime * 1000, options.easing, function(){callback(rotator, options);});
        }
    }

    var ie8OpacityAnimationFix = function(rotator, $element) {

        if (isIE(rotator.options.ie8CheckSelector)) {
            //For opacity animation to work in IE8, you have to set the filter:inherit on all the child elements of the container.
            
            $element.children().each(function () {
                $(this).css('filter', 'inherit');
                $(this).css('opacity', 'inherit');
                ie8OpacityAnimationFix(rotator, $(this));
            });
        }
    }

    var isIE = function() {
        return (navigator.userAgent.indexOf('Trident') > -1);
    }

    var isIE8 = function(ie8CheckSelector) {
        return ($(ie8CheckSelector).length > 0) ;
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