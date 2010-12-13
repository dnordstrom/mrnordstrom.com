--- 
layout: post
title: Table Rate Shipping in Magento
excerpt: ""
wordpress_id: 408
wordpress_url: http://www.mrnordstrom.com/?p=408
---
<p>Having problems with table rate shipping in Magento? Perhaps getting a little PHP notice saying ???????Notice: Undefined index: *&rsquo; I remember it being a bit tricky when I tried using it myself. In the end, it turned out to be quite easy once you figure out the fact that you <strong>always must</strong> specify a country when defining table rate shipping in Magento.</p>

<p>More details can be found on the <a href="http://www.magentocommerce.com/wiki/configuring_shipping_rates">Magento wiki</a>. To sum it up, you cannot use the ???????*??????? wildcard character when setting up your shipping rates. Instead, you&rsquo;ll have to specify a country as follows:</p>

[text]&quot;Country&quot;,&quot;Region/State&quot;,&quot;Zip/Postal Code&quot;,&quot;Weight (and above)&quot;,&quot;Shipping Price&quot;
US,*,*,10,100[/text]

<p>You should now have working table rate shipping. There is, however, <a href="http://www.magentocommerce.com/boards/viewthread/26325/#t91285">a thread</a> from January 2009 on the Magento forums saying that you can work around this by first importing your CSV as above, then changing the record in the ???????shipping_tablerate??????? database table, setting ???????dest_country_id??????? to 0.</p>

<p>I haven&rsquo;t tried this method myself but if it works for the forum poster, I suspect that it will also work for the rest of us. One would think that Magento would offer a more explanatory error message but I guess it&rsquo;s a young platform and it will come later on. Until then, Google is our very best friend for solving most Magento problems.</p>

<p><strong>Other useful tips for table rate shipping:</strong></p>

<ul>
	<li>To export an example CSV, go to System - Configuration - Shipping methods - Table rate, and make sure your are in the "Main website" scope.</li>
	<li>Edit the file using a plain text editor, such as Notepad on Windows or TextEdit on Mac. I personally use TextMate.</li>
	<li>Of course, take backups.</li>
</ul>
