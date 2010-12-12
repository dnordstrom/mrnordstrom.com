--- 
layout: post
title: Clean Up After Drupal
excerpt: ""
wordpress_id: 728
wordpress_url: http://www.mrnordstrom.com/?p=728
---
<p>For the project tcataxi.nl, I was provided with pre-coded HTML markup and stylesheets. My job was to turn the static markup into a dynamic Drupal powered website with every piece of content editable. While I????????ve worked with Drupal many times before, I usually do the front-end myself and work with Drupal????????s extra layers, ID????????s and classes from the start.</p>
<!--more-->
<p>Since I was hired only to integrate the site with Drupal, I decided to challenge myself not to touch a single line of the provided CSS. This is fairly easy at least until you start outputting a lot of different views. A few extra layers don????????t compromise the styling and positioning of elements but when Drupal starts to add a whole bunch of them, the CSS breaks.</p>

<p>That????????s what happens when you separate front-end development from CMS integration. Just modifying the CSS a bit would be the simple solution but it would also lead to having to frequently boot up a couple of virtual machines for testing in Internet Explorer 6 to 8. It seemed more interesting to just strip away the (in this case) unnecessary div tags that Drupal and Views by default spits out.</p>

<p>Turns out this was even simpler than changing the CSS. All that needs to be done is to add some template files. Once you figure out which template files are needed to strip away the overdose of markup, it????????s a very straight-forward task. I decided to throw in quite a few of them to be on the safe side:</p>

<p>views-view.tpl.php</p>

<p>
[php]
&lt;?php if ($rows): ?&gt;
  &lt;?php print $rows; ?&gt;
&lt;?php elseif ($empty): ?&gt;
  &lt;?php print $empty; ?&gt;
&lt;?php endif; ?&gt;
[/php]
</p>

<p>views-view-unformatted.tpl.php<br>
views-view-nodes.tpl.php</p>

<p>
[php]
&lt;?php foreach ($rows as $id =&gt; $row): ?&gt;
  &lt;?php echo $row; ?&gt;
&lt;?php endforeach; ?&gt;
[/php]
</p>

<p>You get the point. After this, it????????s just a matter of creating the node templates that will be used to output the content types you????????re dealing with. For example, node-news.tpl.php could display the node, outputting whatever node variable or CCK field you have at your disposal. It????????s all very simple.</p>

<p>I thought I????????d write about this since there????????s not a lot of information out there about it. Maybe because it????????s common and easy, I don????????t know. I for one used to have the habit of iterating through the nodes in a view manually, directly in the view????????s template file using node_load() to get the data I needed. It sure sounds fun but having more template files that are loaded would of course be way more convenient in the end.</p>

<p>Conclusion????????Drupal creates piles of markup you don????????t want. Get rid of it and clean up your code, please.
