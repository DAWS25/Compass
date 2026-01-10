# PRESENÇA — Next.js Web App
**Goal:** Build a browser-first local discovery app centered around maps, camera functionality, and real-time presence.

---

## 0. Tech Baseline (Initial Setup)
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Map Engine:** Mapbox or Leaflet
* **APIs:** Native Browser Camera + Geolocation

---

## 1. Project Architecture & Routing
**Objective:** Establish the application shell and navigation structure.

### Tasks
- [ ] Create Next.js app via `npx create-next-app@latest`
- [ ] Install and initialize Tailwind CSS
- [ ] Set up global layout (Navbar/Navigation constraints)
- [ ] Scaffold all primary routes

### Routes to Create
| Route | Purpose |
| :--- | :--- |
| `/` | Main Map / Home |
| `/capture` | Camera interface for adding places |
| `/place/[id]` | Detailed view for a specific location |
| `/event/create` | Form to host a temporary event |
| `/profile` | User presence and activity stats |
| `/marketplace` | Local services and used goods |
| `/assistant` | AI-driven discovery chat |

**Done when:** All routes load with a placeholder UI.

---

## 2. Design System & Tokens
**Objective:** Ensure visual consistency through a unified theme.

### Tasks
- [ ] Define color tokens (Primary gradient, Accent, Backgrounds)
- [ ] Define typography and font styles
- [ ] Configure `tailwind.config.js` with custom tokens
- [ ] Create base button and input styles

**Done when:** Buttons, text, and backgrounds use shared tokens only.

---

## 3. Atomic Component Library
**Objective:** Build reusable UI blocks before implementing screen logic.

### Components
* `<MapCanvas />` — The base map layer
* `<FloatingActionButton />` — Primary action (Camera/Add)
* `<BottomSheet />` — Slide-up panel for details
* `<PresenceBadge />` — Real-time activity indicator
* `<Card />`, `<Chip />`, `<PrimaryButton />`, `<SecondaryButton />`

**Done when:** Components render with mock data and no screen-specific logic.

---

## 4. Screen Implementation

### Phase 4: Home (The Map)
* **Route:** `/`
* **Tasks:** Render full-screen map, show user location, add UI filter chips.
* **Interaction:** Clicking a marker must trigger the `<BottomSheet />`.
* **Done when:** Map works visually and BottomSheet opens from marker tap.

### Phase 5: Capture (Add Place)
* **Route:** `/capture`
* **Tasks:** Implement `MediaDevices` API for camera access, photo capture, and preview.
* **Logic:** Mock an AI response that "identifies" the place category/name.
* **Done when:** User can take a photo and confirm a place (mocked).

### Phase 6: Place Detail
* **Route:** `/place/[id]`
* **Tasks:** Dynamic route to show place image, address, and "Presence Score."
* **Components:** Include an "I'm here" button and a mock review feed.
* **Done when:** Dynamic route renders a complete place detail UI.

### Phase 7: Create Event
* **Route:** `/event/create`
* **Tasks:** Build form for Event Type, Time, and Location.
* **Rule:** Events are "Temporary" by default.
* **Done when:** Form works visually and submits mocked data.

### Phase 8: Profile & Marketplace
* **Profile (`/profile`):** Display "Presence Score" and "Places Visited" count.
* **Marketplace (`/marketplace`):** Implement tabbed navigation (Services vs. Used Goods) with item cards.
* **Done when:** Both screens display structured mock data accurately.

### Phase 9: Assistant (Optional)
* **Route:** `/assistant`
* **Tasks:** Chat input UI, suggested questions, recommendation cards.
* **Done when:** Assistant UI works without backend logic.

---

## 5. Integration Phase (Later)
**Only proceed once all UIs are 100% complete.**

1.  **Real Map Data:** Connect to live location services.
2.  **Backend API:** Set up database persistence (Supabase/Firebase).
3.  **AI Classification:** Integrate real image recognition.
4.  **Presence Logic:** Implement "I'm here" expiration and heatmaps.