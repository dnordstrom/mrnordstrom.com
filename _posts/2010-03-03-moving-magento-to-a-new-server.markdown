--- 
layout: post
title: Moving Magento To A New Server
excerpt: ""
wordpress_id: 752
wordpress_url: http://www.mrnordstrom.com/?p=752
---
<p>Magento requires a lot from both your server and you. Upgrading to another hosting account or just moving Magento to a new location could be a time-consuming task and there are a few things you should be aware of. Having some information at hand could reduce potential downtime and make the process quicker and more painless.</p>
<!--more-->
<h3>Moving the folders</h3>

<p>If you don&rsquo;t want to move the entire Magento folder to its cozy new home, make sure to move the media, app/etc and your theme folders. Remember, there is both a skin folder and a design folder for your theme and you most definitely need them both.</p>

<h3>MySQL database dump</h3>

<p>Make a database dump of the old database and import it to the new location. In the core_config_data table, change the values of web/secure/base_url and web/unsecure/base_url to reflect any changes in the domain. If you&rsquo;re moving Magento into a subdirectory, also change the RewriteBase in the root folder .htaccess file.</p>

<p>The settings in your app/etc/local.xml file should be changed to let Magento connect to your new database.</p>

<h3>Updating the paths</h3>

<p>Clear the var/cache folder when moving the site to make sure no cache is left from the old one. Remove or rename the downloader/pearlib/pear.ini file to make sure the Magento Connect downloader upgrades the path it uses. Forget this and you&rsquo;ll be scratching your head the next time you&rsquo;re installing an extension.</p>

<h3>The right permissions</h3>

<p>Simply make the app/etc, var and media folders writeable by the server.</p>

<h3>Updating Magento</h3>

<p>Why not update Magento to the latest version while you are still poking around? You can use the Magento Connect downloader or if you prefer (or can&rsquo;t access the site via a browser yet) you can run the following commands on your server:</p>

<p>./pear mage-setup .
./pear install magento-core/Mage_All_Latest</p>

<p>That should also do any required updates on the database. If you ever import a Magento 1.3 database to a Magento 1.4 installation, run the commands again to make sure the structure is correct.</p>

<h3>Potential problem: Some images are not showing</h3>

<p>You have transferred all the images to the new location and cleared the cache but only some of them show up when browsing the catalog on the front-end. This can occur when Magento can&rsquo;t allocate enough RAM when loading the images. Increase the memory_limit in php.ini and restart the Apache service.</p>

<h3>Potential problem: Products are missing</h3>

<p>If some products are missing or the site seems different from the old one, reindex the catalog.</p>

<h3>Potential problem: Prices always display excluding taxes</h3>

<p>This can occur when upgrading to Magento 1.4. You&rsquo;ve set the configuration to include taxes in all the prices but they still display without taxes on the front-end. What you need to do is to set the Origin on the Shipping Options page in the site configuration.</p>

<h3>More resources</h3>

<p>What I&rsquo;ve mentioned here is only the bare basics of moving Magento to a new server. Once you hit a problem, that&rsquo;s when things become a lot more interesting. While Google is your best friend, below is a list of a few of the resources I&rsquo;ve personally found helpful.</p>

<p><a href="http://www.magentocommerce.com/wiki/groups/227/moving_magento_to_another_server">Moving Magento To Another Server</a><br />
<a href="http://activecodeline.com/moving-magento-site-from-development-to-live-server">I Actually Am Getting Orders Now on 1.4</a><br />
<a href="http://www.sonassi.com/knowledge-base/magento-1-4-install-errors/comment-page-1/">Magento 1.4 Install Errors</a><br />
<a href="http://www.magentocommerce.com/boards/viewthread/27272/">Moving Magento [...] (potential problems)</a><br />
<a href="http://activecodeline.com/issues-with-moving-magento-from-one-server-to-another">Issues With Moving Magento</a><br />
<a href="http://activecodeline.com/moving-magento-site-from-development-to-live-server">Moving Magento Site From Development To Live</a></p>
