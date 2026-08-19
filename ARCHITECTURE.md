# Technical Architecture

## Tech Stack
- **HTML5 & CSS3**: Vanilla HTML structure with CSS variables (tokens) managing a sleek, modern UI. No CSS frameworks (Tailwind/Bootstrap) are used.
- **Vanilla JavaScript**: The entire application logic is contained in a single `<script>` block at the bottom of `index.html`. No frameworks (React/Vue) or bundlers (Webpack/Vite) are used. 
- **jsPDF (CDN)**: The only external dependency, used exclusively for generating 300 DPI layout PDFs.

## File Structure
- `index.html`: The core application. Contains the UI, styling, packing engine, canvas renderers, and event listeners.
- `/blog/`: Contains HTML articles for SEO and content marketing.

## State Management
State is managed globally in a single `STATE` object, ensuring a single source of truth.
```javascript
let STATE = {
  img: null,              // Uploaded Image object for previews
  candidates: [],         // Array of mathematically viable layouts
  activeLayout: null,     // The currently selected layout object
  activeW: 0,             // Current active sticker width
  activeH: 0,             // Current active sticker height
};
```
Whenever an input changes (via event listeners bound in the `Init` block), the global `updateAll()` orchestrator function is called.
```javascript
function updateAll() {
  generateCandidates();     // 1. Math: Recalculate viable sizes
  resolveActive();          // 2. State: Pick best layout based on activeW/H
  renderCandidates();       // 3. DOM: Render the sidebar candidate buttons
  updateStats();            // 4. DOM: Update the yield/efficiency dashboard
  updateCostStats();        // 5. DOM: Update financial calculations
  drawSheet();              // 6. Canvas: Render the Sheet layout preview
  drawCover();              // 7. Canvas: Render the Cover layout preview
  saveToLocalStorage();     // 8. Persistence: Save inputs
}
```

## The Mathematical Engine (`computeLayout`)
The heart of the app is the `computeLayout(trimW, trimH, params)` function. It solves the 2D packing problem with specific print constraints.

1. **Calculate Usable Area**:
   `usableW = SheetW - (2 * Margin)`
   `usableH = SheetH - Margin - Math.max(Margin, Gripper)`
2. **Calculate Footprint**: The physical space a sticker takes up.
   `footprint = TrimSize + (2 * Bleed)`
3. **Primary Grid Packing**:
   It floors the division of `(Usable Area + Gap) / (Footprint + Gap)` to find how many items fit in a standard grid.
4. **Scrap Strip Packing (The "L-shape" fill)**:
   If there is leftover space on the right or bottom of the primary grid, the engine rotates the footprint 90 degrees and recursively attempts to pack the margins, maximizing yield.
5. **Orientation Check**: It calculates the yield for both Portrait and Landscape alignments of the primary grid, returning the most efficient result.

## Canvas Rendering
The application uses two rendering paradigms:
1. **Screen Rendering (`drawSheet`)**: Uses the container's physical DOM pixel dimensions multiplied by `window.devicePixelRatio`. It scales the mathematical layout (`drawW = p.SW * scale`) to fit the screen.
2. **PDF Rendering (`generateHighResSheetImage`)**: Bypasses screen scaling entirely. It uses a virtual DPI (e.g., 300) to map the physical inches of the layout directly to pixels (`x = item.x * dpi`). This ensures the exported PDF is geometrically flawless and unpadded, matching the precise aspect ratio of the raw `sw * sh` PDF.
