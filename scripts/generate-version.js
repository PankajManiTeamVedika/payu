/**
 * Writes public/version.json with the current build timestamp.
 * Runs automatically before `npm start` / `npm run build` (see package.json
 * "prestart"/"prebuild"). The app polls this file at runtime (see
 * src/hooks/useVersionCheck.js) and auto hard-reloads any open tab once it
 * detects the version has changed, so a new deploy (e.g. turning maintenance
 * mode on/off) reaches devices that already have the site open.
 */
const fs = require("fs");
const path = require("path");

const versionInfo = {
  version: new Date().toISOString(),
};

const outPath = path.join(__dirname, "..", "public", "version.json");
fs.writeFileSync(outPath, JSON.stringify(versionInfo, null, 2) + "\n");

console.log(`[generate-version] public/version.json -> ${versionInfo.version}`);
