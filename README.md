# CampusMess Hub 🌿

**CampusMess Hub** is a 100% Pure Vegetarian Hostel Mess Management web application built with React, TypeScript, Tailwind CSS, and Lucide icons.

## Features
- **Pure Vegetarian Weekly Menu**: 7-day cyclical breakfast, lunch, snacks, and dinner schedules with allergen badges, nutritional macros, and dietary filtering.
- **Smart QR Attendance**: Digital mess tokens with dynamic verification codes, live countdown timer, and quick scanning.
- **Academic Block Lunch Parcels**: Instant WhatsApp orders for late laboratory and lecture deliveries.
- **Anonymous Student Pulse**: Star ratings, feedback tags, and suggestions with anonymous identity protection.
- **Staff Operations Console**: Real-time meal counter, live headcounts, dietary demand analytics, student pass status management, and menu item editor.

---

## Deploying to GitHub Pages

Follow these steps to deploy this application to GitHub Pages:

### 1. Update `vite.config.ts`
Open `vite.config.ts` and replace `'/REPLACE_WITH_REPO_NAME/'` with your repository name:
```ts
// Example: If your GitHub repo is https://github.com/username/campus-mess-hub
base: command === 'serve' ? '/' : '/campus-mess-hub/',
```

### 2. Deploy
Run the deploy script from your terminal:
```bash
npm run deploy
```
*(This will automatically execute `npm run build` and push the compiled `dist` folder to the `gh-pages` branch).*

### 3. Enable GitHub Pages in Repository Settings
1. Go to your GitHub repository on [GitHub.com](https://github.com).
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `gh-pages` / `/ (root)`
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/` in a couple of minutes!
