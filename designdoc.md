# Nazaria Design Doc

Source: Nazaria Arts Collective Brand Guide by Sakshi Singh
Site: nazariacollective.in | Email: us@nazariacollective.in
Stack: Next.js + Tailwind CSS (light mode default, `dark:` variants supported)

---

## 1. Brand Overview

Nazaria is a grassroots organization equipping marginalised youth and women
across India with media training and civic education — building voice,
agency, and pathways into the creative and media industry.

Shared identity across all programs: youth-led storytelling, creativity,
and community — even though each program has its own sub-brand palette
and fonts.

Applies to: app UI, social media, presentations, promotional/program
materials, and official documents.

---

## 2. Logo Usage

- **Primary rule:** Always use the full "Nazaria" wordmark logo across all
  communication — social, decks, reports, app UI header/nav.
- **Icon-only mark:** Only where space is constrained — favicon, app icon,
  small profile pictures, social handles.
- **Minimum safe zone:** Proportional clear space around the logo (burgundy
  marker in the guide, ~`#892d3b`) — no text/images inside it, sits on a
  clean neutral background.
- **Logo on colour** — confirmed from brand guide swatch tests:
  - Works directly on: pink, yellow, yellow-green (lime), light grey,
    and orange *with a white circle behind the mark*.
  - Does not work directly on dark/muted solid backgrounds (e.g. dark
    mauve/plum) — needs a white circle or white block/rectangle behind it
    for visibility.
  - General preference: white or grey shades as the base background.
- **Official documents:** Logo top-left + standard footer on every
  organization-wide asset.

**App implication (dark mode):** Since dark surfaces will render in
`dark:` mode, always wrap the logo in a white circle/block token
(`bg-white rounded-full p-2` or similar) when `dark:` is active — mirrors
the brand guide's dark-background rule exactly.

---

## 3. Color System

### 3.1 Master Brand (Nazaria)

| Name | Hex | Role |
|---|---|---|
| Burgundy | `#892d3b` | Primary — brand red/maroon, logo safe-zone marker |
| Deep Teal | `#00504f` | Primary — brand dark teal |
| Cream | `#fcdfab` | Primary — warm neutral/accent |
| White | `#ffffff` | Primary — base |
| Pale Teal | `#b3dfde` | Secondary — soft accent |
| Pale Gold | `#ffe1ac` | Secondary — soft accent |
| Pale Pink | `#ffd7d7` | Secondary — soft accent |

### 3.2 Summer Film School

| Name | Hex |
|---|---|
| Magenta | `#df3ba0` |
| Lime | `#e1f316` |
| Deep Teal | `#00504f` |
| White | `#ffffff` |

Fonts — Heading: **Bebas Neue** / Oswald Regular · Sub-heading: **Big
Shoulder Display** · Body: **Glacial Indifference**

### 3.3 Media Express Fellowship

| Name | Hex |
|---|---|
| Burnt Orange | `#e1520b` |
| Yellow | `#ffd200` |
| Teal Blue | `#0f889d` |
| White | `#ffffff` |
| Sky Blue | `#5ce1e6` |
| Pale Blue | `#d6f5ff` |

Fonts — Heading: **Bobby Jones** · Sub-heading: **Bobby Jones Condensed**
· Body: **Glacial Indifference** / Hangyaboly

### 3.4 Rural Media Fellowship (a.k.a. Awaaz Fellowship in body copy)

| Name | Hex |
|---|---|
| Deep Teal | `#00504f` |
| Yellow | `#fede00` |
| Burgundy | `#82343e` |
| White | `#ffffff` |

Font — **Glacial Indifference** used for heading, sub-heading, and body
consistently (no additional fonts).

> Note: the guide's slide title reads "Rural Media Fellowship" but the
> body text refers to "Awaaz Fellowship" — same program, worth confirming
> which name is canonical for the app before shipping labels.

---

## 4. Typography

- **Master brand font:** Maharlika — used for all brand-level external
  creatives (decks, invoices, proposals, contracts, email signatures, logo
  lockups). No additional styles introduced. Not always pre-installed, so
  exported files should use outlined text or attach the font.
- **Program fonts:** each program overrides with its own heading /
  sub-heading / body stack (see section 3).
- **Official documents:** logo top-left + standard footer, Maharlika +
  approved HEX palette only — no substitute fonts/colors.

**App implication:** Maharlika is a display/decorative serif, best used
for marketing headers, hero sections, and the logo lockup — not
necessarily for dense UI body text. Each program section of the app should
swap in its own heading/body font pairing per section 3, while the shared
shell (nav, footer, buttons) stays on the master brand system.

---

## 5. Tailwind Config — Light + Dark

Tailwind v3 `tailwind.config.ts`, using nested color objects so each
program palette is namespaced, plus a `nazaria` master palette used by the
shared app shell. `darkMode: 'class'` — light is default, dark toggles via
a `dark` class on `<html>`.

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nazaria: {
          burgundy: "#892d3b",
          teal: "#00504f",
          cream: "#fcdfab",
          white: "#ffffff",
          "pale-teal": "#b3dfde",
          "pale-gold": "#ffe1ac",
          "pale-pink": "#ffd7d7",
        },
        summerFilmSchool: {
          magenta: "#df3ba0",
          lime: "#e1f316",
          teal: "#00504f",
          white: "#ffffff",
        },
        mediaExpress: {
          orange: "#e1520b",
          yellow: "#ffd200",
          teal: "#0f889d",
          white: "#ffffff",
          sky: "#5ce1e6",
          paleBlue: "#d6f5ff",
        },
        ruralMedia: {
          teal: "#00504f",
          yellow: "#fede00",
          burgundy: "#82343e",
          white: "#ffffff",
        },
      },
      fontFamily: {
        maharlika: ["Maharlika", "serif"],
        bebas: ["Bebas Neue", "sans-serif"],
        bigShoulder: ["Big Shoulder Display", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        glacial: ["Glacial Indifference", "sans-serif"],
        bobbyJones: ["Bobby Jones", "sans-serif"],
        bobbyJonesCondensed: ["Bobby Jones Condensed", "sans-serif"],
        hangyaboly: ["Hangyaboly", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
```

### 5.1 Light / Dark usage pattern

Since the brand HEX values are fixed brand colors (not semantic tokens),
don't reassign the hex per mode — instead pair each brand color with a
`dark:` counterpart chosen for contrast, using the palette's own neutrals
(white/cream/pale tones) as dark-mode text/surface swaps.

```tsx
// Example: app shell header
<header className="bg-white dark:bg-nazaria-teal">
  <img src="/logo-full.svg" className="dark:bg-white dark:rounded-full dark:p-2" />
  <nav className="text-nazaria-teal dark:text-nazaria-cream">
    ...
  </nav>
</header>

// Example: primary CTA button
<button className="bg-nazaria-burgundy text-white
                    hover:bg-nazaria-burgundy/90
                    dark:bg-nazaria-cream dark:text-nazaria-teal
                    dark:hover:bg-nazaria-pale-gold">
  Apply Now
</button>

// Example: Summer Film School program page
<section className="bg-white dark:bg-summerFilmSchool-teal
                     text-summerFilmSchool-teal dark:text-white
                     font-bebas">
  <h1 className="text-summerFilmSchool-magenta dark:text-summerFilmSchool-lime">
    Summer Film School
  </h1>
</section>
```

### 5.2 Suggested semantic mapping (per surface)

| Token | Light | Dark |
|---|---|---|
| `bg-surface` | `white` | `nazaria-teal` (or program's dark primary) |
| `bg-surface-muted` | `nazaria-pale-teal` / program pale tone | `nazaria-burgundy`/10% or program dark accent |
| `text-primary` | `nazaria-teal` / program dark primary | `white` / `nazaria-cream` |
| `text-accent` | `nazaria-burgundy` / program bright primary | program's brightest primary (e.g. lime, yellow) |
| `border` | `nazaria-pale-teal` | `white`/20% |
| `logo-wrap` | none needed | `bg-white rounded-full` (per logo-on-dark rule) |

> Recommend implementing this as CSS variables (`--color-surface`, etc.)
> mapped inside `:root` and `.dark` blocks so components use
> `bg-[var(--color-surface)]` instead of hardcoding per-mode classes
> everywhere — keeps the Tailwind classes above as the source of truth but
> avoids repeating `dark:` pairs on every element.

---

## 6. Program Structure for the App

Each program should be a self-contained theme scope (color + font tokens)
under the shared Nazaria shell (nav, footer, auth, logo):

- `bastiMediaSchool` — *(not yet documented — colors/fonts pending, no
  swatch slide provided for this program yet)*
- `summerFilmSchool` — magenta / lime / teal, Bebas Neue + Glacial Indifference
- `mediaExpressFellowship` — orange / yellow / teal-blue / sky, Bobby Jones + Glacial Indifference
- `ruralMediaFellowship` (Awaaz Fellowship) — teal / yellow / burgundy, Glacial Indifference throughout

---

## 7. Photography

- Each program (All Programs / Summer Film School / Media Express
  Fellowship / Awaaz Fellowship) has its own photo library.
- **App implication:** structure a `photos` config/folder per program
  (`basti-media-school/`, `summer-film-school/`, `media-express-fellowship/`,
  `awaaz-fellowship/`) so assets stay isolated per program but share a
  common access pattern.

---

## 8. Open Items / To Confirm

- [ ] Basti Media School color palette + font stack (not shown in
      provided slides — same treatment as the other three programs)
- [ ] Confirm canonical name: "Rural Media Fellowship" vs "Awaaz
      Fellowship" for that program's public-facing label
- [ ] Confirm Maharlika web-font license/availability for Next.js
      `next/font` local loading, or pick a fallback for dense UI text
- [ ] Decide semantic CSS-variable layer vs raw Tailwind `dark:` pairs
      (recommended: CSS variables, see 5.2)
- [ ] Source actual photo assets/links per program for app integration