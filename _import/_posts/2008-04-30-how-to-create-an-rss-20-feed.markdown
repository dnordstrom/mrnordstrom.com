--- 
layout: post
title: How To Create An RSS 2.0 Feed
excerpt: ""
wordpress_id: 108
wordpress_url: http://www.mrnordstrom.com/?p=108
---
<p>I'm lacking in work samples so I spent the last few days of my vacation coding. Since I enjoy blogging, I decided to create a light-weight and very simplistic blogging platform. It's called <a href="http://dev.slashblogger.com/" target="_blank">Slashblog</a> and you can look at the code so far <a title="Slashblog Documentation" href="http://doc.slashblogger.com/" target="_blank">here</a>.</p>

<p>Every blog needs an RSS feed. The fact that I have no idea of how to create one makes it a pleasant task. Hopefully, it'll also be an educational experience that I can share with you.</p>

<p>The RSS 2.0 specification was released in 2003 so there is plenty of information around. What I already know is that RSS feeds are basically XML. Since my application already stores posts as XML, my initial thought was; why not make my XML fit the RSS format?</p>

<pre lang="XML">
<?xml version="1.0"?>
<rss version="2.0">
    <channel>
        <title>Blog Title</title>
        <link>http://www.linktosomeblog.com/</link>
        <description>This is the description of some kind of blog, probably.</description>
        <item>
            <title>A Post Title</title>
            <link>http://www.linktosomeblog.com/thepost</link>
            <description>This could be an excerpt from the blog post or it could be the entire content.</description>
            <pubDate>Tue, 29 April 2008 08:56:02 GMT</pubDate>
    </item>
    </channel>
</rss>
</pre>

</p>A simple RSS 2.0 structure. The <code>title</code>, <code>link</code> and <code>description</code> elements of <code>channel</code> are required. We have a fixed set of elements to work with in <code>item</code>, none of which are actually required but these are the ones I'll be using. Did I decide to use this format to store my posts?</p>

<p>No. The fact is that it would be a blow to the scalability of my application. RSS can be extended to support elements outside its specification but only with the use of namespaces. Besides from XML, the application can also store data in flatfiles and I'll probably add support for MySQL.</p>

<p>Using namespaces would be messy as the XML element names would differ from any SQL fields names. This can be fixed but it would require more code to process. We would also be responsible for keeping the XML file constantly up to date, every time we publish, delete or edit a post. It makes much more sense to have a function print the posts as RSS on demand.</p>

<p>I ended up with a method of the class Blog called <code>PrintRSS()</code>. My code may look a bit odd to you since it's object-oriented but hopefully it still makes sense.</p>

<pre lang="PHP">
public function PrintRSS()
{
    if(!$this->PostsLoaded()) // If no posts are loaded...
        $this->LoadPosts(); // ...then load them now.

    // Compose all sections of the RSS data.
    $header = '<?xml version="1.0"?>' . PHP_EOL . '<rss version="2.0">' . PHP_EOL . '<channel>' . PHP_EOL;
    $header .= '<title>' . $this->GetSetting("TITLE") . '</title>' . PHP_EOL;
    $header .= '<description>' . $this->GetSetting("DESCRIPTION") . '</description>' . PHP_EOL;
    $header .= '<link>' . $this->GetSetting("URL") . '</link>' . PHP_EOL;
    $items = "";
    foreach($this->posts as $post)
    {
        $items .= '<item>' . PHP_EOL;
        $items .= '<title>' . $post->GetTitle() . '</title>' . PHP_EOL;
        $items .= '<description>' . $post->GetContent() . '</description>' . PHP_EOL;
        $items .= '<pubDate>' . $post->GetDate() . '</pubDate>' . PHP_EOL;
        $items .= '<link>' . $this->GetSetting("URL") . 'index.php?post=' . $post->GetID() . '</link>' . PHP_EOL;
        $items .= '</item>' . PHP_EOL;
    }
    $footer = '</channel>' . PHP_EOL . '</rss>';
         
    echo $header . $items . $footer; // Write it all to file.
}
</pre>

<p>Now we just need a file that loads all of my posts and actually calls the method to display the RSS. Short and sweet, as follows.</p>

<pre lang="php">
<?php
    require_once 'config.php';
    
    $blog = new Blog();
	
    $blog->LoadPosts();
    $blog->PrintRSS();
?>
</pre>

<p>That's it, works perfectly. What we have is a dynamically created, RSS formatted XML file. It's available at <a href="http://dev.slashblogger.com/rss.php" target="_blank">dev.slashblogger.com/rss.php</a> for now and I've tried it out in Google Reader. To be honest, I expected it to be more advanced than this. But the job is done.</p>

<h3>Resources</h3>
<a href="http://www-128.ibm.com/developerworks/xml/library/x-phprss/" target="_blank">PHP and RSS: Getting it together</a><br />
<a href="http://en.wikipedia.org/wiki/RSS" target="_blank">RSS at Wikipedia</a><br />
<a href="http://cyber.law.harvard.edu/rss/rss.html" target="_blank">RSS 2.0 Specification</a><br />
