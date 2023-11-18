---
layout: archive
title: "Personnel"
permalink: /personnel/
author_profile: false
redirect_from:
  - /resume
---
{% assign sortedpersonnel = site.personnel | sort: 'order' %}

{% include base_path %}

{% for post in site.sortedpersonnel %}
    {% include archive-single.html %}
  {% endfor %}
<br>
<!---
The PI leads a multi-disciplinary group of students:
# Graduate students
  <ul>{% for post in site.personnel-phd reversed %}
    {% include archive-single.html %}
  {% endfor %}</ul>
---> 

# Prior students
