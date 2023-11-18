---
layout: archive
title: "Personnel"
permalink: /personnel/
author_profile: false
redirect_from:
  - /resume
---

{% include base_path %}

{% assign sortedpersonnel = site.personnel | sort: 'order' %}

{% for post in sortedpersonnel %}
    {% include archive-single.html %}
    <br>
  {% endfor %}

