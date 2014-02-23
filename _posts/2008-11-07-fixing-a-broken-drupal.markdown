--- 
layout: post
title: Fixing A Broken Drupal
excerpt: ""
wordpress_id: 231
wordpress_url: http://www.mrnordstrom.com/?p=231
---
<p>Horrible mistakes sometimes give you new knowledge and insight. That&rsquo;s what happened when I managed to install Drupal 6 over existing Drupal 5 database tables. I had put a lot of effort into recent work that wasn't yet backed up. Left with corrupt Drupal tables, I got to work.</p>

<p>When I say the table is currupt, I mean that Drupal would not load at all. It was basically a hybrid between a version 6 and 5 system and it wouldn't work. After backing up the broken database, I dropped all the tables and set up a fresh install. But trying to import the content again, I noticed that the structure of the <code>system</code> tables didn't match.</p>

<p>What I ended up doing was to set up the system manually and importing the tables that actually did match. Luckily, all the content could be imported back. Drupal now loaded and ran fine until I wanted to add more nodes and instead got error messages like this one:</p>

<blockquote>user warning: Duplicate entry '3-3' for key 1 query: INSERT INTO node (nid, vid, title, type, uid, status, created, changed, comment, promote, sticky) VALUES (3, 3, 'x', 'x', 1, 1, 1225794232, 1225794345, 2, 1, 0) in /x/includes/database.mysql.inc on line x.</blockquote>

<p>The solution was in Drupal&rsquo;s own documentation. It was merely a matter of editing the values in the <code>sequences</code> table. After changing <code>node_nid</code> to highest node ID in the <code>node</code> table, it all went smoothly. The same goes for Views.</p>
