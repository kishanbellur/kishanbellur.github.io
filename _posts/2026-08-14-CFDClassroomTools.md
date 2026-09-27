---
title: 'Building LecturePulse and SAM: making lectures more responsive'
date: 2026-08-14
permalink: /posts/2026/08/CFDClassroomTools/
author: Kishan Bellur
author_profile: true
tags:
  - Teaching
  - Thermodynamics
  - AI
---

Whether I'm teaching [Thermodynamics](/teaching/thermodynamics) or [Computational Fluid Dynamics](/teaching/CFD), I see the same pattern. Students who miss one step, such as setting up an energy balance or following a stability argument, rarely say so in the moment. By the time it shows up on an exam, several weeks of material have piled on top of it. This summer I built two tools to close that gap. Both are freely available and live on the [Teaching](/teaching/) page.

### LecturePulse: see confusion while it's happening
[LecturePulse](/lecturepulse/) is a one-tap, anonymous check-in. Students open it from a link or QR code during class and pick:
* 🟢 **Green**: I'm following
* 🟡 **Yellow**: I'm getting there
* 🔴 **Red**: I need help

On my side, a live bar chart shows the room's status as responses come in. If red responses pass **20%**, the dashboard fires a browser notification, so I know to stop and re-explain before moving on. Because it is anonymous, students who would never raise their hand still get counted.

### SAM: a study assistant that only knows what we covered
Generic AI chatbots are a mixed blessing for students. They answer confidently, but often with different notation, sign conventions, or methods we never covered, and sometimes they simply make things up. **[SAM (Student Assistant Model)](/sam/)** takes a different approach:
* After each lecture, I upload the slides and notes through an [admin page](/sam-admin/), so SAM learns the material at the same pace as the students.
* When a student asks a question, SAM finds the most relevant lectures and answers **only from that material**.
* Every answer **cites the lecture date and title** it is based on, so students can go back to the source.
* If a topic hasn't been covered, SAM says so rather than making something up.

It works like a peer study partner who never misses a lecture. Students can ask "When did we cover isentropic efficiency?" or "Explain again why entropy is generated in a throttling valve" at any hour, and get an answer that matches how *this* course taught it.

### How it's built
Both tools are hosted alongside this website. LecturePulse runs on Firebase's real-time database with an instructor-only dashboard. SAM runs on a Cloudflare Worker with a D1 database of lecture content, uses the Gemini API for generation, and protects instructor uploads with Google sign-in and student access with a class code. Everything runs on free-tier services, so the tools cost nothing to operate and could be adopted by other courses.

This fall I'm piloting SAM in Thermodynamics, where it complements the course's gamified zyBooks activities: zyBooks gives students practice, and SAM gives them explanations in the course's own words. I'll report back on how students use it.
