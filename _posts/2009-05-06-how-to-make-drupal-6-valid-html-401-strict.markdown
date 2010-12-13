--- 
layout: post
title: How to Make Drupal 6 Valid HTML 4.01 Strict
excerpt: ""
wordpress_id: 299
wordpress_url: http://www.mrnordstrom.com/?p=299
---
<p>
<em><strong>Note:</strong> This article is discussing Drupal version 6.11.</em>
</p>

<p>Drupal 6 is built to validate as XHTML but I&rsquo;ve lately been leaning towards HTML standards. I also enjoy making things &ndash; Drupal in particular &ndash; do what I want them to do, so I just had to see if I could get Drupal to validate as HTML 4.01 Strict.</p>

<p>Since Drupal has a lot of theme override functions, I naturally presumed that it would be a simple task and it was. Well, except for the fact that Drupal core spits out a content-type meta short-tag in the &lt;head&gt; section of the website. But let&rsquo;s start from the beginning.</p>

<p>The theme <a href="http://drupal.org/project/basic">basic</a> from <a href="http://raincitystudios.com/">Raincity Studios</a> is a starting point for all my projects and I dearly recommend it. The problem I had here was mainly in the &lt;head&gt; section, where Drupal outputs all the tags as short-tags, ending with &ldquo;/&gt;&rdquo;. These tags are being printed out with the help of the PHP variables $head and $styles.</p>

<p>So basically, all we need to do is put the following two lines in into the theme_preprocess_page() function of our template.php file, to remove the slash from the end of the tags.</p>

[php]
$vars['head'] = str_replace(&quot; /&gt;&quot;, &quot;&gt;&quot;, $vars['head']);
$vars['styles'] = str_replace(&quot; /&gt;&quot;, &quot;&gt;&quot;, $vars['styles']);
[/php]

<p>Remaining is the content-type problem mentioned above. It turns out there are two Drupal core functions, called <a href="http://api.drupal.org/api/function/drupal_get_html_head/6">drupal_get_html_head()</a> and <a href="http://api.drupal.org/api/function/drupal_final_markup/6">drupal_final_markup()</a>, in the file /includes/common.inc, which make sure a content-type meta tag is prepended to the &lt;head&gt; section.</p>

<p>The code looks like this and as far as I can tell, there&rsquo;s no other way of getting rid of this than to do changes to this file.</p>

[php]
function drupal_get_html_head() {
&rsquo;$output = &quot;&lt;meta http-equiv=\&quot;Content-Type\&quot; content=\&quot;text/html; charset=utf-8\&quot; /&gt;\n&quot;;
&rsquo;return $output . drupal_set_html_head();
}

function drupal_final_markup($content) {
&rsquo;// Make sure that the charset is always specified as the first element of the
&rsquo;// head region to prevent encoding-based attacks.
&rsquo;return preg_replace('/&lt;head[^&gt;]*&gt;/i', &quot;\$0\n&lt;meta http-equiv=\&quot;Content-Type\&quot; content=\&quot;text/html; charset=utf-8\&quot; /&gt;&quot;, $content, 1);
}
[/php]

<p>So just removing the slash from the string in that function will solve the problem. Changing core code is a bad, bad thing but at least it&rsquo;s a very minor change and we can still update the site with the only problem being that it again may not validate. 

<p>After doing this I had no other problems than contributed modules sometimes outputting XHTML, and very rightfully so since Drupal is based on it. This can often be solved with theme functions. ImageCache, for example, is used by calling a theme function so I Googled it&rsquo;s API, found the original code and put the following in my template.php...</p>

[php]
function mytheme_valid_imagecache($namespace, $path, $alt = '', $title = '', $attributes = NULL) {
&rsquo;if (is_null($attributes)) {
&rsquo;&rsquo;$attributes['class'] = 'imagecache imagecache-'. $namespace;
&rsquo;} 
&rsquo;$attributes = drupal_attributes($attributes);
&rsquo;$imagecache_url = imagecache_create_url($namespace, $path);
&rsquo;return '&lt;img src=&quot;'. $imagecache_url .'&quot; alt=&quot;'. check_plain($alt) .'&quot; title=&quot;'. check_plain($title) .'&quot; '. $attributes .'&gt;';
}
[/php]

<p>...which is an exact replica of the original code but without the slash in the &lt;img&gt; tag. Now I just call this function instead of the ImageCache theme function, and I get valid HTML 4.01 Strict.</p>

<p>I wouldn&rsquo;t recommend this at all if you&rsquo;re using more than just a few modules. If you&rsquo;re using more modules, a lot of ugly changes may have to be made &ndash; changes that may also break something if you ever decide to update the site. However, it was a nice experiment for this particular project and I enjoy seeing the wonderful green color when I run the site through the validator.

<p>Maybe time to write a HTMLify module.</p>
