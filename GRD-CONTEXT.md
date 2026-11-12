# THE GRID GAMING LOUNGE — MASTER CONTEXT & UI RULES FOR AGENT

## 1. STRICT COPYWRITING & UI RULES (READ FIRST)
- **STOP USING ROBOTIC / DEVELOPER JARGON IN THE UI**:
  - Remove repetitive phrases like `"0% Platform Fee"`, `"100% Secure UPI Checkout via Cashfree"`, `"Instant QR Pass via Fast2SMS"`, `"300-Second Socket Lock"`, and `"Real-time Desk Sync"` from cards, badges, and headings.
  - Speak like a modern, welcoming gaming lounge for gamers in Kannur. Use natural, simple copy (e.g., `"Book Your Screen"`, `"Instant Booking Confirmation"`, `"Pay Online"`).
- **STOP INVENTING FAKE HARDWARE**:
  - Do NOT mention `"PS5 Pro"`, `"6 PS5 Stations"`, `"75-inch VIP Booth"`, or `"Triple 32-inch Monitors"`. We do NOT have those. Use ONLY the real shop setup defined below and in `src/data/gridData.json`.
- **ASK BEFORE ASSUMING**:
  - Whenever you build or modify a section and aren't 100% sure about a shop detail, ask the user first before writing placeholder specs.

---

## 2. REAL SHOP SETUP & HARDWARE
- **Name**: The Grid Gaming Lounge (`thegridgaming.fun`)
- **Location**: Ground Floor, Town Square, Thondiyil, Peravoor, Kannur, Kerala
- **Timings**: Open Every Day (Mon–Sun), **10:00 AM to 10:00 PM**
- **Contact Numbers**:
  - **Primary / Call**: `+91 94472 27250`
  - **Official WhatsApp**: `+91 8075 983 910`
- **Lounge Comfort & Gear**:
  - Fully Air-Conditioned (AC) Lounge
  - **7 DualSense Controllers** total
  - **2 Sofas + 4 Bean Bags**

### Our 3 Screens (Crucial: Customers cannot switch screens after booking, so show each screen's exact TV & games clearly!)
1. **`Screen1` (Screen 1)**:
   - **Hardware**: 55" TCL 4K TV + PS5 Disc Edition
   - **Installed Games**: Forza Horizon 5, Mortal Kombat, A Way Out, FC 26, Far Cry 6, Astro’s Playroom, eFootball
2. **`Screen2` (Screen 2)**:
   - **Hardware**: 43" TCL 4K TV + PS5 Disc Edition
   - **Installed Games**: Grand Theft Auto V, WWE 2K24, FC 27 Lite, God of War: Ragnarök, The Last of Us Part I, Cricket 24, Gran Turismo 7
3. **`Screen3` (Screen 3)**:
   - **Hardware**: 43" TCL 4K TV + PS5 Slim + **SimDrive Setup** (**Logitech G923 Racing Wheel & Pedals** with **TRONE RS1 Aero Black Racing Simulator Gaming Chair with Adjustable Cockpit**)
   - **Flexibility Note**: Screen 3 can be booked for **SimDrive** racing OR normal controller gaming (e.g., if Screen 1 and 2 are full, customers can play GTA V, Spider-Man 2, FC 26, etc. on Screen 3 with controllers).
   - **Installed Games**: Grand Theft Auto V, Marvel’s Spider-Man 2, Forza Horizon 5, Ghost of Tsushima, WWE 2K24, Mortal Kombat, FC 26, Astro’s Playroom

---

## 3. REAL PRICING MATRIX (`DEFAULT_MATRIX`)
"Single", "Dual", "Triple", and "Big" represent **how many players** are playing, NOT different rooms:
- **Single (1 Player)**:
  - Sessions: `15m: ₹50` | `30m: ₹90` | `60m: ₹160`
  - Extensions: `15m: ₹50` | `30m: ₹80` | `60m: ₹130`
- **Dual (2 Players)**:
  - Sessions: `15m: ₹80` | `30m: ₹140` | `60m: ₹250`
  - Extensions: `15m: ₹80` | `30m: ₹120` | `60m: ₹190`
- **Triple (3 Players)**:
  - Sessions: `15m: ₹100` | `30m: ₹180` | `60m: ₹310`
  - Extensions: `15m: ₹100` | `30m: ₹160` | `60m: ₹270`
- **Big (4 Players)**:
  - Sessions: `15m: ₹120` | `30m: ₹220` | `60m: ₹380`
  - Extensions: `15m: ₹120` | `30m: ₹200` | `60m: ₹340`
- **SimDrive (1 Player — Logitech G923 + TRONE RS1 Cockpit)**:
  - Sessions: `15m: ₹90` | `30m: ₹170` | `60m: ₹290`
  - Extensions: `15m: ₹80` | `30m: ₹150` | `60m: ₹260`
- **GTA 6 — Launch Special (First 7 Days Exclusive)**:
  - Sessions: `30m: ₹150` | `60m: ₹250` *(15 minutes is NOT offered for GTA 6)*
  - Extensions: `30m: ₹130` | `60m: ₹230`

---

## 4. HOW THE BOOKING PAGE (`/book`) MUST WORK
Make the Booking Page **super clean, intuitive, and user-friendly** (avoid edgy/confusing brutalist clutter here):
1. **Step 1 — Pick Your Screen (`Screen 1`, `Screen 2`, or `Screen 3`)**:
   - Display 3 clear cards for **Screen 1 (55" TV)**, **Screen 2 (43" TV)**, and **Screen 3 (43" TV + SimDrive Cockpit)**.
   - **Crucial**: Inside each Screen card (or immediately below it when selected), show the **exact list of games installed on that screen** as clean badges/chips so the customer knows which games are on that screen before booking (since screens cannot be changed after booking).
2. **Step 2 — Pick Your Mode & Player Count**:
   - Let the user pick `Single (1P)`, `Dual (2P)`, `Triple (3P)`, `Big (4P)`, `SimDrive` (available when Screen 3 is selected, or auto-selects Screen 3), or `GTA 6 Launch Special`.
3. **Step 3 — Pick Duration (`15 Mins`, `30 Mins`, `1 Hour`)**:
   - If `GTA 6 Launch Special` is selected, only show `30 Mins (₹150)` and `1 Hour (₹250)`.
4. **Step 4 — Pick Date & Time Slot (10:00 AM – 10:00 PM)**:
   - Clean, easy-to-tap time slot buttons showing available vs. booked times.
5. **Simple Checkout Summary**:
   - Show selected Screen, Mode, Duration, Time Slot, and Total Price (`₹`), with a single clean **"Pay & Confirm Booking"** button.