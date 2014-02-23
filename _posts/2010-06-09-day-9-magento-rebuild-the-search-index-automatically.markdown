--- 
layout: post
title: "Day 9: Magento, Rebuilding The Search Index Automatically"
excerpt: ""
wordpress_id: 949
wordpress_url: http://www.mrnordstrom.com/?p=949
---
<p>Imagine my surprise when I read that Magento, an advanced ecommerce platform, doesn&rsquo;t rebuild the search index when product data has changed. A client of mine had to go to Index Management every day to keep the full text search updated, and that&rsquo;s not acceptable.</p>
<!--more-->
<p><em>This is blog post 9/30 for <a href="http://30daysofcreativity.com/">#30DaysOfCreativity</a></em>.
<p>So I googled around for a while to find out how we could go about coding a PHP script that did this. Once we have that, we can easily run it a couple of times per day using a simple <a href="http://en.wikipedia.org/wiki/Cron">cron-job</a>. I found one thread on the <a href="http://www.magentocommerce.com/boards/">Magento Forum</a> titled <a href="http://www.magentocommerce.com/boards/viewthread/45051/">&ldquo;Rebuild search index within code?&rdquo;</a>&mdash;exactly what we were looking for.</p>
<p>The credit goes to the user <a href="http://www.magentocommerce.com/boards/member/9069/">Daim</a> for this one, so feel free to thank him in the mentioned thread or a PM. As with most things Magento, the solution is fairly simple once you&rsquo;ve actually seen a working piece of code.</p>
<p>Here&rsquo;s the complete script that rebuilds the search index. I&rsquo;m merely copy &amp; pasting it from the thread for reference, changing the success and error notifications to something more proper:</p>
[php]
require 'app/Mage.php';

if (!Mage::isInstalled()) {
  echo &quot;Application is not installed yet, please complete install wizard first.&quot;;
  exit;
}

// Only for urls
// Don't remove this
$_SERVER['SCRIPT_NAME'] = str_replace(basename(__FILE__), 'index.php', $_SERVER['SCRIPT_NAME']);
$_SERVER['SCRIPT_FILENAME'] = str_replace(basename(__FILE__), 'index.php', $_SERVER['SCRIPT_FILENAME']);
Mage::app();
try {
  Mage::getSingleton('catalogsearch/fulltext')-&gt;rebuildIndex();
  echo &quot;Search index successfully rebuilt.&quot;;
}
catch (Mage_Core_Exception $e) {
  echo &quot;Failed to rebuild search index: &quot; . $e-&gt;getMessage();
}
catch (Exception $e) {
  echo &quot;Failed to rebuild the search index. Non-Magento exception thrown.&quot;;
}
[/php]
<p>The snippet that actually rebuilds the index is of course this one:</p>
[php]
Mage::getSingleton('catalogsearch/fulltext')-&gt;rebuildIndex();
[/php]
<p>This is running fine on Magento Community Edition 1.4.0.1. We&rsquo;ve set up a cron-job that rebuilds the index twice every day. I&rsquo;m guessing it will run equally well on a Magento 1.3 installation since the post was written in June 2009 and 1.4 had not been released back then.</p>
<p>So if you&rsquo;re running a Magento shop, I suggest you run this script or a similar one approximately as frequently as you do changes to your products. This will keep your full text search index up-to-date and your customers will be able to find what they&rsquo;re looking for.</p>
<h2>UPDATE:</h2>
<p>While it seems to run fine in Magento 1.4, there&rsquo;s a better way of doing it which is to simply run one of the shell-scripts that are provided in the /shell folder of your Magento root.</p>
[php]
php /var/www/vhosts/your_magento_site/htdocs/shell/indexer.php reindexall
[/php]
<p>Source: <a href="http://www.yireo.com/tutorials/magento/magento-administration/340-magento-14-cronjobs">Yireo.com</a></p>
