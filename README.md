# Popup Directive

Popup is an Angular directive for creating custom input popup UIs.

**Requirements**

* [AngularJS](http://angularjs.org/)
* [bklik/style-sheet-factory](https://github.com/bklik/style-sheet-factory)

### Installation

Link to popup's CSS and Javascript files.
```html
<script src="js/popup-directive.js"></script>
```

In your app's directives.js file, add the popupDirective module.
```javascript
angular.module('myApp', ['popup-directive']);
```

Last, simply add a `<popup>` element you reference from an event on an element.
```html
<input type="text" ng-focus="popup01.show($event)">
<popup api="popup01">Test</popup>
```
