--- 
layout: post
title: Display CCK Fields In Your Page.tpl.php
excerpt: ""
wordpress_id: 122
wordpress_url: http://www.mrnordstrom.com/?p=122
---
<p>Drupal time!</p>

<p>If you want to use your CCK fields somewhere outside your node, you may find yourself wanting to put it somewhere in page.tpl.php. Now that it isn't at all hard to do - just a little different.</p>

<p>When we're using a CCK field in node.tpl.php or any of your node templates, we might do something like this:</p>

<p>[php]print $field_your_field[0]['view'];[/php]</p>

<p>Or whatever you may use, there are variations. Now, this doesn't quite work out as we want to in page.tpl.php. If we want to print a CCK field in page.tpl.php, we have to make use of the $node variable like this:</p>

<p>[php]print $node-&gt;field_your_field[0]['view'];[/php]</p>

<p>Simple, eh? Very logical too. It's just a little different, that's all. This works in Drupal 5.x, assuming of course that you're trying to print out the CCK field on the page containing the node to which it belongs. Otherwise you'd probably have to load the node manually.</p>


