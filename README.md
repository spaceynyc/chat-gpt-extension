# ChatGPT GPT-5 Colorful Background

This browser extension enhances your ChatGPT experience by replacing the default background with a beautiful, customizable, GPT-5-style gradient. It also provides various options to fine-tune the appearance of the ChatGPT interface, including glass effects for UI elements, background dimming, and blur.

## Features

- **Customizable Gradients:** Replace the default background with your own custom CSS gradients.
- **Gradient Presets:** Choose from a selection of pre-designed, ultrawide-friendly gradients.
- **Background Effects:** Adjust the background dimness and apply a blur effect for better readability.
- **Glass UI:** Enjoy a modern look with "glass" effects (transparency and blur) for the sidebar, settings modals, and other interface elements.
- **Fine-Grained Control:** Customize every aspect of the look, including a bottom fade effect, a "hole" around the composer for better visibility, and manual sidebar gap adjustments.
- **Live Preview:** See your changes in real-time in the extension's options page.
- **Lightweight & Efficient:** The extension is designed to be fast and has minimal impact on performance.

## Installation

Since this is an unpacked extension, you can load it in any Chromium-based browser (like Chrome, Edge, or Brave) by following these steps:

1.  Download or clone this repository to your local machine.
2.  Open your browser and navigate to the extensions page (e.g., `chrome://extensions`).
3.  Enable "Developer mode" (usually a toggle in the top-right corner).
4.  Click on the "Load unpacked" button.
5.  Select the directory where you downloaded the repository.

The extension should now be installed and active.

## Usage

Once installed, the extension will automatically apply the default background to ChatGPT. To customize the settings:

1.  Click on the extensions icon in your browser's toolbar.
2.  Find "ChatGPT GPT-5 Colorful Background" in the list and click on it. This might open a small popup, or you might need to right-click and select "Options".
3.  Alternatively, go to your browser's extensions page, find the extension, and click the "Details" button, then select "Extension options".

This will open the options page where you can:
- Select a preset.
- Paste your own CSS gradient.
- Adjust sliders for dim, blur, and other effects.
- Toggle features on and off.

Click the "Save" button to apply your changes. The new settings will be applied to any open ChatGPT tabs.

## Customization

You can create your own backgrounds using CSS. The "CSS Gradient" text box accepts any valid CSS for the `background` property.

A good starting point is to combine multiple `radial-gradient()` functions. You can use an online CSS gradient generator to create complex gradients easily. For example, a simple two-color radial gradient might look like this:

```css
radial-gradient(circle at top left, #ff0000, #0000ff)
```

For the best results, try combining multiple radial gradients with transparency and a final `linear-gradient` to black at the bottom for a smooth finish, similar to the included presets.
