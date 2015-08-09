/**
 * Created by awaseem on 15-07-27.
 */

$(document).ready(function() {

    var selector = $(".ui.inverted.vertical.masthead.center.aligned.segment");
    selector.waitForImages({
        waitForAll: true,
        finished: function () {
            selector.animate({ opacity: 1 }, { duration: 1000 });
        }
    });

    $(".proto-image").waitForImages({
        waitForAll: true,
        each: function () {
            $(this).animate({ opacity: 1 }, { duration: 1500 });
        }
    });

    // fix menu when passed
    $('.masthead')
        .visibility({
            once: false,
            onBottomPassed: function() {
                $('.fixed.menu').transition('fade in');
            },
            onBottomPassedReverse: function() {
                $('.fixed.menu').transition('fade out');
            }
        });

    // create sidebar and attach to menu open
    $('.ui.sidebar')
        .sidebar('attach events', '.toc.item');

    $('.proto-image')
        .dimmer({
            on: 'hover'
        });
});