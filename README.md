# Kartik Agrawal: interactive CV

React + Vite, arrow-function components. Content lives in `src/data/cv.js`; colours are tokens at the top of `src/styles.css`.

```
npm install
npm run dev          # local, with hot reload
npm run build        # dist/index.html  (one self-contained file)
```

Deploy: drag `dist/` onto Netlify (just `index.html`, plus a `media/` folder if you self-host video).
The page is `noindex`. Anyone with the link can open it.

## Put real estimator output on the page

The chart under the thesis entry draws `src/data/estimator.json`. It currently holds **synthetic sample data** and says
so on the page ("Illustrative"). To replace it:

1. Export one CSV from your run: `t,truth_x,truth_y,est_x,est_y` and optionally `dr_x,dr_y` (metres, one frame).
2. `node scripts/estimator-from-csv.mjs run.csv --label "Thesis run 12" --source "GTSAM FGO vs simulated ground truth"`
3. Rebuild. The badge disappears, and the page computes position RMSE from your rows.
   Any number you quote in the text will match what visitors can see.

Edit the plot's caption in `cv.js` (the `kind: 'plot'` item) to say what the run is.

## Videos

YouTube items use the privacy-enhanced embed and load nothing until someone presses play.
If a video asks viewers to sign in, that is YouTube's decision: check the video is **Public or Unlisted**, not age-restricted,
and not "made for kids" misclassified. To avoid YouTube entirely, host the file yourself:

```
ffmpeg -i demo.mov -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart public/media/nav2.mp4
ffmpeg -i demo.mov -frames:v 1 -vf scale=-2:720 public/media/nav2.jpg
```

then in `cv.js`: `{ kind: 'video', src: 'media/nav2.mp4', poster: 'media/nav2.jpg', title: '...', caption: '...' }`.
Keep each file under about 10 MB. In `src/config.js`, `embedYouTube: false` turns every YouTube poster into a plain link.

## Skills that point at their evidence

`evidence` at the bottom of `cv.js` maps a skill to the entry ids that show it. Skills missing from the map render as plain
text. Keep it honest: only list an entry if its own text supports the skill.

## Links to a single entry

Every entry has an id (`thesis-fgo`, `autonomy-stack`, `ci`, `flow-matching`, `t-systems`, ...). `yoursite/#flow-matching`
opens and scrolls to it. The link icon on each entry copies that URL. `?depth=skim|standard|deep` sets the reading depth.

## Visit statistics (off by default)

Cookie-free and optional. In `src/config.js` (or via the `VITE_ANALYTICS` environment variable at build time):

```
{"provider":"goatcounter","endpoint":"https://YOURCODE.goatcounter.com/count"}
{"provider":"plausible","domain":"yourdomain.com"}
```

Visitors who send Do Not Track are never counted. A one-line notice appears in the footer when it is on. Events recorded:
`video-play`, `copy-link`, `skill`, `depth-skim|standard|deep`. Check your own data-protection obligations.
