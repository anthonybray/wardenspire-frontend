# Brand UI Style Guide

This document defines the UI color system and component styles for use across the frontend (MUI Dark Theme base).


---

## 🎨 Core Palette

| Token | Hex | Usage |
|----|----|----|
| **Background** | `#121212` | App background |
| **Surface** | `#1a1c23` | Cards, dialogs |
| **Surface-2** | `#272932` | Input fields background |
| **Surface-3** | `#0f1012` | Dropdown menu background |
| **Border** | `#3e2d60` | Subtle input & popup borders |
| **Text Primary** | `#efefef` | Headings, labels |
| **Text Secondary** | `#d1c5c0` | Helper text, placeholders |
| **Text Tertiary** | `#a8a8a8` | Subdued text, bullet points |
| **Accent Primary** | `#37ebf3` | Primary accent color (cyan/teal) |


---

## 🔘 Buttons

### Option Buttons

* **Background:** `#9370db`
* **Text:** `#ffffff`
* **Hover:** `#a77cf0` with slightly stronger shadow
* **Radius:** `8px`
* **Shadow:** `0 6px 16px rgba(0,0,0,0.35)` (default), `0 8px 20px rgba(0,0,0,0.45)` on hover

### Confirmation Buttons

* **Background:** `#37ebf3`
* **Text:** `#efefef`
* \
  **Weight:** `550`⚠️ **Accessibility note:** low contrast. Alternatives:
* Dark text on current background (`#0b1d1e` on `#37ebf3`)
* Darker background (`#0a7480` with `#efefef` text)

### Delete Buttons

* **Background:** `#cb1dcd`
* **Text:** `#ffffff`
* **Usage:** Archive / destructive actions only


---

## ✏️ Text Fields & Dropdowns

### Input Fields

* **Background:** `#272932`
* **Text:** `#eeeeee` (light grey)
* **Border:** `rgba(255, 255, 255, 0.3)` (light grey with transparency)
* **Focus:** Cyan outline (`#37ebf3`) with shadow `rgba(55,235,243,0.3)`

### Dropdown Menus

* **Background:** `#0f1012` (50% darker than input fields)
* **Text:** `#a8a8a8` (subdued grey)
* **Hover:** `rgba(55, 235, 243, 0.1)`
* **Selected:** `#1e2026` background with `#37ebf3` text

### Input Labels

* **Text:** `#d1c5c0`
* **Background (when shrunk):** `#272932` with `0 4px` padding
* **Focus state:** `#d1c5c0` (maintains color when focused)
* **No text decoration**


---

## 🪟 Popups / Modals

### Backdrop

* **Background:** `rgba(0,0,0,0.55)`
* **Effect:** `backdrop-filter: blur(2px)`

### Dialog Surface

* **Background:** `linear-gradient(135deg, rgba(40,40,45,0.95) 0%, rgba(20,20,25,0.95) 100%)`
* **Text:** `#efefef`
* **Border:** `1px solid rgba(62,45,96,0.6)`
* **Shadow:** `0 10px 28px rgba(0,0,0,0.45)`
* **Radius:** `10px`

### Dialog Header

* **Background:** `#1e2026` (darker than dialog surface)
* **Border:** `1px solid #3e2d60`
* **Text:** `#efefef` with `fontWeight: 550`
* **Icon:** `#37ebf3`

### Info Panels

* **Background:** Transparent (shows dialog gradient)
* **Border:** `1px solid rgba(255, 255, 255, 0.3)`
* **Radius:** `8px`
* **Padding:** `16px`

### Info Panel Text

* **Header:** `#37ebf3` with `fontWeight: 550`
* **Bullet Points:** `#a8a8a8` with `fontSize: 0.875rem`

### Settings Panels / Section Headers

Used for cards like **Tenant incident categories** in the Wardenspire Admin tab and other primary settings panels.

* **Outer panel (`Paper`):**
  * **Background:** `#272932`
  * **Border:** `1px solid rgba(62,45,96,0.6)`
  * **Radius:** `8px`
* **Header bar:**
  * **Background:** `#1e2026`
  * **Border bottom:** `1px solid #3e2d60`
  * **Padding:** `px: 2`, `py: 1.25`
  * **Title text:** `#efefef`, `fontWeight: 550`
* **Header left icon (gear disk):**
  * **Shape:** Circle `22px × 22px`, `borderRadius: '50%'`
  * **Background:** `#37ebf3`
  * **Icon/text:** `#0b1d1e`, `fontSize: 14px`
* **Header help icon (tooltip trigger):**
  * **Shape:** Circle `22px × 22px`
  * **Border:** `1px solid` with `borderColor: #3e2d60`
  * **Text:** `?` in `#a8a8a8`
  * **Hover:** standard MUI hover with cursor `help`

In **Tenant incident categories**, the body shows:

* A small inline form to add a new category (label only; the internal key is generated automatically).
* A table of existing categories with **Key** (read-only) and **Label** (inline editable).
* Category on/off and sort-order controls are handled elsewhere (per-zone visibility in **Categories by zone**) and are not exposed here.


---

## ⚙️ Settings Modal Specific

### Form Layout

* **Container:** `display: 'flex'`, `flexDirection: 'column'`, `gap: 3` (24px spacing)
* **Top margin:** `mt: 4` (32px from dialog header)
* **Bottom margin:** `mb: 2` (16px from dialog actions)

### Checkbox Layout

* **Container:** `display: 'flex'`, `gap: 3` (horizontal layout)
* **Label color:** `#eeeeee`
* **Checkbox color:** `#37ebf3` (checked state)
* **Hover:** `rgba(55, 235, 243, 0.08)`

### Field Order


1. Bar Shape
2. Unit
3. Visibility
4. Animation Speed
5. Input Scale
6. Display Options (checkboxes)


---

## 🖼️ Media Selector Modal Specific

### Dialog Structure

* **Backdrop:** `rgba(0,0,0,0.55)` with `backdrop-filter: blur(2px)`
* **Surface:** Grey/black gradient with `rgba(62,45,96,0.6)` border
* **Shadow:** `0 10px 28px rgba(0,0,0,0.45)`
* **Radius:** `10px`

### Dialog Header

* **Background:** `#1e2026` (darker than dialog surface)
* **Text:** `#efefef` with `fontWeight: 550`
* **No border line** between header and content

### Dialog Content

* **Top padding:** `pt: 4` (32px from header)
* **Grid container:** `pt: 3` (24px additional spacing)

### Image Cards

* **Background:** `#0f1012` (ultra-dark grey)
* **Border:**
  * **Selected:** `2px solid #9370db` (purple)
  * **Unselected:** `1px solid rgba(255, 255, 255, 0.1)` (subtle light border)
* **Grid layout:** `repeat(auto-fit, 160px)` with `gap: 3` (24px spacing)

### Action Icons

* **Background:** `rgba(0,0,0,0.4)` with `rgba(0,0,0,0.7)` hover
* **Color:** `#fff` (white)
* **Size:** `24px × 24px`

### Upload Button

* **Background:** `#37ebf3` (cyan)
* **Text:** `#000` (black)
* **Hover:** `#6febf2`
* **Font weight:** `550`


---

## 🎬 Video Settings Panel Specific

### Dialog Structure

* **Backdrop:** `rgba(0,0,0,0.55)` with `backdrop-filter: blur(2px)`
* **Surface:** Grey/black gradient with `rgba(62,45,96,0.6)` border
* **Shadow:** `0 10px 28px rgba(0,0,0,0.45)`
* **Radius:** `10px`

### Dialog Header

* **Background:** `#1e2026` (darker than dialog surface)
* **Border:** `1px solid #3e2d60`
* **Text:** `#efefef` with `fontWeight: 550`
* **Icon:** `#37ebf3` (cyan)

### Dialog Content

* **Padding:** `p: 3` (24px)
* **Spacing:** `spacing={4}` between sections

### Toggle Button Groups

* **Background:** `#272932` (matches input fields)
* **Text:** `#a8a8a8` (subdued grey)
* **Selected:** `#37ebf3` background with `#000` text
* **Hover:** `#1e2026` background with `#efefef` text
* **Border radius:** `5px`

### Attribution Toggle (Super User Only)

* **Background:** `#272932` (unchecked), `#37ebf3` (checked)
* **Text:** `#a8a8a8` (unchecked), `#000` (checked)
* **Border:** `1px solid rgba(255, 255, 255, 0.1)`
* **Hover:** `#1e2026` background with `#efefef` text

### Action Buttons

* **Preview:** `#9370db` (option button style)
* **Generate:** `#37ebf3` with `#efefef` text (confirmation button style)
* **Stop:** `#cb1dcd` (delete button style)
* **Download:** `#9370db` (option button style)

### Progress Bar

* **Background:** `#272932`
* **Progress:** `#37ebf3` (cyan accent)
* **Height:** `5px`
* **Border radius:** `3px`

### Status Messages

* **Generating text:** `#9370db` (purple)
* **Progress percentage:** `#a7aabd`
* **Error messages:** Standard error color


---

## 🔄 Interactive Elements

### Switches

* **Checked Color:** `#37ebf3`
* **Track Color:** `#37ebf3`
* **Hover:** `rgba(55, 235, 243, 0.08)`
* **Label Text:** `#eeeeee`

### Aspect Ratio Indicators

* **16:9 Rectangle:** `32px × 18px` with `#37ebf3` background
* **3:4 Rectangle:** `18px × 24px` with `#37ebf3` background
* **Border Radius:** `4px`


---

## 📄 CSS Implementation

```css
:root {
  --btn-option-bg: #9370db;
  --btn-option-fg: #ffffff;

  --btn-confirm-bg: #37ebf3;
  --btn-confirm-fg: #efefef;

  --btn-delete-bg: #cb1dcd;
  --btn-delete-fg: #ffffff;

  --color-surface-2: #272932;
  --color-surface-3: #0f1012;
  --text-secondary: #d1c5c0;
  --text-tertiary: #a8a8a8;
  --color-border: #3e2d60;
  --focus-ring: #37ebf3;
  --accent-primary: #37ebf3;
}

/* Option button */
.btn--option {
  background: var(--btn-option-bg);
  color: var(--btn-option-fg);
}

/* Confirmation button */
.btn--confirm {
  background: var(--btn-confirm-bg);
  color: var(--btn-confirm-fg);
  font-weight: 550;
}

/* Delete button */
.btn--delete {
  background: var(--btn-delete-bg);
  color: var(--btn-delete-fg);
}

/* Text field */
.text-field {
  background: var(--color-surface-2);
  color: var(--text-tertiary);
  border: 1px solid var(--color-border);
}
.text-field:focus {
  border-color: var(--focus-ring);
  box-shadow: 0 0 0 3px rgba(55,235,243,0.3);
}

/* Dropdown menu */
.dropdown-menu {
  background: var(--color-surface-3);
  color: var(--text-tertiary);
}

/* Backdrop */
.popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(2px);
  display: grid;
  place-items: center;
  z-index: 1000;
}

/* Dialog surface with gradient */
.popup {
  background: linear-gradient(135deg, rgba(40,40,45,0.95) 0%, rgba(20,20,25,0.95) 100%);
  color: #efefef;
  border: 1px solid rgba(62,45,96,0.6);
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.45);
  max-width: 640px;
  width: 90%;
}

/* Dialog header */
.popup__header {
  background: #1e2026;
  border-bottom: 1px solid #3e2d60;
  color: #efefef;
  font-weight: 550;
}

/* Info panel */
.info-panel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
}
```


---

## ✅ Example HTML Usage

```html
<div class="popup-backdrop">
  <section class="popup">
    <header class="popup__header">
      <h3>Dialog Title</h3>
      <button class="btn btn--delete">×</button>
    </header>
    <div class="popup__body">
      <div class="info-panel">
        <h4>Info Header</h4>
        <ul>
          <li>Bullet point item</li>
        </ul>
      </div>
    </div>
    <footer class="popup__footer">
      <button class="btn btn--option">Cancel</button>
      <button class="btn btn--confirm">Confirm</button>
    </footer>
  </section>
</div>
```


---

## 🎯 Screenshot Dialog Specific

### Layout

* **Title:** "Generate Screenshot" with camera icon
* **Form Spacing:** `gap: 2` between form elements
* **Top Margin:** `mt: 4` for first form element
* **No Description Text:** Removed marketing copy

### Form Elements

* **Aspect Ratio:** Dropdown with visual indicators
* **Custom Title:** Text input with character counter
* **Date Stamp:** Dropdown with format options
* **Brand Image:** Toggle switch (conditional)

### Info Panel Content

* **Header:** "Screenshot will include:"
* **Items:**
  * Chart title (dynamic)
  * Date stamp (dynamic)
  * Brand image (conditional)
* **No Bullet Points:** "Current chart view", "Legend with values"

### Color Consistency

* **Input Text:** `#a8a8a8` (subdued)
* **Dropdown Menu:** `#0f1012` (dark)
* **Info Panel Text:** `#a8a8a8` (subdued)
* **Labels:** `#d1c5c0` (secondary)
* **Accents:** `#37ebf3` (cyan)


---

## 📁 Data Importer Modal Specific

### Dialog Structure

* **Backdrop:** `rgba(0,0,0,0.55)` with `blur(2px)`
* **Surface:** Gradient background with border and shadow
* **Header:** Dark background with border and centered title
* **Content:** Centered layout with proper spacing

### Header Layout

* **Background:** `#1e2026` with `!important`
* **Border:** `1px solid #3e2d60`
* **Title:** "Data Importer" with upload icon
* **Icon:** `#37ebf3` (cyan)
* **Close Button:** Positioned absolutely, hover effects

### Content Layout

* **Container:** `p: 3` with centered flex layout
* **Spacing:** `gap: 2` between elements
* **File Input:** Hidden input with styled button trigger

### Buttons

* **Upload Button:** `#9370db` background (option button style)
* **Apply Button:** `#37ebf3` background with `#efefef` text
* **Hover States:** Darker variants with disabled states

### Text Elements

* **File Info:** `#a8a8a8` color for file name and format info
* **Status Messages:** Alert components with appropriate colors
* **Validation Chips:** Small chips showing row/column counts

### Alert Styling

* **Success:** `#37ebf3` border and text with light background
* **Error:** `#E455AE` border and text with light background
* **Warning:** `#9370db` border and text with light background


