/***********************************************************************
Popup Directive
Author: Brenton Klik

Prerequisites:
 - AngularJS
 - styleSheetFactory (https://github.com/bklik/styleSheetFactory)

Description:
Create a popup positioned under the given element.
/**********************************************************************/
angular.module('popup-directive', ['style-sheet-factory'])

.directive('popup', ['styleSheetFactory', function(styleSheetFactory) {
    return {
        scope: {
            api: '=',
            hideCallback: '&'
        },
        restrict: 'E',
        link: function($scope, $element, $attrs) {
            /************************************************************************
            API
            ************************************************************************/
            $scope.api = {
                show: function(event) {
                    show(event);
                },

                hide: function() {
                    hide();
                },
            };

            /************************************************************************
            Variables
            ************************************************************************/
            // The document's stylesheet.
            var styleSheet = styleSheetFactory.getStyleSheet();

            // The prefix used by the browser for non-standard properties.
            var prefix = styleSheetFactory.getPrefix();

            // Target element the popup should appear next to.
            var target = null;

            // Used to track whether or not a move happened during a touch.
            var touchMove = false;

            // Used by event listeners to prevent the popup from closing.
            var preventClose = function(event) {
                event.stopPropagation();
            }

            /************************************************************************
            Methods
            ************************************************************************/
            // Closes the popup if a touch happens and no touchmove event fired.
            var touchHandler = function(event) {
                if(event.type === "touchmove") {
                    touchMove = true;
                } else if(event.type === 'touchend') {
                    if(!touchMove) {
                        hide();
                    }
                    touchMove = false;
                }
            };

            // Display the popup
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
                    window.addEventListener('touchmove', touchHandler);
                    window.addEventListener('touchend', touchHandler, false);
                } else {
                    console.error('Popup Directive method "show" requires a target element.');
                }
            };

            // Hide the popup
            var hide = function() {
                if(typeof $scope.hideCallback == 'function') {
                    $scope.hideCallback();
                };

                $element.removeClass('show');
                target.removeEventListener('mousedown', preventClose);
                target.removeEventListener('keydown', hide);
                window.removeEventListener('mousedown', hide);
                window.removeEventListener('touchmove', touchHandler);
                window.removeEventListener('touchend', touchHandler);

                target = null;
                $element.removeClass('adjust-arrow');
                styleSheetFactory.removeCSSRule(styleSheet, 'popup.adjust-arrow::after');
            }

            // Position the popup under the element that triggered the event.
            var position = function(target) {
                var targetRect = target.getBoundingClientRect();
                var popupRect = $element[0].getBoundingClientRect();
                var bodyRect = document.body.getBoundingClientRect();
                var parentRect = target.parentNode.getBoundingClientRect();

                var top = (targetRect.top - parentRect.top) + targetRect.height + 16;
                var left = (targetRect.left - parentRect.left);
                
                // Make sure the popup isn't off the edge of the page.
                if(targetRect.left + popupRect.width > bodyRect.width) {
                    var adjustment = ((targetRect.left + popupRect.width) - bodyRect.width);
                    left = left - adjustment;

                    styleSheetFactory.addCSSRule(styleSheet, 'popup.adjust-arrow::after',
                        'left: '+(10 + adjustment)+'px;'
                    );
                    $element.addClass('adjust-arrow');
                }

                $element.attr('style', 
                    'top: '+top+'px;' +
                    'left: '+left+'px;'
                );
            };

            /************************************************************************
            Init
            ************************************************************************/
            // Prevent close if any touchs/clicks happen inside the popup
            $element.bind('mousedown', preventClose);
            $element[0].addEventListener('touchend', preventClose, true);

            /************************************************************************
            Styles
            ************************************************************************/

            // Add this directive's styles to the document's stylesheet.
            styleSheetFactory.addCSSRule(styleSheet, 'popup',
                'background: white;' +
                'border: 1px solid gray;' +
                'border-radius: 2px;' +
                'box-shadow: 0 2px 8px rgba(black, .25);' +
                'display: none;' +
                'min-height: 32px;' +
                'min-width: 32px;' +
                'overflow: visible;' +
                'padding: 8px;' +
                'position: absolute;' +
                'z-index: 1;'
            );

            styleSheetFactory.addCSSRule(styleSheet, 'popup::after', 
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

            styleSheetFactory.addCSSRule(styleSheet, 'popup.show',
                'display: inline-block;' +
                '' +
                '-webkit-animation: popup-slidein 250ms;' +
                '-moz-animation: popup-slidein 250ms;' +
                'animation: popup-slidein 250ms;'
            );

            styleSheetFactory.addCSSKeyframes(styleSheet, 'popup-slidein',
                'from {' +
                    'opacity: 0;' +
                    '-'+prefix+'-transform: translateY(16px);' +
                    'transform: translateY(16px);' +
                '}' +
                'to {' +
                    'opacity: 1;' +
                    '-'+prefix+'-transform: translateY(0);' +
                    'transform: translateY(0);' +
                '}'
            );
        }
    }
}]);
