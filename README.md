<p align="center"><img src="./brand/PBR.ONE_light_transparent.png" alt="PBR.ONE Logo" width="400" height="400"></p>

# What is PBR.ONE?
PBR.ONE is a set of HTML pages that can be embedded into any website to quickly and easily create interactive previews of digital PBR materials and HDRI environment maps right in the browser.
It was originally developed as an easy way of adding interactive previews to [ambientCG.com](https://ambientcg.com) but is now available as an open source project for everyone.

# How does it work?
The HTML pages for PBR.ONE can be viewed directly or embedded in an iframe.
Resources can be loaded by simply appending them to the URL of the page, no backend required.
Check out [this simple example](https://cdn.pbr.one/main/material-shading.html#color_url=https://pbr.one/media/bricks_col.jpg&normal_url=https://pbr.one/media/bricks_nrm.jpg&roughness_url=https://pbr.one/media/bricks_rgh.jpg&displacement_url=https://pbr.one/media/bricks_dsp.jpg&geometry_type=cylinder&displacement_scale=0.01&tiling_scale=1.33) or visit the [examples page](https://pbr.one/examples.html) to see more demos showing all of PBR.ONE's features in detail.

# How do I get started?
Visit the [documentation pages](https://docs.pbr.one) to find out how to get started. No programming knowledge required!

# Development
The source lives in `/src`. [Three.js](https://threejs.org) is a regular dependency (see `package.json`) that gets bundled into the pages, so the build output in `/dist` is a self-contained folder of HTML files without any external CDN. [Bun](https://bun.sh) is used as the toolchain.

- `bun install` installs the dependencies.
- `bun run build` creates the deployable folder in `/dist`.
- `bun run dev` rebuilds on every change and serves `/dist` at `http://localhost:8080`.
- Alternatively, `docker compose up` starts the same setup in containers (main build on `:8080`, tests on `:8081`, website on `:8082`, docs on `:8083`). File change events from the host are not delivered to containers on some setups (e.g. Docker Desktop with WSL2). In that case use `REBUILD_INTERVAL=2 docker compose up` to rebuild every 2 seconds instead.

To update Three.js, change its version in `package.json` and run `bun install`.
