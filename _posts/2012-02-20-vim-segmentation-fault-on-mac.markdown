---
layout: post
title: Vim Segmentation Fault On Mac
tags:
  - vim
  - mac
---

Ever used the Vim text editor on Mac? If you haven't, you have at least heard of it. It's an old, yet amazing and popular piece of software that compiles and runs on practically any OS. As you probably know, it can (and will) greatly increase the productivity of anything text-based you may need to do.

Besides the classical <a href="http://vim.org">Vim</a>, there's also a <a href="http://code.google.com/p/macvim/">MacVim</a> version for MacOS based on the GUI version of the application, <a href="http://vim.org">gVim</a>. It offers some conveniences such as Command-S saving, tabs, and a tad bit of a GUI. However, since I spend much of my time on the command line, I much prefer working with classical Vim in iTerm2--more about that another time.

Now, there have been a couple of different situations where I've occasionally gotten segmentation faults which killed the Vim process. A nasty problem when you use it as much as I do, especially if you have disabled swap files. The good thing is that these segfaults are easily solved.

## Situation 1

_**Problem:** Segmentation fault in Vim after upgrading your OS._

The first time I came across this issue was when I started using Vim, which was after my upgrade to MacOS X Lion. Back then I was simply using Terminal and the pre-installed Vim of MacOS, and I kept getting segmentation faults intermittently for no apparent reason--sometimes when saving files, sometimes when opening them.

It turns out the segmentation faults occured simply because Vim was compiled for Snow Leopard; this is another one we can stack on the pile of reasons why we should always do clean installs of MacOS. The solution is as simple as the problem. Just recompile Vim and it will work happily ever after.

_**Solution:** Recompile Vim, or install it with Homebrew._

{% highlight sh %}

# Download Vim 7.3 (latest at the time of writing)
wget ftp://ftp.vim.org/pub/vim/unix/vim-7.3.tar.bz2

# Unpack the archive
tar jxvf vim-7.3.tar.bz2

cd vim-7.3

# Configure (with Ruby support for plugins)
./configure --prefix=/usr/local --enable-rubyinterp --enable-gui=no

# Build and install
make
sudo make install

# Remove the archive
rm -rf vim-7.3.tar.bz2 vim-7.3

# Good to go!

{% endhighlight %}

## Situation 2

_**Problem:** Segmentation fault when using Ruby plugin._

The second time I got these segmentation faults was when I had installed the Command-T plugin which is written in Ruby. First of all, for the plugin to work it needs Vim to be compiled with Ruby support, which we did above. That however wasn't the problem that caused the segfaults.

The problem was that the plugin was built and installed with Ruby 1.9.3 which I had installed with RVM. The solution is rather simple this time as well; you just need to use Ruby 1.8.7 as you build the plugin.

_**Solution:** Use Ruby 1.8.7 when building the plugin._

{% highlight sh %}

# Switch to system default Ruby. You can also install and
# switch to Ruby 1.8.7 using `rvm (install|use) 1.8.7`.
rvm use system

# We'll assume here that we're dealing with the Command-T
# plugin and you manage it using Pathogen. If you're not
# using Pathogen, `cd` to ~/.vim/ruby/command-t instead.
cd ~/.vim/bundle/command-t/ruby/command-t

# Configure
ruby extconf.rb

# Install
rake make

{% endhighlight %}

## Conslusion

Vim is a truly amazing piece of software and it has been since 1991, or even since 1976 when Vi was first created. If you spend a reasonable amount of time typing, I recommend that you try if for a week or two. It will be frustrating at first but when you get used to the keyboard mappings and the many great plugins and configurations, I guarantee you, you will be hooked!
