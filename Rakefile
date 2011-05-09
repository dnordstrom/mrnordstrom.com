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
title: "Tagged: #{tag}"
---
{% for post in site.tags.#{tag} %}
  <article>
    <header>
      <h1>
        <time datetime="{{ post.date }}" pubdate>{{ post.date | date_to_long_string }}</time>
        <a href="{{ post.url }}">{{ post.title }}</a>
      </h1>
      <div class="tags">
        {% for tag in post.tags %}
          <a href="#">{{ tag }}</a>
        {% endfor %}
      </div>
    </header>
  </article>
{% endfor %}
<article>
  <header>
    <h1>
      <time datetime="{{ post.date }}">For all posts&hellip;</time>
      <a href="/archive.html">&nbsp;&nbsp;&nbsp;&nbsp;see the archive</a>
    </h1>
  </header>
</article>
HTML

    FileUtils.mkdir_p("tags/#{tag}")
    File.open("tags/#{tag}/index.html", 'w+') do |file|
      file.puts html
    end
  end
  puts 'Done.'
end