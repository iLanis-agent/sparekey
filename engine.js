/* SpareKey engine - pure functions for tracking keys, codes and access handed out. */
(function (root) {
  'use strict';
  var DAY = 86400000;
  var nextId = 1;
  function uid() { return 'k' + (nextId++) + '-' + Math.random().toString(36).slice(2, 8); }

  var KINDS = ['key copy', 'door code', 'garage remote', 'lockbox code', 'alarm code', 'other'];

  function addEntry(list, what, holder, givenOn, kind, note) {
    what = (what || '').trim();
    holder = (holder || '').trim();
    if (!what) throw new Error('say what was handed out');
    if (!holder) throw new Error('say who has it');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(givenOn || '')) throw new Error('given date must be YYYY-MM-DD');
    var e = {
      id: uid(), what: what, holder: holder,
      kind: KINDS.indexOf(kind) >= 0 ? kind : 'other',
      givenOn: givenOn, returnedOn: null, note: (note || '').trim()
    };
    list.push(e);
    return e;
  }

  function markReturned(list, id, returnedOn) {
    var e = list.find(function (x) { return x.id === id; });
    if (!e) throw new Error('no such entry');
    if (e.returnedOn) throw new Error('already returned');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(returnedOn || '')) throw new Error('return date must be YYYY-MM-DD');
    if (returnedOn < e.givenOn) throw new Error('returned before it was given?');
    e.returnedOn = returnedOn;
    return e;
  }

  function removeEntry(list, id) {
    var n = list.length;
    var kept = list.filter(function (x) { return x.id !== id; });
    list.length = 0;
    kept.forEach(function (x) { list.push(x); });
    return kept.length < n;
  }

  function daysOut(e, today) {
    if (e.returnedOn) return null;
    return Math.round((new Date(today + 'T00:00:00Z') - new Date(e.givenOn + 'T00:00:00Z')) / DAY);
  }

  // who can still get in, longest-standing first
  function outstanding(list, today) {
    return list.filter(function (e) { return !e.returnedOn; })
      .map(function (e) { return { entry: e, daysOut: daysOut(e, today) }; })
      .sort(function (a, b) { return b.daysOut - a.daysOut; });
  }

  function summary(list, today) {
    var out = outstanding(list, today);
    return {
      total: list.length,
      out: out.length,
      returned: list.length - out.length,
      oldestOut: out.length ? out[0].daysOut : null
    };
  }

  var api = { KINDS: KINDS, addEntry: addEntry, markReturned: markReturned, removeEntry: removeEntry, daysOut: daysOut, outstanding: outstanding, summary: summary };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SpareKey = api;
})(typeof window !== 'undefined' ? window : this);
