# gwc-project8

Fall 2026 Girls Who Code Team 8 Project!

## SaveGas

SaveGas is a mobile app that helps you find the cheapest fuel stops along your trip. Enter where you're going, your car's MPG, tank size, and current fuel level, and the app shows a plan for where to fill up.

Built with React Native and Expo.

## Try the demo

**Alternatively, [click on this link to view on mobile](PASTE-YOUR-LINK-HERE)**

No install needed, just open the link.

## Figma Make prototype (visual demo only)
 
SaveGas was first designed and prototyped in Figma Make, which builds a working web version of an app from a design. The Expo app in this repo is the mobile version of that prototype, with the same three screens: Home, Plan your trip, and Results.
 
- **View the prototype:** [Open the Figma Make prototype](https://www.figma.com/proto/gSDLyGulGkNJIAdq0xLKaM/Untitled?node-id=1-3&code-node-id=1-3&t=uEADMq72psPvHC7I-1&scaling=contain&content-scaling=responsive&page-id=0%3A1&starting-point-node-id=1%3A3)
- It runs in any browser, so there's nothing to install.
### Important: the Figma Make prototype does not do the real calculations
 
The Figma Make link is meant to show **how the app looks and feels**. It is not the full working app. When you type in a trip and tap "Find the cheapest plan," it does **not** calculate anything from your input. The Results screen always shows the same sample data (the same three stops, prices, and totals), no matter what you enter.

## Run it yourself (Expo Go)

### What you need first

- [Node.js](https://nodejs.org) (the LTS version)
- The **Expo Go** app on your phone (App Store or Google Play)
- Your phone and computer on the **same Wi-Fi**

### Steps

1. Download the code:

   ```
   git clone https://github.com/Hasita-K/gwc-project8.git
   cd gwc-project8/frontend
   ```

2. Install everything the app needs:

   ```
   npm install
   ```

3. Start the app:

   ```
   npx expo start
   ```

4. A QR code appears in the terminal.
   - **iPhone:** open the Camera app and scan it.
   - **Android:** open Expo Go and tap "Scan QR code".

The app will open in Expo Go on your phone.

### Troubleshooting

- **Phone can't connect:** run `npx expo start --tunnel` instead.
- **Red error about a missing package:** run `npm install` again.
- **Changes not showing:** shake your phone and tap "Reload".

## Project structure

- `frontend/app/index.tsx` loads the app
- `frontend/savegas/screens` has the three screens (Home, Trip form, Results)
- `frontend/savegas/components` has the reusable pieces (buttons, inputs, price pins)
- `backend/` and `main.py` are the Python side of the project
