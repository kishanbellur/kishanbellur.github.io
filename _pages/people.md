---
layout: archive
title: "Principal Investigator"
permalink: /people/
author_profile: false
redirect_from:
  - /resume
---

{% include base_path %}

{% assign PIpeople = site.people | where: "position", "Principal Investigator" %}
{% for post in PIpeople %}
    {% include archive-single-people.html %}
{% endfor %}

---

# PhD Students
{% assign PhDpeople = site.people | where: "position", "PhD Student" %}
{% for post in PhDpeople %}
    {% include archive-single-people.html %}
{% endfor %}  

---

# MS Students
{% assign MSpeople = site.people | where: "position", "MS Student" %}
{% for post in MSpeople %}
    {% include archive-single-people.html %}
{% endfor %}  

---

# BS Students
{% assign BSpeople = site.people | where: "position", "BS Student" %}
{% for post in BSpeople %}
    {% include archive-single-people.html %}
{% endfor %}  

---

# Alumni
{% assign AlumniPhDpeople = site.people | where: "position", "PhD Alum" %}
{% for post in AlumniPhDpeople %}
    {% include archive-single-people.html %}
{% endfor %}

{% assign AlumniMSpeople = site.people | where: "position", "MS Alum" %}
{% for post in AlumniMSpeople %}
    {% include archive-single-people.html %}
{% endfor %}

{% assign AlumniBSpeople = site.people | where: "position", "BS Alum" %}
{% for post in AlumniBSpeople %}
    {% include archive-single-people.html %}
{% endfor %}
