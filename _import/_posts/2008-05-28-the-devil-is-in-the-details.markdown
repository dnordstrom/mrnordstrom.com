--- 
layout: post
title: The Devil Is In The Details
excerpt: ""
wordpress_id: 110
wordpress_url: http://www.mrnordstrom.com/?p=110
---
Spent a couple of hours coding yesterday. Rarely have the time to these days but I decided to make the user authentication a bit more effective in my Slashblog project.

It used to be just a script, authorize.php, to check the password and set a session variable for verification. You know that basic stuff where you have to put the code to check that session variable on each page that is protected.

So what I did instead was to create a more centralized solution. The main blog class now as an array containing all pages that are protected, e.g. administrative pages. There is a function in the class Blog called <code>Authorize</code> that has two roles:

<ol>
	<li>If a password is supplied as argument, it checks if it is the right one and logs the user in, setting session variables.</li>
	<li>If no argument is supplied, it simply checks the current page is protected and if the user is logged in. If the user isn't, he/she is kicked back to the login page.</li>
</ol>

We use index.php to display all pages, including the administrative front-end. This means that if we call the <code>Authorize()</code> function at the beginning of that one, we have covered the authentication of the entire site.

Now, what I was really going to write about was the fact that I encountered some header problems. Spent an hour troubleshooting and couldn't find the damn bug. Later found out that I had two emtpy lines at the end of a class file that totally messed up the HTTP headers.

Just saying what you already know - pay ridiculous attention to details.
