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
title: Posts tagged #{tag}
---
<div class="row">
  <section class="span8 offset2">
    {% for post in site.tags.#{tag} %}
      <article>
        <h1>
          <small>{{ post.date | date_to_long_string }}</small>
          <a href="{{ post.url }}">{{ post.title }}</a>
        </h1>
      </article>
    {% endfor %}
    <article class="archive">
      <h1><a href="/tags.html">Back to tags</a></h1>
    </article>
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

  File.open("tags.html", 'w+') do |file|
    file.puts "---\nlayout: base\ntitle: Tags\n---\n"
    file.puts '<div class="row"><section class="span8 offset2">'

    tags.each do |tag, count|
      file.puts "<article><h1><small>#{count} #{count == 1 ? "post" : "posts"}</small><a href=\"/tags/#{tag}\">#{tag}</a></h1></article>"
    end
  end


  puts 'Done.'
end
