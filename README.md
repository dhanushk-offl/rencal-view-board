# renCal Board view

A board view for [renCal](https://rencal.org) with columns for yesterday, today, tomorrow and the rest of the week. Press <kbd>b</kbd> to open it.

## Installation

Add the repository to `~/.config/rencal/plugins.toml`:

```toml
plugins = ["t4t5/rencal-view-board"]
```

## Development

The view is built with [`@rencomputer/rencal-sdk`](https://www.npmjs.com/package/@rencomputer/rencal-sdk), which provides the plugin API's types and the build: `rencal-sdk build` bundles `src/index.tsx` to the paths in `rencal-plugin.toml`.

```sh
pnpm install
pnpm dev     # rebuild dist/ on every change
```

Declare the checkout in `plugins.toml` to load it into renCal; edits reload while renCal is running:

```toml
plugins = ["~/dev/ren/rencal-view-board"]
```

Commit `dist/` with your changes: renCal installs the built files straight from the repository.
