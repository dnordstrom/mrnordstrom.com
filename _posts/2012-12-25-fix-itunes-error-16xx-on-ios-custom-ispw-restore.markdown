---
title: Fix iTunes Error 16xx on iOS Custom IPSW Restore
layout: post
type: quickie
tags:
  - fix
  - ios
  - itunes
---

## The problem

Attempting to restore your iPhone, or other iOS device, using a custom IPSW firmware file will cause iTunes to choke on an error in the 16xx range, such as error 1600 or 1604. Most people are experiencing this issue while performing a jailbreak of their iPhone or iPod, which is the main reason why you would be restoring your device using a custom firmware file. I was installing [whited00r 6](http://whited00r.com/) to bring a more productive experience to my old iPhone 3G, since I can't officially update it past iOS 4.3.2, when I suddenly bricked it.

<figure class="bordered rounded"><img src="/img/posts/itunes_1600_error.png" alt="Fix iTunes 1600 Error"><figcaption>Fix your iTunes 16xx error on restore.</figcaption></figure>

## The solution

The problem behind these error messages is that, when restoring from a custom IPSW file, the device needs to be put into a modified DFU mode, which a jailbreaking tool would normally do while guiding you through the process. Luckily, Redsn0w is a tool that helps you do this quickly and easily so you can get back to restoring your device using iTunes.

If you are getting the error message without attempting to restore your device using a custom firmware file, I suggest you first try the troubleshooting instructions on [Apple's website](http://support.apple.com/kb/TS3694). Otherwise follow the instructions below to fix the issue.

The necessary software is available for both MacOS X and Windows.

1. Download [Redsn0w](http://www.redsn0w.us/2010/03/download-direct-links-jailbreak-guides.html).
2. Download the [official IPSW file](http://jaxov.com/2011/04/download-ios-4-3-2-stock-ipsw-for-iphone-ipod-touch-ipad-direct-links/) for your device and firmware, e.g. 4.3.2.
3. Launch Redsn0w, click "Browse", and open the official firmware file you just downloaded.
4. When prompted to select your options, tick *only* "Just enter pwned DFU mode right now".
5. Follow the instructions. Be ready to hold down the power button when prompted.
6. Once Redsn0w is done putting your device in DFU mode, relaunch iTunes and the custom firmware restore will work.

<figure class="bordered rounded"><a href="http://www.redsn0w.us/2010/03/download-direct-links-jailbreak-guides.html"><img src="/img/posts/redsn0w.jpg" alt="Redsn0w for Mac will solve your iTunes 16xx error"></a><figcaption>Redsn0w for Mac solves your iTunes 16xx error.</figcaption></figure>

Easy as pie.
