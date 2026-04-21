# Cursor Studio
### Design your cursor. Make it yours.

Cursor Studio is a browser-based cursor design tool. Mix and match illustrated parts — bodies, eyes, and accessories — to build a cursor character, or generate one from a text description using Claude AI. Your cursor updates live across the app as you design.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- An Anthropic API key — [console.anthropic.com](https://console.anthropic.com)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Roshni-R19/cursor-studio.git
cd cursor-studio
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:

```
REACT_APP_ANTHROPIC_KEY=your_anthropic_key_here
```

**4. Start the development server**

```bash
npm start
```

**5. Open** [http://localhost:3000](http://localhost:3000)

---

## Features

**Cursor Builder**
- Pick a body, eyes, and accessory from a library of illustrated parts
- Generate a custom SVG body from a text description using Claude Haiku
- Preview updates live as you select parts
- Your cursor applies across the entire app in real time

**Gallery**
- Save cursors to your personal gallery (persisted in `localStorage`)
- Load any saved cursor back into the builder
- Download cursors as PNG files

**Install Guide**
- Step-by-step instructions for installing a custom cursor on macOS and Windows

---

## Project Structure

```
src/
├── pages/
│   ├── Builder.js        # Main design interface and AI generation
│   ├── Gallery.js        # Saved cursor gallery
│   └── InstallGuide.js   # Platform install instructions
├── assetParts.js         # Canvas compositing logic
├── LayeredPreview.js     # Live CSS layer preview component
├── useAssets.js          # Hook to load asset manifest
└── App.js                # Router and navigation
public/
├── bodies/               # Body PNG assets
├── eyes/                 # Eyes PNG assets
├── accessories/          # Accessory PNG assets
└── assets-manifest.json  # Asset registry
```

---

## How It Works

Cursor characters are composed of three layers drawn onto an HTML Canvas:

1. **Body** — the base shape, bottom-aligned in the frame
2. **Eyes** — centered overlay positioned in the upper-body region
3. **Accessory** — centered overlay at the top, extending slightly above the body

The same layer positions are used for both the builder preview (CSS `position: absolute`) and the cursor data URL (HTML Canvas `drawImage`), so what you see in the preview matches the applied cursor exactly.

AI-generated bodies use Claude Haiku to produce SVG code from a text prompt. The SVG is encoded as a data URL and treated identically to PNG body assets throughout the compositing pipeline.

---

## Tech Stack

- **React** — UI and component state
- **React Router** — client-side navigation
- **Anthropic Claude API** — AI SVG generation (`claude-haiku-4-5-20251001`)
- **HTML Canvas API** — cursor image compositing and PNG export
- **localStorage / sessionStorage** — gallery persistence and builder state handoff

---

## Running Tests

```bash
npm test
```

Tests cover the compositing utility, the asset-loading hook, the preview component, and app navigation. See `src/*.test.js` and `src/pages/*.test.js`.
