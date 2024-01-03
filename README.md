# ATDB

Andor's Trail DB - this is a recreation of Reizy's Andor's Trail Directory

## Running locally

1. Make symbolic link to game resources (values, xml, drawable, raw) at "public" directory.

```bash
make link
```

2. Install node modules.

```bash
npm install
```

3.  Render TMS to JPG for global map pages. Yes, it really takes a long time.

```bash
make gen
# or to test only one map
make gen_grave
```

4. Run the app

```bash
npm run dev
```

1.  `make link`: Make symbolic link to game resources (values, xml, drawable, raw) at "public" directory.
1.  You need have NPM installed. You can get it at https://nodejs.org/en/download/.
1.  `npm install`: Install required node.js package from package.json
1.  `make gen`: Render TMS to JPG for global map pages. Yes, it really takes a long time. (You can run `make gen_grave` to render only one map 'graveyard1' for test). Execute 1602.92s in my MBP.
1.  `make run`: Starting local development server.
1.  `npm run build`: Generate production build.
