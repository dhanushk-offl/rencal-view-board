# renCal Board view

A board view for [renCal](https://rencal.org) with columns for yesterday, today, tomorrow and the rest of the week. Press <kbd>b</kbd> to open it.

## Installation

Add the repository to `~/.config/rencal/plugins.toml`:

```toml
plugins = ["t4t5/rencal-view-board"]
```

## Development

The view is built against `@rencal/plugin-api`, which comes from a renCal checkout next to this one (`../rencal`). renCal provides React, Temporal and the plugin API at runtime, so the build leaves them out.

```sh
pnpm install
pnpm dev     # rebuild dist/ on every change
```

Declare the checkout in `plugins.toml` to load it into renCal; edits reload while renCal is running:

```toml
plugins = ["~/dev/ren/rencal-view-board"]
```

Commit `dist/` with your changes: renCal installs the built files straight from the repository.
