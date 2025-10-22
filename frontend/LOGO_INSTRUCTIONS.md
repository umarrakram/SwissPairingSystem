# Adding E-JUST Logo

## Instructions

To add the E-JUST logo to your website, you need to place the logo image file in the correct location.

### Steps:

1. **Download the E-JUST logo** (PNG format recommended)
   - Get the official E-JUST logo from: https://ejust.edu.eg/ or your official source
   - Save it as `ejust-logo.png`

2. **Place the logo file** in the frontend public folder:
   ```
   /frontend/public/ejust-logo.png
   ```

3. **Logo Specifications**:
   - Format: PNG (with transparent background preferred)
   - Recommended size: 200-400px width
   - The logo will be automatically resized to 60px height
   - Aspect ratio will be maintained

### Alternative: If you don't have the logo yet

If you don't have the E-JUST logo file yet, you can:

1. **Create a temporary placeholder**: Save any image as `ejust-logo.png` in `/frontend/public/`
2. **Use text fallback**: The system will show "E-JUST Chess" text if the image fails to load
3. **Replace later**: Simply replace the file with the actual logo when you get it

### File Location
```
SwissPairingSystem/
└── frontend/
    └── public/
        └── ejust-logo.png  <-- Place your logo here
```

### Testing
After adding the logo:
1. Restart the frontend development server
2. Refresh your browser
3. The logo should appear in the header

### Customizing Logo Size
If you want to change the logo size, edit `/frontend/src/index.css`:

```css
.logo-image {
  height: 60px;  /* Change this value */
  width: auto;
  object-fit: contain;
}
```
