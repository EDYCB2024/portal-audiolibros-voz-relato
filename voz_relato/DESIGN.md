---
name: Voz & Relato
colors:
  surface: '#fff8f3'
  surface-dim: '#e0d9d1'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2eb'
  surface-container: '#f5ece5'
  surface-container-high: '#efe7df'
  surface-container-highest: '#e9e1da'
  on-surface: '#1e1b17'
  on-surface-variant: '#424844'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe8'
  outline: '#727974'
  outline-variant: '#c1c8c3'
  surface-tint: '#466557'
  primary: '#163428'
  on-primary: '#ffffff'
  primary-container: '#2d4b3e'
  on-primary-container: '#99baa9'
  inverse-primary: '#adcebd'
  secondary: '#944926'
  on-secondary: '#ffffff'
  secondary-container: '#fe9e74'
  on-secondary-container: '#773311'
  tertiary: '#2f2f2c'
  on-tertiary: '#ffffff'
  tertiary-container: '#464542'
  on-tertiary-container: '#b5b3ae'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8ead8'
  primary-fixed-dim: '#adcebd'
  on-primary-fixed: '#012116'
  on-primary-fixed-variant: '#2f4d40'
  secondary-fixed: '#ffdbcd'
  secondary-fixed-dim: '#ffb597'
  on-secondary-fixed: '#360f00'
  on-secondary-fixed-variant: '#763311'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c9c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fff8f3'
  on-background: '#1e1b17'
  surface-variant: '#e9e1da'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system for this platform focuses on the intersection of classical literary tradition and modern digital convenience. The brand personality is scholarly yet welcoming, sophisticated but never cold. It aims to evoke the sensory experience of a high-end, contemporary library—quiet, curated, and deeply comfortable.

The design style utilizes a **Refined Minimalism** mixed with **Soft Tactility**. It prioritizes heavy whitespace to allow cover art and typography to breathe, while using subtle shadows to create a sense of physical layering, as if navigation elements are bookmarks or vellum sheets resting on a wooden surface.

## Colors
The palette is rooted in organic, earth-toned sophistication. The primary color is a **Forest Green** (#2D4B3E), used for primary actions and steady brand presence. The secondary accent is a **Terracotta** (#C26D47), reserved for highlights, progress bars, and active states to provide a warm, energetic contrast.

The background system relies on a **Cream/Parchment base** (#F5F2ED), which reduces eye strain compared to pure white and enhances the "literary" feel. Neutrals are rendered in a **Soft Charcoal/Deep Wood** (#3E3A35) for text, ensuring high legibility while maintaining the warm temperature of the design system.

## Typography
This design system employs a high-contrast typographic pairing. **Libre Caslon Text** is used for all headlines and display elements, bringing a timeless, editorial authority to the interface. Its classic serifs and variable stroke widths suggest the quality of a printed book.

For functional UI and long-form metadata, **Manrope** provides a balanced, modern sans-serif counterpoint. It was chosen for its excellent legibility at small sizes and its neutral, calm tone that doesn't compete with the expressive nature of the headlines. Label styles use increased letter-spacing and uppercase styling for clear categorization.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain the "contained" feeling of a book, while transitioning to a fluid model for mobile. A 12-column grid is used for the main library view, allowing for flexible book-cover arrangements (e.g., spans of 2, 3, or 4 columns).

Spacing is generous, favoring "room to breathe." Vertical rhythm is built on an 8px base unit. Component internal padding should be expansive—specifically in list items and cards—to evoke a premium, unhurried atmosphere. On mobile, margins tighten to 16px to maximize content space while keeping the cream background visible as a frame.

## Elevation & Depth
Hierarchy is established through **Ambient Shadows** and **Tonal Layering**. Surfaces do not use harsh borders; instead, they are separated by extremely soft, diffused shadows with a slight warm tint (using a fraction of the Deep Wood neutral).

We use three levels of elevation:
1.  **Base (0dp):** The Cream background.
2.  **Surface (4dp):** Book cards and navigation bars, using a slightly lighter parchment tone with a soft 15% opacity shadow.
3.  **Floating (12dp):** Player controls and modal overlays, featuring a more pronounced blur to simulate depth and focus.

## Shapes
The shape language is consistently **Rounded**, avoiding sharp corners to maintain the "cozy" and "approachable" brand promise. Standard containers use a 0.5rem (8px) radius. Larger elements like book covers and featured hero banners use the `rounded-xl` (24px) setting to create a friendly, modern silhouette that feels like a physical object with softened edges.

## Components
-   **Buttons:** Primary buttons use the Forest Green background with white Manrope text. Secondary buttons use a Forest Green outline with a subtle cream hover state.
-   **Audio Player:** A persistent floating bar at the bottom. Use the Terracotta color for the progress bar and "Play" state. The background of the player should use a slight glassmorphism effect (backdrop-blur) over the cream base.
-   **Book Cards:** Large-scale imagery with `rounded-lg` corners. Titles appear below in Libre Caslon Text. Include a subtle inner glow on the cover image to simulate the spine of a book.
-   **Chips/Tags:** Used for genres (e.g., "Fiction", "History"). These should be pill-shaped with a very light Forest Green tint and dark green text.
-   **Input Fields:** Minimalist design with only a bottom border in a muted wood tone, which turns Forest Green upon focus.
-   **Lists:** Chapter lists use high vertical padding (16px+) with thin, low-contrast separators to maintain a clean, editorial look.