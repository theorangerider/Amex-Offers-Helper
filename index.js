(() => {
  const SEL = 'button[data-testid="merchantOfferListAddButton"]';
  const WAIT_MS = 900;           // tweak if you see missed clicks
  const SCROLL_STEP = 0.85;      // how much to scroll each time we need more
  const MAX_NO_PROGRESS = 8;     // stop after N loops with nothing to click

  let running = true;
  let noProgress = 0;
  let clicked = 0;

  const isClickable = (b) =>
    b &&
    !b.disabled &&
    b.getAttribute("aria-disabled") !== "true" &&
    b.offsetParent !== null; // visible-ish

  function findNext() {
    return Array.from(document.querySelectorAll(SEL)).find(isClickable) || null;
  }

  function scrollMore() {
    window.scrollBy(0, Math.floor(window.innerHeight * SCROLL_STEP));
  }

  function step() {
    if (!running) return;

    const btn = findNext();
    if (btn) {
      noProgress = 0;
      btn.scrollIntoView({ block: "center" });

      btn.click();
      clicked++;
      console.log(`Clicked ${clicked}`);

      // slight scroll helps lazy-load / bring new offers into DOM
      if (clicked % 6 === 0) scrollMore();

      setTimeout(step, WAIT_MS);
      return;
    }

    // No button found: try to scroll to load more, then retry.
    noProgress++;
    if (noProgress > MAX_NO_PROGRESS) {
      console.log("No more Add buttons found. Stopping.");
      return;
    }
    scrollMore();
    setTimeout(step, WAIT_MS);
  }

  window.__amexStop = () => { running = false; console.log("Stopped."); };
  console.log("Running. To stop: __amexStop()");
  step();
})();
