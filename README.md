jQuery-stepCycle
==================

StepCycle is a simple image rotator.

### Version
1.3

### Options:

* **transitionTime** - how long transitions between slides will take (in seconds). Default is 1.5.
* **displayTime** - how long slides show before switching to the next slide (in seconds). Default is 5.
* **transition** - which transition to use. Options are **fade, zoom, slidePush, slideOver.** Default is zoom.
* **easing** - string with name of easing function to use. Default is linear.
* **navDotClass** - class that is used on the navigation dots. Default is navDot.
* **navContainerSelector** - selector for container that gets created to house the navigation dots. Default is .navDots
* **navItemTemplate** - html for nav items that will be generated for each slide. Default is <a class="navDot" href="#">&nbsp;</a>
* **prevButton** - selector for previous button. Default is .cycle_prev.
* **nextButton** - selector for next button. Default is .cycle_next.
* **childSelector** - selector that determines which children are considered slides. Default is .banner_slide
* **ie8CheckSelector** - selector that is used to determine if the current browser is IE8. Default is .ltie9
* **showNav** - determines whether the nav dots will be shown
* **transitionBegin** - callback that runs when a slide transition begins. Parameters are $oldSlide and $newSlide
* **transitionComplete** - callback that runs when a slide transition is complete. Parameters are $oldSlide, and $newSlide


### Example Usage:

```
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
        $('.banner-slider').stepCycle({
          transition:'fade',
          childSelector: '.banner',
          transitionTime: .75,
          navContainer: '.banner-slider_nav',
          navDot:'banner-slider_nav_item',
          navItemTemplate: '<li class="banner-slider_nav_item banner-slider_nav_item--is-selected"><a href="#">&bull;</a></li>',
          navSelectedClass: 'banner-slider_nav_item--is-selected'
        });
    })
</script>
```


License
----

MIT
