---
layout: archive
title: "Personnel"
permalink: /personnel/
author_profile: false
redirect_from:
  - /resume
---


{% include base_path %}

<ul>{% for post in site.personnel reversed %}
    {% include archive-single.html %}
  {% endfor %}</ul>