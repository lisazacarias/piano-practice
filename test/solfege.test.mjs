import { test } from 'node:test';
import assert from 'node:assert';
import { loadApp } from './harness.mjs';

const app = loadApp();

test('major do is the tonic itself', () => {
  const c = app.keyByName('C');
  assert.equal(app.solfegeSyllable(app.dOf('C', 4), c, false), 'do');
  const g = app.keyByName('G');
  assert.equal(app.solfegeSyllable(app.dOf('G', 4), g, false), 'do');
});

test('major degrees follow letter distance from the tonic, ignoring accidentals', () => {
  // G major: G A B C D E F# — F is the 7th degree (ti) even though it's chromatically F#
  const g = app.keyByName('G');
  assert.equal(app.solfegeSyllable(app.dOf('F', 4), g, false), 'ti');
  assert.equal(app.solfegeSyllable(app.dOf('A', 4), g, false), 're');
  assert.equal(app.solfegeSyllable(app.dOf('E', 4), g, false), 'la');
});

test('do-based minor: tonic is do, not la', () => {
  // A minor is C major's relative minor (key.rel === 'A')
  const c = app.keyByName('C');
  assert.equal(app.solfegeSyllable(app.dOf('A', 4), c, true), 'do');
});

test('do-based minor uses altered syllables for the flatted 3rd, 6th, and 7th', () => {
  const c = app.keyByName('C'); // relative minor is A minor
  assert.equal(app.solfegeSyllable(app.dOf('C', 4), c, true), 'me', 'minor 3rd');
  assert.equal(app.solfegeSyllable(app.dOf('F', 4), c, true), 'le', 'minor 6th');
  assert.equal(app.solfegeSyllable(app.dOf('G', 4), c, true), 'te', 'minor 7th');
});

test('do-based minor uses plain syllables for the 2nd, 4th, and 5th', () => {
  const c = app.keyByName('C'); // relative minor is A minor
  assert.equal(app.solfegeSyllable(app.dOf('B', 4), c, true), 're', '2nd degree');
  assert.equal(app.solfegeSyllable(app.dOf('D', 4), c, true), 'fa', '4th degree');
  assert.equal(app.solfegeSyllable(app.dOf('E', 4), c, true), 'sol', '5th degree');
});

test('every key names all seven scale degrees without NaN or undefined', () => {
  app.KEYS.forEach(k => {
    for (let i = 0; i < 7; i++) {
      const major = app.solfegeSyllable(app.dOf(app.LETTERS ? app.LETTERS[i] : 'CDEFGAB'[i], 4), k, false);
      assert.ok(major && !/nan|undefined/i.test(major), `major ${k.name} degree ${i}: got ${major}`);
      if (app.MINOR_OK.includes(k.name)) {
        const minor = app.solfegeSyllable(app.dOf('CDEFGAB'[i], 4), k, true);
        assert.ok(minor && !/nan|undefined/i.test(minor), `minor ${k.name} degree ${i}: got ${minor}`);
      }
    }
  });
});
