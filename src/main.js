/**
 * Entry point. Everything interesting is elsewhere; this file exists so that
 * the build has one root to follow and the page has one script tag.
 */
import { boot } from "./ui/app.js";

boot().catch((err) => {
  document.getElementById("view").innerHTML =
    `<div class="empty"><h2>The app failed to start</h2><p class="prose">${String(err?.message ?? err)}</p></div>`;
  throw err;
});
