# popupDirective

Popup is an Angular directive for creating custom input popup UIs.

**Requirements**

* [AngularJS (1.2+)](http://angularjs.org/)

### Installation

Link to popup's CSS and Javascript files.
```html
<script src="popupDirective/popupDirective.js"></script>
```

In your app's directives.js file, add the popupDirective module.
```javascript
angular.module('myApp', ['popupDirective']);
```

Last, simply add a `<popup-directive>` element you reference from an event on an element.
```html
<input type="text" ng-focus="popup01.show($event)">
<popup-directive api="popup01">Test</popup-directive>
```