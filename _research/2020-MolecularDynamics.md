---
title: "Molecular Dynamics"
collection: research
permalink: /research/MD
excerpt: "Simulating individual molecules crossing a liquid–vapor interface, so the parameters that continuum models usually guess can be calculated from first principles."
---

## Why it matters
Every continuum model of evaporation or condensation, from a CFD simulation of a fuel tank to a heat pipe design tool, relies on a boundary condition at the interface. That condition is usually expressed with kinetic theory and an **accommodation coefficient**: the fraction of vapor molecules striking the interface that actually join the liquid. Reported values for this coefficient disagree by orders of magnitude, even for water. Molecular dynamics (MD) can resolve the interface directly and calculate these values instead of fitting them.

## Our approach
* **Steady-state, non-equilibrium MD.** We use simulation setups that keep evaporation and condensation running at steady state. This allows accommodation coefficients to be measured *in situ* under realistic driving conditions rather than at equilibrium.
* **Molecular-to-continuum bridging.** MD results are passed up to thin-film and CFD models (see [Thin Film Evaporation](/research/thinfilm) and [Cryogenic Fuel Management](/research/cryo)), which gives a multiscale framework with no tuning coefficients.
* **Testing assumptions.** MD is used to examine whether evaporation and condensation coefficients should be equal, and how they depend on temperature and on how far the system is from equilibrium.

## Selected outcomes
* [Drifting Mass Accommodation Coefficients: In Situ Measurements from a Steady State Molecular Dynamics Setup](/publication/akkus_2020a), *Nanoscale and Microscale Thermophysical Engineering* (2020)
* Invited and contributed talks, including *"Accommodation coefficients: the good, the bad and the ugly"* at the Gordon Research Conference on Micro and Nanoscale Phase Change Phenomena (2025)

## Broader relevance
The kinetics of molecules adsorbing, condensing, and leaving surfaces matter whenever vapor meets a surface under low pressure or strong non-equilibrium. Examples include vacuum processing, vapor deposition, precursor delivery, and cryopumping.
