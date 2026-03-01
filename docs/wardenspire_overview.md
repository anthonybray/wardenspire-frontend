Wardenspire
A Multi-Agency Operational Intelligence Platform for Town & City Centres
Core Concept
Wardenspire is a shared, map-based operational intelligence platform designed to provide a real-time, common operating picture for town and city centre stakeholders — including Rangers, Police, Council teams, Business Improvement Districts (BIDs), and other authorised partners.
It enables designated users to log, view, and analyse incidents, observations, and environmental issues through a secure interactive dashboard. All information is geospatially anchored using standard GPS coordinates and structured data fields, ensuring accuracy, auditability, and interoperability with existing public-sector systems.
Wardenspire is built to be replicable across multiple towns and cities, using a configurable framework rather than a one-off bespoke system.

Purpose
Wardenspire exists to:
* Improve situational awareness across agencies
* Reduce duplication of effort
* Identify emerging hotspots early
* Support lawful, proportionate operational responses
* Provide defensible audit trails
* Turn patrol observations into actionable intelligence
It creates a shared digital layer over the physical town centre.

Core Functionality (Version 1 – Operational Foundation)
1️⃣ Live Interactive Map
* GPS-based pin placement (auto-captured from device)
* Manual pin refinement for precision
* Time-stamped, user-attributed entries
* Category-tagged incidents (ASB, welfare, environmental, retail, safeguarding, etc.)
* Heatmap view for trend identification
* Geofenced overlays (e.g., PSPO boundary, hotspot zones)
This provides a real-time operational picture.

2️⃣ Structured Incident Logging
Each entry includes:
* Date & time (auto-generated)
* Exact coordinates (lat/long stored)
* Category
* Objective description
* Optional media upload (photo/video reference)
* Status (Open / Monitored / Referred / Closed)
* Visibility level (role-based permissions)
Structured data prevents vague, narrative-heavy entries and protects evidential integrity.

### Tenant-controlled incident categories

Wardenspire does **not** hard-code incident categories globally. Instead:

- Each **Tenant** has its own configurable set of **Incident Categories** (e.g. Environmental, ASB, Welfare, Retail, Other).
- Categories are stored in a first-class `incident_categories` table (per-tenant taxonomy), not buried in free-text.
- The **field reporter** (PWA) and the **HQ dashboard** always draw their category dropdowns from that tenant's active list.
- The backend validates incident creation against that list for the tenant, so invalid or legacy categories cannot be logged.

This allows:

- Suggested defaults for a new Tenant (a small starter set of categories).
- Full control for each Tenant to add, rename, or retire categories later, without code changes.
- Future governance (role-based visibility per category, reporting by category family, etc.).

3️⃣ Role-Based Access Control
Not all users see all data.
Example permission layers:
* Rangers – operational entries & patrol intelligence
* Police – full incident + pattern access
* Council – environmental, cleansing, licensing-related entries
* BID – retail impact layer
* Admin – audit and data governance
Sensitive information is compartmentalised.

4️⃣ Audit & Evidential Integrity
Wardenspire is not social media — it is operational infrastructure.
* Immutable timestamps
* Entry edit history logged
* User ID attribution
* Exportable PDF case packs
* API-ready data exports
* Secure storage compliant with public sector standards
This makes it defensible if ever scrutinised.

Third-Party API Layer (Optional Intelligence Overlay)
Wardenspire can integrate aggregated third-party data streams as contextual overlays, for example:
* Weather data (impact on footfall / behaviour)
* Transport disruptions
* Event schedules
* CCTV system metadata
* Licensing data
* Public footfall counters
* Police open-data feeds (where appropriate)
* Environmental sensors
These layers do not replace operational reporting — they enhance situational awareness.
Critically:
* External data remains separate from primary incident logs.
* Core operational data remains internally controlled.

Version 2 – Intelligence & Patterning
Once sufficient data exists, Wardenspire evolves from logging tool to intelligence engine.
Potential enhancements:
* Repeat location detection
* Time-of-day pattern alerts
* Repeat behaviour flagging (subject to governance rules)
* Automated "3 incidents in 2 hours" hotspot alerts
* Briefing dashboard for daily deployments
* Predictive resourcing insights (data-led patrol allocation)
The system moves from reactive to anticipatory.

Replicability Model
Wardenspire is built as a configurable civic platform.
Each town configures:
* Geographic boundaries
* Hotspot zones
* Incident categories
* User roles
* Reporting standards
* Local enforcement overlays
The engine remains constant.
This allows:
* National scalability
* Local autonomy
* Consistent governance structure
* Shared best-practice learning

Strategic Positioning
Wardenspire is not:
* A police replacement system
* A dispatch system
* A public reporting app
* A social platform
It is:
A structured, professional, shared operational intelligence layer for town-centre management.

Why It Matters
Town centres are dynamic environments where:
* Rangers observe issues first
* Retailers feel impact early
* Council teams respond to environmental decline
* Police address enforcement
* BID monitors economic impact
Currently, intelligence is fragmented across emails, WhatsApp groups, spreadsheets, body-worn video, and memory.
Wardenspire centralises and structures that flow.

The Strategic Value Proposition
Wardenspire creates:
* Faster multi-agency awareness
* Measurable hotspot identification
* Transparent activity tracking
* Defensible reporting standards
* Data-driven deployment decisions
* Scalable urban safety infrastructure
It turns frontline observations into coordinated action.

escribing civic operational infrastructure.


🏛 Wardenspire – Product Architecture Expansion
Phase 1 – V1 (Operational Foundation)
🔹 Core Philosophy
* Browser = Intelligence & Coordination
* Mobile PWA = Fast Capture & Field Updates
* Build lean.
* Prove value quickly.
* Avoid feature bloat.

🖥 V1 – Browser Dashboard (Command & Control Layer)
This is where supervisors, police, council leads and BID managers live.
1️⃣ Live Operational Map
* Real-time pins
* Filter by category (ASB, Welfare, Environmental, Retail, Safeguarding)
* Time filters (Last 2h / 24h / 7 days)
* Status filters (Open / Assigned / Closed)
* Heatmap toggle
* Geofenced overlays (PSPO, hotspot zones)
This becomes the "Town Centre Operating Picture."

2️⃣ Incident Detail Panel
Clicking a pin shows:
* Timestamp
* User
* Coordinates
* Description
* Photos
* Status history
* Linked incidents (if any)
* Assigned team / person
Audit trail always visible.

3️⃣ Tasking & Workflow
* Convert incident → task
* Assign to:
    * Ranger
    * Council cleansing
    * Licensing
    * Police liaison
* Set priority
* Mark resolved
* Add update notes
This is where multi-agency coordination becomes real.

4️⃣ Daily Briefing View
Auto-generated dashboard:
* Top 5 hotspots (last 7 days)
* Repeat locations
* Open high-priority incidents
* Repeat behavioural flags (governance controlled)
* Environmental backlog
This gives supervisors data-driven patrol planning.

5️⃣ Admin & Governance Layer
* Role-based permissions
* Category management
* Boundary management
* Data retention settings
* Audit logs
* Export functions
This is critical for police/council buy-in.

📱 V1 – Mobile PWA (Capture-First)
This must be frictionless.
Ranger / Field User Experience
Home Screen
* ➕ New Entry
* 📍 Map View (Nearby activity)
* ✅ My Tasks
* 🔔 Notifications

New Entry Flow (Must take < 20 seconds)
1. GPS auto-captured
2. Select category
3. Short factual description
4. Add photo (optional)
5. Submit
Done.
No long narrative.No complex menus.

Map View (Simplified)
* See nearby open incidents
* Colour-coded by category
* Tap to view summary
* No deep analytics (that's desktop)

My Tasks
* Assigned tasks list
* Update status
* Add short update note
* Mark complete

Phase 2 – V2 (Field Intelligence Enhancement)
Only expand mobile where it improves patrol efficiency.

📱 V2 Mobile Enhancements
1️⃣ Patrol Heat Indicator
Simple visual cue:
* 🟢 Low activity
* 🟡 Moderate
* 🔴 High repeat incidents
Not detailed heatmaps — just tactical awareness.

2️⃣ Quick Brief Mode
Before patrol:
* Today's hotspot areas
* Key active issues
* Priority watch areas
* Environmental backlog
5-minute digest. Not a report.

3️⃣ Pattern Nudges (Controlled)
Example:"3 ASB incidents logged here in last 2 hours."
This supports proactive presence.

4️⃣ Smart Re-Logging
If user logs in same 10m zone:System suggests:"Similar incident logged earlier. Link?"
Prevents duplicate clutter.

Technical Architecture Approach
Core Principles
* Store Lat/Long (open standard)
* Modular API backend
* Cloud-hosted (public sector compliant)
* Encrypted at rest and in transit
* Immutable logging for audit
Mobile Strategy
* PWA first (cheaper, faster rollout)
* Native app later only if:
    * Deep offline needed
    * Advanced camera integration required
    * Push notification scaling demands it

Multi-Town Replication Model
Each town gets:
* Custom boundary
* Custom categories
* Custom roles
* Local branding layer (optional)
Backend remains unified.
You create:
* A scalable civic infrastructure product.
* Not a bespoke Shrewsbury-only system.

The Strategic Power of This Model
Wardenspire becomes:
* A coordination engine
* A pattern recognition engine
* A tasking engine
* A governance-compliant data layer
* A multi-agency trust platform
It bridges frontline observation and strategic decision-making.

——————————

Yes — exactly.
What you've built so far defines:
* The product
* The features
* The architecture
* The commercial scalability
What we now need to formally add is the Zone Architecture Layer — because that is what future-proofs the whole system and aligns with your national licensing ambition.
Below is the section you should insert after Multi-Town Replication Model.

🗺 Zone Architecture Model
Core Structural Principle
At its foundation, Wardenspire is built around Configurable Operational Zones.
A Zone is a defined geographic polygon within a licensed tenant environment. All incidents, tasks, overlays, and analytics are anchored to a specific Zone.
This allows the platform to move beyond the concept of a single "town centre" while maintaining operational clarity and scalability.

Why Zones Matter
Zones allow Wardenspire to:
* Operate in cities with multiple town centres
* Support borough-level deployments
* Separate operational areas within one authority
* Compare activity across different areas
* Introduce temporary operational footprints
* Expand beyond traditional high streets if required
The system remains focused, but not geographically restricted.

Zone Hierarchy Structure
Tenant (Organisation)│└── Zones     ├── Primary Town Centre     ├── Secondary High Street     ├── Night-Time Economy Area     ├── Transport Hub     ├── Regeneration Corridor     └── Event Perimeter (Temporary)
Each Zone has:
* Defined geographic boundary
* Custom overlays (e.g., PSPO, licensing, CCTV clusters)
* Zone-specific heatmaps
* Zone-specific task visibility (if configured)
* Zone-specific reporting output

Static vs Dynamic Zones
Static Zones
* Created by administrators
* Long-term operational areas
* Used for ongoing monitoring and reporting
* Most common deployment type
Dynamic Zones (Future Expansion)
* Created for:
    * Events
    * Protests
    * Seasonal operations
    * Temporary dispersal areas
* Time-bound
* Automatically archive when expired
Dynamic zones introduce high operational value but are phased for later implementation.

Zone-Based Permissions
Permissions can operate at:
* Tenant-wide level
* Zone level
* Role level
Example:
* Rangers assigned to Zone A do not automatically see sensitive logs in Zone B.
* Police supervisors may view all zones.
* Council cleansing team may only access environmental entries within selected zones.
This strengthens governance and commercial flexibility.

Zone-Level Analytics
Analytics can be generated:
* Per Zone
* Cross-Zone
* Time-based comparisons (Week-on-week per zone)
* Seasonal variation analysis
This enables:
* Evidence-based funding allocation
* Targeted patrol planning
* Measurable impact reporting
* Transparent performance metrics

Market Framing vs Product Architecture
Externally, Wardenspire is positioned as:
A Multi-Agency Operational Intelligence Platform for Town & City Centres.
Internally, the system is built as:
A Multi-Zone Geospatial Operational Intelligence Platform.
This separation ensures:
* Clear commercial messaging
* Maximum scalability
* No geographic lock-in
* Global adaptability

Strategic Evolution Path
With Zones in place, Wardenspire can naturally evolve into:
* Cross-zone comparative dashboards
* Borough-wide coordination models
* Regional federation layer (future)
* Multi-tenant aggregation for national reporting (long-term)
The Zone architecture is what enables Wardenspire to grow from:
Local operational tool→ Borough platform→ National civic infrastructure product.

---

Known Gaps and Roadmap

Phase 1 (foundational zones) is implemented. Six priority gaps remain between the current codebase and a platform credible for first multi-agency engagement:

1. Authentication and user identity
2. Audit trail and edit history
3. Data governance, retention, and UK GDPR compliance
4. Offline PWA support
5. Media / file storage
6. Notification system

See [roadmap.md](roadmap.md) for the full breakdown of each gap, what it involves, which files are affected, and the dependency order for implementation.
