# SpareKey

A ledger for everyone who can get into your place.

**Startup idea:** people hand out access to their home constantly - cleaners, dog walkers, guests, ex-roommates, contractors - and have no record of what is still out there. SpareKey logs every key copy, door code and remote, shows what is outstanding sorted by how long it's been gone, and tracks what came back.

## Use

Open `app.html`. Log what you handed out, who has it, and since when. The summary shows how many items are still out and the longest-standing one. Mark things "Got it back" when they return. Data persists in localStorage.

## Engine

`engine.js` holds the pure ledger logic (validation, return flow, days-out math, outstanding sort) and is covered by node tests. The UI is a thin render layer over it.

Part of the hourly app factory - 60+ small tools, one per hour.
