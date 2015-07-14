/***********************************************************************
 * Popup Directive
 * Author: Brenton Klik
 * 
 * Prerequisites:
 *  - AngularJS
 *  - styleSheetFactory (https://github.com/bklik/styleSheetFactory)
 * 
 * Description:
 * Create a popup positioned under the given element.
/**********************************************************************/
angular.module('popupDirective', ['styleSheetFactory'])

.directive('popupDirective', ['styleSheetFactory', function(styleSheetFactory) {
    return {
        scope: {
            api: '='
        },
        restrict: 'E',
        link: function($scope, $element, $attrs) {
            // The document's stylesheet.
            var styleSheet = styleSheetFactory.getStyleSheet();

            // The prefix used by the browser for non-standard properties.
            var prefix = styleSheetFactory.getPrefix();

            // Add this directive's styles to the document's stylesheet.
            styleSheetFactory.addCSSRule(styleSheet, 'popup-directive',
                'background: white;' +
                'border: 1px solid gray;' +
                'border-radius: 2px;' +
                'box-shadow: 0 2px 8px rgba(black, .25);' +
                'display: none;' +
                'min-height: 32px;' +
                'min-width: 32px;' +
                'padding: 8px;' +
                'position: absolute;'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'popup-directive::after', 
                'background-color: white;' +
                'border-left: 1px solid gray;' +
                'border-top: 1px solid gray;' +
                'box-sizing: border-box;' +
                'content: \'\';' +
                'display: block;' +
                '' +
                'position: absolute;' +
                'top: -6px;' +
                'left: 10px;' +
                'height: 10px;' +
                'width: 10px;' +
                '' +
                '-'+prefix+'-transform: rotate(45deg);' +
                'transform: rotate(45deg);'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'popup-directive.arrow-right::after',
                'left: auto;' +
                'right: 16px;'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'popup-directive.show',
                'display: inline-block;' +
                '' +
                '-webkit-animation: popup-slidein 250ms;' +
                '-moz-animation: popup-slidein 250ms;' +
                'animation: popup-slidein 250ms;'
            );

            styleSheetFactory.addCSSKeyframes(styleSheet, 'popup-slidein',
                'from {' +
                    'opacity: 0;' +
                    '-'+prefix+'-transform: translateY(-.5em);' +
                    'transform: translateY(-.5em);' +
                '}' +
                'to {' +
                    'opacity: 1;' +
                    '-'+prefix+'-transform: translateY(0);' +
                    'transform: translateY(0);' +
                '}'
            );

            // Target element the popup should appear next to.
            var target = null;

            // Used by event listeners to prevent the popup from closing.
            var preventClose = function(event) {
                event.stopPropagation();
            }

            $element.bind('mousedown', preventClose);

            var show = function(event) {
                if(typeof event !== 'undefined') {
                    if(typeof event.target !== 'undefined') {
                        target = event.target;
                    } else {
                        target = event;
                    }

                    $element.addClass('show');
                    position(target);

                    target.addEventListener('mousedown', preventClose);
                    target.addEventListener('keydown', hide);
                    window.addEventListener('mousedown', hide);
                } else {
                    console.error('Popup Directive method "show" requires a target element.');
                }
            };

            var hide = function() {
                $element.removeClass('show');
                target.removeEventListener('mousedown', preventClose);
                target.removeEventListener('keydown', hide);
                window.removeEventListener('mousedown', hide);
                target = null;
            }

            var position = function(target) {
                var targetRect = target.getBoundingClientRect();
                var popupRect = $element[0].getBoundingClientRect();
                var bodyRect = document.body.getBoundingClientRect();

                var top = targetRect.top + targetRect.height + 16;
                var left = targetRect.left;
                
                if(targetRect.left + popupRect.width > bodyRect.width) {
                    left = (targetRect.left + targetRect.width) - popupRect.width;

                    if(left > 0) {
                        $element.addClass('arrow-right');
                    } else {
                        left = targetRect.left;
                        $element.removeClass('arrow-right');
                    }
                }

                $element.attr('style', 
                    'top: '+top+'px;' +
                    'left: '+left+'px;'
                );
            };

            $scope.api = {
                show: function(event) {
                    show(event);
                },

                hide: function() {
                    hide();
                }
            };
        }
    }
}]);