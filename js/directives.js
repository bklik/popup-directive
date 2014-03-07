'use strict';

angular.module('popup.directives', [])
    /**********************************************************************
     * Popup Directive
     * Author: Brenton Klik
     *
     * Prerequisites: AngularJS, JQuery
     *
     * Example Use:
     * <input type="text" popup template/>
     * 
     * Description:
     * This directive creates a box that popups up under the focused input
     * field to which it has been applied as an attribute. The directive
     * will handle all positioning of itself and content, as well as, all
     * necessary event handling to open and close itself appropriately.
     * 
     * The directive expects a 'directive' attribute on the element, which
     * it will use for content of the popup box.
     * 
     * Scope functions popupResult and closePopup are available to update
     * the content of the input element and close the popup respectively.
    **********************************************************************/
    .directive('popup', ['$compile', '$timeout', function($compile, $timeout) {
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element, attrs) {
                var strPopup = null;    // String version of the popup's HTML
                var cPopup = null;      // Compiled version of the popup
                var popup = null;     // Pointer to the current element's popup

                // Wait until the directive is loaded before initializing variables
                $timeout(function() {
                    var directive = element.attr("directive");
                    strPopup = '<div class="popup"><' + directive + '></' + directive + '></div>';
                    cPopup = $compile(strPopup)(scope);
                });

                // Called to prevent popup from closing while actions are being performed
                // inside the popup.
                var preventClose = function(event) {
                    event.stopPropagation();
                }

                // Used to position the popup under the focused element
                var placePopup = function() {
                    var offset = $(element).offset();
                    var top = offset.top + $(element).outerHeight() + 16;
                    var left = offset.left;

                    popup.css('top', top);
                    popup.css('left', left);
                };

                // Used to open the popup
                var openPopup = function(event) {
                    // Make sure any currently open popups are closed
                    closePopup();

                    // Add the popup to the DOM and set it's pointer
                    $("body").append(cPopup);
                    popup = $(cPopup);

                    // Add events to handle the appropriate closing of the popup
                    $(window).bind("mousedown", closePopup);
                    popup.bind("mousedown", preventClose);

                    // Place the popup appropriately
                    placePopup();

                    // Let the popup's content know the element's value
                    scope.$broadcast("POPUP_VALUE", element.val());
                };

                // Used to close the popup and clean up events
                var closePopup = function(event) {
                    if(popup != null) {
                        $(window).unbind("mousedown", closePopup);
                        popup.unbind("mousedown", preventClose);

                        popup.remove();
                        popup = null;
                    }
                };

                // Used by content directives to set the value of the popup's element
                var popupResult = function(result) {
                    $(scope.target).val(result);
                };

                // Events to appropriately handle the opening and closing of the popup
                $(element).bind("focus", openPopup);
                $(element).bind("keydown", function(event){
                    if(event.keyCode == 9)
                        closePopup();
                });

                // Listen for a request to close the popup, and do so
                scope.$on("CLOSE_POPUP", function(event, message) {
                    closePopup(event);
                });

                // Listen for a request to update the element's value, and do so
                scope.$on("UPDATE_POPUP", function(event, message) {
                    element.val(message);
                });
            }
        }
    }])
    
    /**********************************************************************
     * template/templateContent Directives
     * Author: Brenton Klik
     *
     * Prerequisites: AngularJS, JQuery, Popup Directive
     * 
     * Description:
     * These directives are meant to serve as an example template for
     * popup content. The names, and content of these directives can, and
     * should be changed.
    **********************************************************************/
    .directive('template', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // Lets the popup know what directive to inject as content
                $(element).attr("directive", "template-content");
                // A class to customize the style of the input
                $(element).addClass("template");
            }
        }
    }])
    .directive('templateContent', [function() {
        return {
            restrict: 'E',
            template: '<div class="template-content">Template</div>',
            replace: true,
            scope: {},
            link: function(scope, element, attrs) {
                var val = "";   // Variable to track the value

                // POPUP_VALUE is broadcast when the popup is first opened.
                // Listen for it, and store it's value.
                scope.$on("POPUP_VALUE", function(event, message) {
                    val = message;
                });

                // A function to submit the current value back to the popup
                var updateValue = function(event) {
                    scope.$emit("UPDATE_POPUP", val);
                };

                // A function to request the popup be closed
                scope.closeTemplateContent = function(event) {
                    scope.$emit("CLOSE_POPUP");
                };
            }
        }
    }]);