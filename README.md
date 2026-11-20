# Roomiez

Roommate matching app for college students. Expo + React Native.

## Run

```powershell
npx expo start
```

Press `w` for web, or scan the QR code in Expo Go on a phone.

## Style rules

Tokens live in [`src/theme/main.ts`](src/theme/main.ts). Import from there — do not hardcode colors or random padding in screens.

### Palette (most used first)

| Name | Hex | Use |
| --- | --- | --- |
| Ivory | `#E4E3D0` | App background |
| Blue Grotto | `#2673C0` | Primary / active tab / brand wordmark |
| Rose Quartz | `#E17A70` | Swipe heart accent |
| Blue Iris | `#504F80` | Titles, inactive chrome, desktop backdrop |

### Layout

- Baseline device: **iPhone 16e** (390 x 844).
- Type and spacing scale with screen width via `useFluidSize` / `fluidSize`.
- On computer / wide windows, content is capped at **440pt** and centered so it still reads like a phone.
- **Safe zone**: top + left + right use device insets. The bottom tab bar owns the home indicator. On web, safe area is CSS in `src/app/+html.tsx`.

### Reset

No decorative borders, list bullets/dots, hairlines, or default padding beyond the safe zone. Spread `reset` from the theme into new styles instead of inventing chrome.

### Screens

Shared shell: [`src/components/Screen.tsx`](src/components/Screen.tsx). Tab routes:

- `src/app/(tabs)/swipe.tsx`
- `src/app/(tabs)/messages.tsx`
- `src/app/(tabs)/profile.tsx`
