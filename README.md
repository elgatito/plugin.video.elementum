
[![Build Status](https://gitlab.com/elgatito/plugin.video.elementum/badges/master/pipeline.svg?ignore_skipped=true)](https://gitlab.com/elgatito/plugin.video.elementum/-/pipelines)
[![Join the chat at https://gitter.im/ElementumApp/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ElementumApp/Lobby)


Support
----------
### Development of *plugin.video.elementum* is stopped! 
- Do not expect any support, help and other things like that.
- Source is open, so you can fork everything.


What it is
----------
Elementum is a torrent finding and streaming engine. It doesn't go on torrent websites for legal reasons. However, it calls specially crafted add-ons (called providers) that are installed separately. They are normal Kodi add-ons, and thus can be installed/updated/distributed just like any other add-on.

This project is a fork of Quasar, created by [scakemyer](https://github.com/scakemyer/plugin.video.quasar), which came from the well known, but no longer maintained Pulsar project from [steeve](https://github.com/steeve/plugin.video.pulsar).
Thanks, guys, for your titanic work!

Supported platforms
-------------------
- Windows 32/64 bits
- Linux 32/64 bits (starting from Ubuntu 15.04)
- Linux ARM (armv6, armv7, armv8/arm64)
- macOS 64 bits (also can be run in arm64 macOS)
- Android ARM (for 4.4.x use [0.1.41](https://github.com/elgatito/plugin.video.elementum/releases/tag/v0.1.41), for 5+ use the latest build), x86, x64, ARM, ARM64
- For unsupported OS you can run Elementum in client-server mode (e.g. via [Docker](https://github.com/ElementumOrg/elementum-docker) or Linux daemon or Windows service).

Minimum supported Kodi version: 16 (Jarvis)

Download
--------
See the [Releases](http://elementum.surge.sh/) page. **Do NOT use the `Download ZIP` button on this page.**


Installation
------------
- Go to Settings > Service settings > Control and **enable both Application control options**
- Restart Kodi if one or both options were not enabled
- Install Elementum like any other add-on

Build
-----

`plugin.video.elementum` is distributed as a `zip` file, that includes:
- [plugin.video.elementum](https://github.com/elgatito/plugin.video.elementum) - responsible for starting Elementum application and connecting application to Kodi Python API.
- [elementum](https://github.com/elgatito/elementum) - The Elementum daemon itself, built on top of the cross-compiled libtorrent-go
- [libtorrent-go](https://github.com/ElementumOrg/libtorrent-go) - The libtorrent library with Go bindings, built using cross-compiler
- [cross-compiler](https://github.com/ElementumOrg/cross-compiler) - Builds the base images to, you guessed it, cross-compile Elementum

To compile and make your own `zip` file, follow these steps:

In [elementum](https://github.com/elgatito/elementum) folder:
```sh
# To pull all docker images, that contain all required compilers and libraries and come from https://github.com/ElementumOrg/libtorrent-go project
make pull-all

# To compile code for specific platform
make android-arm64-shared # Make shared library for android-arm64 platform 
make android-x86 # Make binary for android-arm64 platform

# To compile for all platforms
make all
```

It will compile binary files and place into `/build` folder.

In [plugin.video.elementum](https://github.com/elgatito/plugin.video.elementum) folder:

```sh

# Run helper script that is taking existing binaries and Python part and make a zip file that can be used for installation in Kodi

# To get help on existing options
./bundle.sh --help 

# To use existing binaries, use only specific platform, add custom suffix into zip file and place zip file on a custom folder
./bundle.sh --binaries=/path/to/elementum/build --platform=android_arm64 --suffix=custom_suffix_to_add_into_zip --target=/destination/folder/

# To use existing binaries, collect all platforms and make zip file in current folder
./bundle.sh --binaries=/path/to/elementum/build 

```

Script will collect current `plugin.video.elementum` files (that you have on the disk) and binaries, that are stored in `/build` folder.

Created zip file can be installed on top of installed addon. Make sure to restart Kodi after installation to make sure you run installed code, and not the mix between old and new.


#### Build status of each project
| elementum daemon |
| ---------------- |
| [![Build Status](https://travis-ci.org/elgatito/elementum.svg?branch=master)](https://travis-ci.org/elgatito/elementum) |

For Developers' guide, please, refer to [Elementum website](http://elementum.surge.sh)

Release 
-------

Release is done by running `release.sh` script, that collects dependencies and makes zip files, and does release upload if we are on the tag.


How it works
------------
Elementum is a torrent finding and streaming engine. **It doesn't go on torrent websites for legal reasons**. It calls specially crafted add-ons (called **providers**) that are installed separately. They are normal Kodi add-ons, and thus can be installed/updated/distributed just like any other add-on.

Elementum is centered around media: it browses media from [TheMovieDB](https://www.themoviedb.org/) and [Trakt.tv](https://trakt.tv/).
And so, when you decide you want to watch a media (i.e. given an TMDB ID), here's what Elementum does:

- Enumerate the installed providers
- Call each provider to find the media you want to watch (in parallel)
- Each provider returns a list of BT links they found
- Collects and de-duplicates all the links
- Goes on the BitTorrent network to find out the number of seeds and peers in real time (i.e. not provided by the provider)
- Finds out of which quality are the different links (thanks to their name)
- Ranks the links by quality and availability (Elementum privileges quality over availability, but it's not dumb. However, you can get a full list to choose from manually if you want, or disable 'Choose stream automatically' to always choose manually)
- Sends the chosen link to the BitTorrent streaming engine

All of this is done in less than 10s depending on your platform and timeout settings. Elementum is around 95% Go, and thus, it's *fast*. Very fast, actually.

The BitTorrent streaming engine is very resilient (or at least it's designed to be). It's built on top of [libtorrent](https://github.com/arvidn/libtorrent) package.


Providers
---------
As said before, Elementum **relies on providers to find streams**. Providers are easy to write, and can be as little as ~20 lines of Python code. As they are normal Kodi add-ons, which can have their own configuration (although it is not recommended because it complicates things).

Please note that for legal reasons, **I won't discuss, develop nor distribute any providers connecting to illegal sources**. So there is no need to ask me.
While I can partake in general discussions regarding provider development, **I won't do so for illegal sources specific problems**.


FAQ
---
##### I can't code. How can I help?
Spread the word. Talk about it with your friends, show them, make videos, tutorials. Talk about it on social networks, blogs, etc...

##### The plugin doesn't work, what can I do?
Please search currently [open and closed issues](https://github.com/elgatito/plugin.video.elgatito/issues) to see if it has already been reported and/or fixed. If not then add a new issue with a short but descriptive title, a detailed description and of course a link to the logs. If you don't know how to do that, just follow the guide at: [http://kodi.wiki/view/Log_file/Easy](http://kodi.wiki/view/Log_file/Easy). If you actually went through the logs and know the relevant part, you can instead paste that, as long as it's shorter than a hundred lines or so, and please enclose it in triple back-quotes for readability.

##### Can I seek in a video?
Yes, but it can fail.

##### What about seeding?
When watching a torrent, **you will be seeding while you watch the stream**.

##### Does it download the whole file? Do I need the space? Is it ever deleted?
Yes, yes and yes.

##### Can I keep the file after watching it?
Yes, change it in the add-on settings.

##### Can I set it to download directly to my NAS?
Yes, but **you need to mount your NAS via the OS, not via Kodi**.

##### Provider X is blocked in my country/ISP, how can I set another domain?
Sorry, I won't comment of specific providers.


Screenshots
-----------
![](https://raw.githubusercontent.com/elgatito/plugin.video.elementum/master/resources/screenshots/home.jpg)

![](https://raw.githubusercontent.com/elgatito/plugin.video.elementum/master/resources/screenshots/movies.jpg)

![](https://raw.githubusercontent.com/elgatito/plugin.video.elementum/master/resources/screenshots/webui.png)
