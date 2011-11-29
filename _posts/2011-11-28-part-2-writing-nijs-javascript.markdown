---
layout: post
title: Part 2. Writing Nijs JavaScript
type: featured
tags:
- javascript
- nijs
- codereview
---
[Last time](http://mrnordstrom.com/2011/11/27/part-1-writing-nijs-javascript/) we talked about JavaScript as a beautiful but often misunderstood language. Today we'll review our first piece of code; _a simple foundation_ we'll later add more features to. We'll start with just a few snippets, simplified from the commented JSLint-valid source available in the [GitHub repository](https://github.com/dnordstrom/NI.JS).

You can find useful references at the bottom of this post.

First of all, we want to create the object we'll build upon. But before we do that, we should check if the object already exists (e.g. if we have already declared it in another file.) If it does not exist, we create a `Function` object just as we normally would declare a function (because that's essentially what we're doing.)

{% highlight javascript %}

if (typeof NI === "undefined") function NI() { };

{% endhighlight %}

This first line of code already breaks two of our conventions---*always use curly braces* when writing if-statements and other code blocks, and _always put the opening curly brace on the same line_ as the statement. Not only does it enhance the readability of our code, it also prevents semi-colon insertion issues<sup><a href="#footnote_1" title="Beware of Semi-Colon Insertion Issues">1</a></sup>. We are making an exception here since it's a very simple one-liner that we want to keep compact and include in other JS files as well.

There are a few more details we should notice here. First of all, we _always use the typeof operator when checking for undefined variables_, as oopposed to `undefined` or `null`. `undefined` is simply a variable that can be overwritten, meaning our code would break. Second of all, we _use the `===` equality operator instead of `==`_. We do this because `==` compares the values after any necessary type conversion. In other words, `0 == '0'` would produce `true`, which in most cases is undesirable.

Finally, as already mentioned, we are declaring NI as a `Function` instead of using object notation syntax (e.g. `var NI = { };`. By doing so we can, if necessary, define a constructor, but more importantly, we get access to the `prototype` property we'll use next. We could also have written the line like this:

{% highlight javascript %}

if (typeof NI === "undefined") var NI = function () { };
// or
if (typeof NI === "undefined") var NI = new Function();

// This is the JSLint valid version used in the GitHub repository
var NI = (typeof NI === "undefined") ? function () { "use strict"; } : NI;

{% endhighlight %}

Let's move on to extending the NI object with our first library component---an object called NI.JS that will contain our core functionality.

{% highlight javascript %}

NI.prototype.JS = (function () {
  /* Core component goes here */
}());

{% endhighlight %}

This object will be the core of the library, and unrelated features will be added as separate members of the NI object's prototype. We are adding it to the prototype since we want it readily available to all instances of `NI` and those inheriting from it in one way or the other.

Now, if you are new to the module pattern<sup><a href="#footnote_1" title="JavaScript Module Pattern In-Depth">2</a></sup> and prototypal inheritance you may be wondering just what the hell is going on here. It's actually very straight-forward.

We insert `()` immediately after the closing curly brace because we want to call the function right away. To make this obvious, we _always enclose a self-evoking function in parenthesis_, which greatly enhances readability. This means the return value of the function, not the actual function, will be assigned to `NI.prototype.JS`. The function then acts as a constructor and we don't need to use the `new` keyword to instantiate the object.

Let's add the first core method of the library; a simple shortcut for `document.getElementById`.

{% highlight javascript %}

/* Public */
NI.prototype.JS = (function() {
  "use strict";

  /* Private */
  var self = { };

  /* Privileged */
  self.find = function (element) {
    if (!document.getElementById) return false;
    return document.getElementById(element);
  }

  return self;
}

{% endhighlight %}

This is a pattern I like to use at the moment for instantiating our object. At the top of the self-evoking function we enable strict mode, introduced in ECMAScript 5. I recommend reading up on strict mode and always using it, but this library will enable it on a per-object basis to keep it optional.

Now to the more interesting parts, starting with a `var self = { };` declaration. At that point in the function, `self` is a private variable. However, the purpose of `self` is to be returned at the end of the function, effectively exposing it to the public. 

By returning `self`, we can use it to _define the public interface_ of our object. Any method added as a member of `self` will be privileged, meaning it has access to both public and private variables within its scope<sup><a href="#footnote_3" title="Private Members in JavaScript">3</a></sup>. We could also have written the self-evoking function as follows:

{% highlight javascript %}

/* Public */
NI.prototype.JS = (function() {
  "use strict";
  
  /* Private variables go here */
  
  return {
    /* Privileged */
    find: function () {
      if(!document.getElementById) return false;
      return document.getElementById(element);
    }
  };
}());

{% endhighlight %}

The above function would result in an equivalent object. This is actually a popular and quite nice way of separating private variables and functions from the public interface. However, I prefer defining a public interface using `self` as it reduces the level of indenting and gives the code a more natural flow. In the end it comes down to personal preference as both produce an equivalent object.

As for the `find` method, it simply checks if `document.getElementById` exists and if it does, calls it and returns the resulting element node. Otherwise, we just return false. If we want to be extra picky, we can use the `typeof` operator to test for both the `document` (DOM) object and its `getElementsById` method. We'll keep it simple for now.

Ideally we should also have _only one exit point per function_, a convention which we are violating by having multiple return-statements. While conditional one-liners like this one is a farily clean and valid exception, this should be kept in mind.

A minor note; ideally, to be compatible with JSDoc Toolkit, we would comment our private variables and functions with `@private`, and our public ones with `@public`. Unfortunately, Pygments which I use for syntax highlighting can't parse those comments, and neither does JSDoc Toolkit support the `@privileged` tag. 

If we would run this through <a href="http://www.jslint.com/" title="JSLint">JSLint</a>, which I suggest you do with any JavaScript code you write, it would give errors. However, most of the errors reported have to do with spacing/indenting and the missing curly braces mentioned earlier---things we do intentionally.

The GitHub repository mentioned in the first paragraph contains the JSLint-valid revision of this code, using the conventions listed below.

That will be all for today---we now have a basic foundation to build upon. If you have any suggestions on how to improve the code or what to do next time, feel free to leave a comment!

Conventions
-----------
* Always use curly braces.
* Always put the opening curly brace on the same line as the statement.
* Use the typeof operator when checking for undefined variables.
* Avoid type coercion by using `===` instead of `==`.
* Always enclose a self-evoking function in parenthesis.
* Separate public, privileged and private members for proper encapsulation.
* Have one exit point per function, avoiding multiple return-statements.
* Validate your code using <a href="http://www.jslint.com/" title="JSLint">JSLint</a>.

Footnotes
---------
<ol>
  <li>
    <a id="footnote_1" href="http://robertnyman.com/2008/10/16/beware-of-javascript-semicolon-insertion/" title="Beware of JavaScript Semi-Colon Insertion">Beware of JavaScript Semi-Colon Insertion</a>
  </li>
  <li>
    <a id="footnote_2" href="http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth" title="JavaScript Module Pattern In-Depth">JavaScript Module Pattern In-Depth</a>
  </li>
  <li>
    <a id="footnote_3" href="http://javascript.crockford.com/private.html" title="Private Members in JavaScript">Private Members in JavaScript</a>
  </li>
</ol> 
