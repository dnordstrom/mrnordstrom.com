---
layout: post
title: Part 1. Writing Nijs JavaScript
tags:
- nijs
- javascript
- codereview
type: featured
---
Douglas Crockford tells us that JavaScript is the _most misunderstood programming or scripting language_ available today. I suppose this is because of its popularity among beginners and the seemingly strange and uncommon concept of _prototypal inheritance_ which is at the core of JavaScript, as opposed to the class based approach used in languages like Ruby and PHP.

JavaScript is one of those languages many people either have a hard time fully grasping, or they believe they are proficient enough to not need to learn more about. However, since JavaScript is pretty much the only client-side scripting language running in web browsers these days, it is a great idea to learn more about it. Besides that, JavaScript is actually also a very useful and beautiful object-oriented language that many people underestimate.

To gain a better understanding of how JavaScript works and what the best practices are, and to put that knowledge to good use, I have started writing a _library called NI::JS_ (pronounced "nice") that will incorporate good conventions and provide a set of helpers/tools for Javascript development.

Of course, there are many libraries already out there. [Prototype.js](http://www.prototypejs.org/), [jQuery](http://jquery.com/), [Bootstrap](http://twitter.github.com/bootstrap/) and [Ender](http://ender.no.de/) are just a few examples. It is my opinion that many of these libraries and _frameworks tend to over-abstract and obscure JavaScript_ as a language. Prototype.js for example offers class-based inheritance.

I am not saying that this is necessarily a bad thing. Actually, I enjoy developing with Prototype.js and other libraries. The chaining and abstraction featured in jQuery can be useful, especially to beginners but also to more serious developers.

What I am saying is that I personally like JavaSript as a language and I would like to stick with the prototypal philosophy. That is what this library is all about--*embracing the language, and providing conventions and tools to solve common problems*. Perhaps this will promote greater knowledge of the fundamentals that  many fail to understand.

This post is simply a reminder to myself about my intentions for the NI::JS library. The plan is to build it as I go along, solving problems in a modular way, and posting code reviews on this blog to describe why, and what, I am doing. Hopefully readers will jump in an suggest improvements to the code--I appreciate all suggestions!

So let us begin rocking with JavaScript!
