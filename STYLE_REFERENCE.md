# 🎨 CampusSync Login Redesign - Color & Style Reference

## SCSS Variables Used

```scss
/* Theme Colors */
$bg-dark: #0a0a0a;              // Main background
$card-bg: #1e1e1e;              // Card background
$text-primary: #ffffff;         // Primary text (white)
$text-secondary: #b3b3b3;       // Secondary text (gray)
$label-color: #8FCBFF;          // Label default (light blue)
$label-color-focused: #60a5fa;  // Label on focus (bright blue)
$primary-gradient: linear-gradient(135deg, #ff42b3, #333399);  // Button
```

---

## Form Field Colors

### Labels
```scss
Default:    #8FCBFF     // Light ice-blue
Focused:    #60a5fa     // Bright blue
```

### Input Text
```scss
Text:       #ffffff     // Pure white
Background: #1a1a1a     // Dark input background
```

### Placeholders
```scss
Color:      #7c8fa3     // Soft gray-blue
Opacity:    1 (always visible)
```

### Borders
```scss
Default:    rgba(59, 130, 246, 0.5)  // Soft blue 1.5px
Focused:    #60a5fa                   // Bright blue 2px
Error:      #ff5252                   // Red 2px
```

### Error Messages
```scss
Color:      #ff5252     // Red
Font Size:  0.75rem
Margin Top: 4px
```

### Select Dropdowns
```scss
Text:       #ffffff     // White
Background: #1a1a1a     // Dark
Selected:   #60a5fa     // Blue highlight
Hover:      #2a2a2a     // Darker gray
```

### Icons
```scss
Color:      #60a5fa     // Bright blue
Size:       40×40px
Background: rgba(59, 130, 246, 0.1) on hover
```

---

## Complete SCSS Style Reference

### Form Field Container
```scss
.mat-mdc-form-field {
  width: 100%;
  display: block;
  position: relative;
  margin-bottom: 1.5rem;
}
```

### Floating Label
```scss
.mat-mdc-form-field .mat-mdc-form-field-label {
  color: #8FCBFF !important;
  opacity: 1 !important;
  font-weight: 500 !important;
  font-size: 0.85rem !important;
  letter-spacing: 0.3px !important;
  position: absolute !important;
  top: -1.2rem !important;         // Above input
  left: 0 !important;
  line-height: 1.2 !important;
  pointer-events: none !important;
  transform: translateY(0) !important;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Focused state */
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-label,
.mat-mdc-form-field.mat-form-field-should-float .mat-mdc-form-field-label {
  color: #60a5fa !important;
  top: -1.2rem !important;
  opacity: 1 !important;
}
```

### Input Element
```scss
input.mat-mdc-input-element {
  color: #ffffff !important;
  font-size: 0.95rem !important;
  height: 100% !important;
  line-height: 1.5 !important;
  padding: 0 12px !important;
  box-sizing: border-box !important;
  border: none !important;
  background: transparent !important;
  margin: 0 !important;
  caret-color: #60a5fa !important;
  -webkit-text-fill-color: #ffffff !important;
  -webkit-autofill: none !important;
  vertical-align: middle !important;
}

/* Placeholder */
input.mat-mdc-input-element::placeholder {
  color: #7c8fa3 !important;
  opacity: 1 !important;
  font-weight: 400 !important;
}

/* Autofill */
input.mat-mdc-input-element:-webkit-autofill {
  -webkit-box-shadow: inset 0 0 0 1000px #1a1a1a !important;
  -webkit-text-fill-color: #ffffff !important;
}
```

### Input Box (Outlined)
```scss
.mdc-text-field--outlined {
  height: 56px !important;
  min-height: 56px !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
  background-color: #1a1a1a !important;
  border-radius: 4px !important;
}
```

### Border (Outline)
```scss
.mdc-notched-outline {
  border: 1.5px solid rgba(59, 130, 246, 0.5) !important;
  border-radius: 4px !important;
  box-sizing: border-box !important;
}

/* Leading (left) border */
.mdc-notched-outline__leading {
  border-color: rgba(59, 130, 246, 0.5) !important;
  border-width: 1.5px 0 1.5px 1.5px !important;
  border-radius: 4px 0 0 4px !important;
}

/* Trailing (right) border */
.mdc-notched-outline__trailing {
  border-color: rgba(59, 130, 246, 0.5) !important;
  border-width: 1.5px 1.5px 1.5px 0 !important;
  border-radius: 0 4px 4px 0 !important;
}
```

### Focused Border
```scss
.mat-mdc-form-field.mat-focused {
  .mdc-notched-outline {
    border-color: #60a5fa !important;
    border-width: 2px !important;
  }

  .mdc-notched-outline__leading {
    border-color: #60a5fa !important;
    border-width: 2px 0 2px 2px !important;
  }

  .mdc-notched-outline__trailing {
    border-color: #60a5fa !important;
    border-width: 2px 2px 2px 0 !important;
  }
}
```

### Error State
```scss
.mat-mdc-form-field.mat-form-field-invalid {
  .mdc-notched-outline {
    border-color: #ff5252 !important;
  }

  .mdc-notched-outline__leading {
    border-color: #ff5252 !important;
  }

  .mdc-notched-outline__trailing {
    border-color: #ff5252 !important;
  }
}

.mat-mdc-form-field-error {
  color: #ff5252 !important;
  font-size: 0.75rem !important;
  display: block !important;
  margin-top: 4px !important;
}
```

### Select Dropdown
```scss
.mdc-select__selected-text {
  color: #ffffff !important;
  padding: 0 12px !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  font-size: 0.95rem !important;
  line-height: 1.5 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.mat-mdc-select-arrow {
  color: #60a5fa !important;
  margin-right: 8px !important;
}

/* Dropdown panel */
.mat-mdc-select-panel {
  background-color: #1a1a1a !important;
  border: 1px solid rgba(59, 130, 246, 0.4) !important;
  border-radius: 4px !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7) !important;
  z-index: 1050 !important;
}

/* Option styles */
.mat-mdc-option {
  color: #f3f4f6 !important;
  font-size: 0.95rem !important;
  padding: 12px 16px !important;
  height: auto !important;
  line-height: 1.5 !important;
}

.mat-mdc-option:hover:not(.mat-mdc-option-disabled) {
  background-color: #2a2a2a !important;
}

.mat-mdc-option.mat-selected {
  background-color: rgba(59, 130, 246, 0.25) !important;
  color: #60a5fa !important;
  font-weight: 500;
}
```

### Icons
```scss
.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  color: #b3b3b3 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 40px !important;
  height: 40px !important;
}

button.mat-icon-button.mat-mdc-icon-button {
  color: #60a5fa !important;
}

button.mat-icon-button.mat-mdc-icon-button:hover {
  background-color: rgba(59, 130, 246, 0.1) !important;
}
```

### Submit Button
```scss
.submit-btn {
  width: 100%;
  height: 50px;
  margin-top: 24px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #ff42b3, #333399) !important;
  color: white !important;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 0, 204, 0.3) !important;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Error Alert
```scss
.error-alert {
  background: rgba(255, 82, 82, 0.1);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #ff5252;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  flex-wrap: wrap;
}
```

---

## Font Sizes & Weights

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Label | 0.85rem | 500 | 1.2 |
| Input Text | 0.95rem | 400 | 1.5 |
| Placeholder | 0.95rem | 400 | 1.5 |
| Error | 0.75rem | 400 | - |
| Button | 1rem | 600 | - |

---

## Spacing Values

| Element | Value | Usage |
|---------|-------|-------|
| Input Height | 56px | Vertical sizing |
| Input Padding | 0 12px | Horizontal spacing |
| Input Padding | 8px | Top/bottom |
| Label Top | -1.2rem | Position above input |
| Error Margin | 4px | Space below input |
| Field Margin | 2.25rem | Between fields |
| Row Gap | 16px | Column spacing |
| Button Margin | 24px | Top margin |
| Button Height | 50px | Vertical sizing |

---

## Transition & Animation

```scss
Label transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
Button hover: translateY(-2px)
Button animation: 0.3s cubic-bezier(0.23, 1, 0.32, 1)
Toggle link: all 200ms ease
```

---

## Mobile Responsive (max-width: 600px)

```scss
@media (max-width: 600px) {
  .login-card {
    border-radius: 0;
    max-width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .row {
    flex-direction: column;
    gap: 0;
    margin-bottom: 2.25rem;
  }
  
  .mat-mdc-form-field {
    margin-bottom: 1.5rem;
  }
}
```

---

## How to Customize

### Change Label Color
```scss
$label-color: #YOUR_COLOR;
$label-color-focused: #YOUR_FOCUS_COLOR;
```

### Change Border Color
```scss
// In .mdc-notched-outline
border: 1.5px solid YOUR_COLOR !important;

// In .mat-mdc-form-field.mat-focused
border-color: YOUR_FOCUS_COLOR !important;
```

### Change Input Height
```scss
// In .mdc-text-field--outlined
height: YOUR_HEIGHT !important;
min-height: YOUR_HEIGHT !important;
```

### Change Font Size
```scss
// In input.mat-mdc-input-element
font-size: YOUR_SIZE !important;
```

---

## Browser Prefixes

```scss
-webkit-text-fill-color: #ffffff;  // Chrome/Safari text color
-webkit-autofill: none;            // Chrome autofill
-webkit-box-shadow: inset 0 0 0 1000px #1a1a1a;  // Autofill bg
```

---

**Reference Version:** 1.0  
**Last Updated:** 2026-01-15  
**Status:** Production Ready  
