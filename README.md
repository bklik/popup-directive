# popup

Popup is an Angular directive for creating custom input popup UIs.

**Requirements**

* [AngularJS (1.2+)](http://angularjs.org/)
* [JQuery (1.11+)](http://jquery.com/)

### Installation

Link to popup's CSS and Javascript files.
```html
<link rel="stylesheet" href="popup/css/popup.css"/>
<script src="popup/js/directives.js"></script>
```

In your app's directives.js file, add the popup.directives module.
```javascript
angular.module('myApp.directives', ['popup.directives']);
```

Last, simply add a _popup_ attribute to an `<input>`.
```html
<input type="text" popup template/>
```

**Note:** A _template_ directive is also included. Modify it to create your own popup UI!

### Example
http://www.brentonklik.com/popup
