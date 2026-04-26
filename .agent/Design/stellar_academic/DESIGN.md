---
name: Stellar Academic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464553'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777584'
  outline-variant: '#c8c4d5'
  surface-tint: '#544fc0'
  primary: '#1f108e'
  on-primary: '#ffffff'
  primary-container: '#3730a3'
  on-primary-container: '#a9a7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#4f1e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#722f00'
  on-tertiary-container: '#ff9559'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3b35a7'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The brand personality for the design system is a "Trusted Mentor"—an identity that balances the rigor of academic excellence with the vibrant energy of a student's journey. It is designed to feel approachable and encouraging for students, while remaining sufficiently structured and polished to instill confidence in faculty and potential employers.

The design style leverages **Modern Corporate** foundations with subtle **Glassmorphic** accents. This approach ensures a high level of information density and clarity for complex project management tasks, while using translucent layers and soft background blurs to create a sense of depth and lightness that prevents the interface from feeling "heavy" or institutional.

## Colors

This design system utilizes a palette that evokes both stability and momentum. The primary **Deep Indigo** serves as the anchor, representing professional reliability and academic tradition. To contrast this, **Energetic Teal** is used for primary actions and progress indicators, providing a fresh, modern counterpoint.

**Soft Orange** is reserved for high-visibility highlights, such as deadlines or urgent notifications, while **Mint Green** signifies completion and success. Neutral tones are biased toward cool grays to maintain a crisp, clean environment that lets student work remain the focal point.

## Typography

The typographic strategy prioritizes clarity and personality. **Plus Jakarta Sans** is used for headlines and navigation elements; its geometric yet friendly curves provide the "playful touch" requested. For the core reading experience, the design system employs **Lexend**, a font specifically engineered to reduce visual stress and improve reading proficiency—making it ideal for academic project management and peer reviews.

Hierarchy is established through significant weight shifts rather than color shifts alone. Headers should utilize the Indigo primary color to maintain professional structure, while body text remains a high-contrast dark gray for maximum accessibility.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model to accommodate diverse screen sizes, from student tablets to employer desktops. A 12-column system provides the necessary flexibility for complex dashboards.

The spacing rhythm is built on an 8px base unit. To maintain the "clean and intuitive" aesthetic, the design system favors generous "white space" (negative space) between major sections (using `lg` and `xl` units). This prevents cognitive overload during intense project sessions. Content containers should utilize 24px padding to ensure elements have room to breathe, reinforcing the casual, un-cramped vibe.

## Elevation & Depth

Visual hierarchy in this design system is achieved through **Ambient Shadows** and **Tonal Layering**. Unlike harsh, high-contrast shadows, our shadows are extra-diffused and tinted with a hint of the primary Indigo color (e.g., `rgba(55, 48, 163, 0.08)`). This creates a "soft lift" rather than a hard separation.

Secondary depth is communicated via Glassmorphic surfaces—specifically for floating navigation bars or sidebars. These surfaces use a subtle backdrop-blur (12px to 20px) and a thin 1px white border with 20% opacity. This technique gives the UI a futuristic, "Polaris" feel without sacrificing the professional structure required for academic use.

## Shapes

The shape language is defined by a **Rounded** (Level 2) approach. This avoids the rigidity of sharp corners while maintaining more structure than a fully pill-shaped "toy-like" interface. 

Standard components like buttons and input fields use a 0.5rem (8px) radius. Larger containers, such as project cards or modal windows, utilize the `rounded-xl` (1.5rem/24px) setting to create a friendly, modern container for academic content. This consistency in rounding is key to the system's approachable aesthetic.

## Components

### Buttons & Inputs
Buttons should feature a subtle 2px vertical offset shadow that flattens upon click to provide tactile feedback. Primary buttons use a gradient transition from Deep Indigo to Energetic Teal on hover to suggest momentum. Input fields are styled with a light gray fill and a 1px border that transforms into a 2px Teal border when focused.

### Cards & Progress
Cards are the primary vehicle for project information. They must include a `rounded-xl` radius and a soft ambient shadow. Within cards, progress bars should use the Mint Green accent for completion, utilizing a rounded-pill shape for the inner bar to contrast against the more structured card corners.

### Chips & Tags
Use chips for categorizing project types (e.g., "Research," "Capstone," "Design"). Chips should have a low-opacity background of their respective category color with high-opacity text. These serve as the "playful" elements of the UI and can afford to use more vibrant colors.

### Interactive Elements
Micro-interactions are essential for the "fun" aspect. Checkboxes should have a "pop" animation when toggled, and list items should have a slight horizontal shift or scale effect (1.02x) when hovered over, signaling interactivity and ease of use.