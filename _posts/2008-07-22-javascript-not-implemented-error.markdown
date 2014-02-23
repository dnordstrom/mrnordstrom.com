--- 
layout: post
title: Javascript "Not Implemented" Error
excerpt: ""
wordpress_id: 120
wordpress_url: http://www.mrnordstrom.com/?p=120
---
Yeah, that's what I had to deal with today. The story goes; I booted up Windows XP on my virtual machine to see if everything was running smoothly in Internet Explorer. Unfortunately, things didn't work as good today as they did yesterday.

Apparently my neat little menu decided to mess itself up (because I'm sure it wasn't me). For some reason there was this tiny little warning sign in Internet Explorer 7 saying "script error". Specifically, <em>something</em> in <em>some Javascript file</em> was "not implemented". Funny, since it works in <em>every</em> other browser I've got.

But that's the kind of crap we have to get used to. Do we really? Maybe but that's besides the point. The point is that we fix it and get on with our lifes. So that's what I did this morning.

After Googling, it seemed like most people had this problem when using a function - addLoadEvent() was the most common name - to append other functions to document.onload. However, that was not the case for me.

This is where it went wrong:

<code>if( foo = $(this).bar() ) { foo.doStuff(); }</code>

IE didn't like that at all. What we need to do is this:

<code>var foo = $(this).bar();
if(foo) { foo.doStuff(); }</code>

<strong>Lesson learned</strong> - don't declare or define variables in if statements when coding Javascript.

<em>This little change fixed the issue for me but if you've got more info or another solution, please let me know, all right? :)</em>
