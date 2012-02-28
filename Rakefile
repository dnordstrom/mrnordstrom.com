desc 'Generate tags pages'
task :tags do
  puts "Generating tags..."
  require 'rubygems'
  require 'jekyll'
  include Jekyll::Filters

  options = Jekyll.configuration({})
  site = Jekyll::Site.new(options)
  site.read_posts('')

  # Remove tags directory before regenerating
  FileUtils.rm_rf("tags")

  site.tags.sort.each do |tag, posts|
    html = <<-HTML
---
layout: base
title: All posts
---
<div class="row">
  <aside class="span3">
    <div class="well">
      <ul class="nav nav-list">
        <li>
          <p>
            <div class="btn-group">
              <a href="mailto:d@nintera.com" class="btn btn-small"><i class="icon-envelope"></i>Email</a>
              <a href="skype:d.nintera?chat" class="btn btn-small"><i class="icon-comment"></i>Skype</a>
              <a href="http://twitter.com/mrnordstrom" class="btn btn-small"><i class="icon-user"></i>Twitter</a>
            </div>
          </p>
        </li>
        
        <li class="contact nav-header">Contact</li>
        <li class="contact"><a href="mailto:d@nintera.com"><i class="icon-envelope"></i>Email</a></li>
        <li class="contact"><a href="skype:d.nintera?chat"><i class="icon-comment"></i>Skype</a></li>
        <li class="contact"><a href="http://twitter.com/mrnordstrom"><i class="icon-user"></i>Twitter</a></li>

        <li class="nav-header">Articles</li>
        <li><a href="archive.html"><i class="icon-folder-close"></i>Archive</a></li>
        <li><a href="http://feeds.feedburner.com/mrnordstromcom"><i class="icon-bookmark"></i>RSS</a></li>

        <li class="nav-header">All tags</li>
        {% include tags.html %}
      </ul>
    </div>
  </aside>

  <section class="span8 offset1">
    {% for post in site.tags.#{tag} %}
      <article>
        <h1>
          <small>{{ post.date | date_to_long_string }}</small>
          <a href="{{ post.url }}">{{ post.title }}</a>
        </h1>
        <header class="tags">
          {% for tag in post.tags %}
            <a href="/tags/{{ tag }}" class="label label-success">{{ tag }}</a>
          {% endfor %}
        </header>
      </article>
    {% endfor %}
  </section>
</div>
HTML

    FileUtils.mkdir_p("tags/#{tag}")
    File.open("tags/#{tag}/index.html", 'w+') do |file|
      file.puts html
    end
  end

  tags = {}
  site.tags.each do |tag, posts|
    tags[tag] = posts.length
  end

  tags = tags.sort {|a,b| a[1] <=> b[1]}.reverse

  File.open("_includes/top_tags.html", 'w+') do |file|
    counter = 0
    tags.each do |tag, count|
      file.puts "<li><a href=\"/tags/#{tag}\"><i class=\"icon-tag\"></i>#{tag} (#{count})</a></li>"
      break if (counter += 1) >= 10
    end
  end

  File.open("_includes/tags.html", 'w+') do |file|
    tags.each do |tag, count|
      file.puts "<li><a href=\"/tags/#{tag}\"><i class=\"icon-tag\"></i>#{tag} (#{count})</a></li>"
    end
  end


  puts 'Done.'
end
