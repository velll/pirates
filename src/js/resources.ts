function collectResources(): Resources {
  return {
    ships: {
      galleon: document.getElementById("galleon") as CanvasImageSource,
      sailboat: document.getElementById("sailboat") as CanvasImageSource,
      galleonWreck: document.getElementById("galleon-wreck") as CanvasImageSource,
      sailboatWreck: document.getElementById("sailboat-wreck") as CanvasImageSource,

      goldSpanishGalleon: document.getElementById("gold-galleon-spaniards") as CanvasImageSource,
      goldPirateGalleon: document.getElementById("gold-galleon-pirates") as CanvasImageSource,
      goldSpanishGalleonWrecked: document.getElementById("gold-ship-wreck-spaniards") as CanvasImageSource,
      goldPirateGalleonWrecked: document.getElementById("gold-ship-wreck-pirates") as CanvasImageSource
    },
    anchor: document.getElementById("anchor") as CanvasImageSource,
    flags: {
      pirates: document.getElementById("flag-pirates") as CanvasImageSource,
      spain: document.getElementById("flag-spaniards") as CanvasImageSource,
      netherlands: document.getElementById("flag-dutch") as CanvasImageSource,
      portugal: document.getElementById("flag-portuguese") as CanvasImageSource,
      france: document.getElementById("flag-french") as CanvasImageSource,
      britain: document.getElementById("flag-british") as CanvasImageSource
    }
  };
}

interface Resources {
  ships: Record<string, CanvasImageSource>,
  flags: Record<string, CanvasImageSource>,
  anchor: CanvasImageSource
}

export { collectResources };
