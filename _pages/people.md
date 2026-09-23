---
layout: archive
title: "Principal Investigator"
permalink: /people/
author_profile: false
redirect_from:
  - /resume
---

{% include base_path %}

{% assign PIpeople = site.people | where: "position", "Principal Investigator" | sort: "order", "last" %}
{% for post in PIpeople %}
    {% include archive-single-people.html %}
{% endfor %}

---

# PhD Students
{% assign PhDpeople = site.people | where: "position", "PhD Student" | sort: "order", "last" %}
{% for post in PhDpeople %}
    {% include archive-single-people.html %}
{% endfor %}  

---

# MS Students
{% assign MSpeople = site.people | where: "position", "MS Student" | sort: "order", "last" %}
{% for post in MSpeople %}
    {% include archive-single-people.html %}
{% endfor %}  

---

# BS Students
{% assign BSpeople = site.people | where: "position", "BS Student" | sort: "order", "last" %}
{% for post in BSpeople %}
    {% include archive-single-people.html %}
{% endfor %}  

---

# Alumni
{% assign AlumniPhDpeople = site.people | where: "position", "PhD Alum" | sort: "order", "last" %}
{% for post in AlumniPhDpeople %}
    {% include archive-single-people.html %}
{% endfor %}

{% assign AlumniMSpeople = site.people | where: "position", "MS Alum" | sort: "order", "last" %}
{% for post in AlumniMSpeople %}
    {% include archive-single-people.html %}
{% endfor %}

{% assign AlumniBSpeople = site.people | where: "position", "BS Alum" | sort: "order", "last" %}
{% for post in AlumniBSpeople %}
    {% include archive-single-people.html %}
{% endfor %}
