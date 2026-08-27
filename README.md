# Piano practice — moved

This app now lives in the [static-apps](https://github.com/lisazacarias/static-apps)
monorepo, at `apps/piano-practice/`, and is served from
<https://lisazacarias.github.io/static-apps/apps/piano-practice/>.

It moved with `git subtree`, so the history came along — every commit in this
repo is also in that one.

## Why this repo still exists

Only to retire the old address. `index.html` is a stub that unregisters the
service worker installed from this scope, clears its caches, and redirects.
Without it, anyone who added the app to their home screen from here would keep
a worker registered against a version that no longer gets updates.

Once you're confident nothing points here anymore, this repo can be archived
and its GitHub Pages site turned off.

## What did *not* need migrating

Practice progress. It lives in `localStorage`, which is scoped to the origin —
and both Pages sites are served from `lisazacarias.github.io`, so the history
carried over to the new path on its own.
