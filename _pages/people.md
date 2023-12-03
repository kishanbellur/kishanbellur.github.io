---
layout: archive
title: "People"
permalink: /people/
author_profile: false
redirect_from:
  - /resume
---

{% include base_path %}

{% assign sortedpeople = site.people | sort: 'order' %}

{% for post in sortedpeople %}
    {% include archive-single.html %}
  {% endfor %}

