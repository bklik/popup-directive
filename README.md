# popupDirective

Popup is an Angular directive for creating custom input popup UIs.

**Requirements**

* [AngularJS (1.2+)](http://angularjs.org/)

### Installation

Link to popup's CSS and Javascript files.
```html
<script src="popupDirective/popupDirective.js"></script>
```

In your app's directives.js file, add the popup.directives module.
```javascript
angular.module('myApp', ['popupDirective']);
```

Last, simply add a _popup_ attribute to an `<input>`.
```html
<input type="text" ng-focus="popup01.show($event)">
<popup-directive api="popup01">Test</popup-directive>
```