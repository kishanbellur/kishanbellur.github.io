# Website for The University of Cincinnati Lab for Interfacial dynamics (UCLID) led by Prof. Kishan Bellur

This website is based on a template for academic websites that was forked (then detached) by [Stuart Geiger](https://github.com/staeiou) from the [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/), which is © 2016 Michael Rose and released under the MIT License. See LICENSE.md. Select UCLID students that have edit access can update the website using the instructions below.

## Instructions to update _Talks_ 
1) Pull latest version from github
2) Update _markdowngenerator/talks.tsv_
3) Run: _python3 talks.py_ from the _markdowngenerators/_ folder. This generates or updates the markdown files in _talks/_
4) Run: _python3 talkmap.py_ from the base directory to update the talkmap
5) Push changes to github
6) Check that the website has updated correctly after it has been published - it normally takes a few mins.
7) Update changelog below

## Instructions to update _Publications_ 
1) Pull latest version from github
2) Ask Prof. Bellur for an updated version of _pubs.bib_
3) Replace file in _markdowngenerator/pubs.bib_
4) Run _python3 pubsfrombib.py_ from the_ markdowngenerators/_ fodler. This generates/updates the markdown files in _publications/_
5) [optional] Upload pdf to _files/_ and update the markdown file if needed.
6) Push changes to github
7) Check that the website has updated correctly after it has been published - it normally takes a few mins.
8) Update changelog below

## Changelog --


### Note: if you are using this repo and now get a notification about a security vulnerability, delete the Gemfile.lock file. 

