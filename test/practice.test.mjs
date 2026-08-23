import { test } from 'node:test';
import assert from 'node:assert';
import { loadApp } from './harness.mjs';

test('an active practice session renders real times, not NaN', () => {
  const app = loadApp();
  app.S = app.normalize(app.blank());
  app.tab = 'practice';
  app.startSession(10); // plan: 3 min technique, 7 min repertoire
  app.render();
  const html = app.store.view.innerHTML;
  assert.ok(!/NaN|undefined/.test(html), 'active session contains NaN or undefined');
  assert.ok(html.includes('3:00'), 'first slot should show its full 3:00 allotment');
  assert.ok(html.includes('7:00'), 'second slot should show its full 7:00 allotment');
});

test('pausing a slot banks elapsed wall-clock time, not a countdown', () => {
  const app = loadApp();
  app.S = app.normalize(app.blank());
  app.tab = 'practice';
  app.startSession(10);

  app.toggleSlot(0);
  assert.equal(app.S.session.slots[0].running, true);

  app.S.session.slots[0].startedAt = Date.now() - 5000; // simulate 5s of practice
  app.toggleSlot(0); // pause
  const slot = app.S.session.slots[0];
  assert.equal(slot.running, false);
  assert.ok(slot.spent >= 4.5 && slot.spent <= 6, `expected ~5s banked, got ${slot.spent}`);

  const html = app.store.view.innerHTML;
  assert.ok(html.includes('Resume'), 'a slot with time already spent should offer Resume, not Start');
});
