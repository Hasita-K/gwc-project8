# gwc-project8

Fall 2026 Girls Who Code Team 8 Project!

## SaveGas

SaveGas is a mobile app that helps you find the cheapest fuel stops along your trip. Enter where you're going, your car's MPG, tank size, and current fuel level, and the app shows a plan for where to fill up.

Built with React Native and Expo.

## Try the demo

**Alternatively, [click on this link to view on phone](PASTE-YOUR-LINK-HERE)**

No install needed, just open the link.

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
