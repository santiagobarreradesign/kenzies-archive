<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>KENZIE'S<br />
PICKLE ARMY</strong></p>
<p>Product Concept, Experience Design &amp; Build Specification</p>
<p><strong>LONG LIVE KENZIE.</strong></p>
<p>A collaborative birthday world where every friend creates a recruit,
leaves a message, and adds one more pickle to Kenzie's growing
army.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**OVERVIEW**

# Project Snapshot

Kenzie's Pickle Army is a small social birthday game disguised as an
absurd military recruitment campaign. Friends do not simply sign a
guestbook: they build a unique pickle recruit, give it a name and
division, attach a real birthday message, and enlist it into a shared
army that grows over time.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Core product loop</strong></p>
<p>Recruit -&gt; Create -&gt; Write -&gt; Enlist -&gt; Explore -&gt;
Kenzie arrives -&gt; Inspect -&gt; Promote -&gt; Command the
parade.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

| **Area**       | **Decision**                                                 |
|----------------|--------------------------------------------------------------|
| Experience     | Interactive social birthday game, not a static birthday page |
| Primary object | Recruit - one personalized pickle created by one friend      |
| Frontend       | React + Vite + React Router                                  |
| Backend        | Supabase Postgres + Realtime + Auth + Row Level Security     |
| Hosting        | GitHub -\> Vercel                                            |
| Animation      | CSS + Framer Motion; GSAP optional for the final parade      |
| Art system     | Reusable layered SVG assets; no AI image generation required |
| Guest accounts | None required; low-friction anonymous contribution           |
| Kenzie access  | Authenticated Commander Mode with unique permissions         |

## The One-Sentence Pitch

**Before Kenzie's birthday, her friends secretly assemble an army of
personalized pickle characters; each recruit carries a birthday message,
and when Kenzie arrives she discovers, inspects, promotes and ultimately
commands the army built for her.**

## Design Principles

- The army must feel alive before the visitor touches anything.

- Every message must belong to a character, not to a generic card.

- Creating a recruit should take only a few minutes and require no
  account.

- Kenzie must have meaningful powers that ordinary visitors do not have.

- The joke sits on the surface; the emotional birthday messages remain
  sincere.

- The system should be technically simple enough to ship quickly and
  reliably.

**DOCUMENT MAP**

# Contents

| **Section** | **What it covers**               |
|-------------|----------------------------------|
| 01          | Product story and world          |
| 02          | Experience model                 |
| 03          | Visitor journey                  |
| 04          | The Pickle Builder               |
| 05          | The living army                  |
| 06          | Recruit dossiers and messages    |
| 07          | Commander Kenzie                 |
| 08          | The birthday parade              |
| 09          | Visual and interaction direction |
| 10          | Content and dialogue system      |
| 11          | Technical architecture           |
| 12          | Data model and security          |
| 13          | Frontend component architecture  |
| 14          | Asset production plan            |
| 15          | Deployment and launch            |
| 16          | MVP, roadmap and build sequence  |
| 17          | QA and launch checklist          |

**CONCEPT**

# 1. Product Story and World

Kenzie's birthday is approaching. For reasons the site never fully
explains, a military force made entirely of pickles has begun
assembling. Their mission is equally ridiculous and sincere: protect
Kenzie, celebrate Kenzie, protect the cake, and keep morale dangerously
high.

Each person invited to the site is asked to contribute one recruit. The
site therefore becomes more complete with every visitor. By the time
Kenzie opens it, the emotional reveal is not a hero banner or a
prewritten birthday card. It is the sight of an entire crowd of
characters made by people who care about her.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Narrative rule</strong></p>
<p>The military framing should always be playful and obviously
fictional. The language is absurdly serious about very unserious pickle
operations.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## World Language

| **Normal website term** | **Pickle Army version**           |
|-------------------------|-----------------------------------|
| Home                    | Headquarters                      |
| Create                  | Enlist a Recruit                  |
| Gallery                 | Parade Grounds / The Army         |
| Profile                 | Recruit Dossier                   |
| Message                 | Transmission for Commander Kenzie |
| Category                | Division                          |
| Submit                  | Enlist                            |
| Admin                   | Commander Access                  |
| Favorite                | Commander's Favorite              |
| Tag / badge             | Medal / Honorary Title            |

## Opening Story Beat

The first visit should immediately communicate that the site is already
active. The army appears in the scene behind the interface, and
occasional speech bubbles make the world feel inhabited. The main copy
is intentionally concise:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Landing copy direction</strong></p>
<p>KENZIE'S PICKLE ARMY<br />
Birthday Defense Force<br />
<br />
The Commander's birthday approaches. The army requires
reinforcements.<br />
<br />
[JOIN THE ARMY] [VIEW THE ARMY]</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**BEHAVIOR**

# 2. Experience Model

The website has two connected modes: the public recruitment experience
for friends and the private Commander experience for Kenzie. Both use
the same persistent army, but they expose different actions and copy.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>01 Arrive</strong> - See a living army and understand
that each recruit represents a real person.</p>
<p><strong>02 Choose</strong> - Join the Army or browse existing
recruits.</p>
<p><strong>03 Create</strong> - Build one pickle from reusable visual
parts.</p>
<p><strong>04 Write</strong> - Attach a real birthday transmission to
that recruit.</p>
<p><strong>05 Enlist</strong> - Submit; the recruit receives a ceremony
and joins the shared world.</p>
<p><strong>06 Explore</strong> - Open other recruits and read their
messages.</p>
<p><strong>07 Commander arrival</strong> - Kenzie signs in and the
interface recognizes her as the Commander.</p>
<p><strong>08 Inspect and promote</strong> - Kenzie can favorite, award
medals, and assign honorary titles.</p>
<p><strong>09 Parade</strong> - Kenzie triggers the final birthday
sequence with the whole army.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Site Structure

| **Route**    | **Purpose**                                       | **Access**  |
|--------------|---------------------------------------------------|-------------|
| /            | Headquarters and primary entry point              | Public      |
| /recruit     | Pickle Builder and enlistment flow                | Public      |
| /army        | Interactive shared army / parade grounds          | Public      |
| /recruit/:id | Deep-linkable recruit dossier                     | Public      |
| /commander   | Commander arrival, inspection and special actions | Kenzie only |

**PUBLIC FLOW**

# 3. Visitor Journey

## A. Headquarters

The visitor lands directly in the world. A live recruit count
communicates social proof. Behind the headline, existing pickles idle,
march, salute, sleep, argue, or shout short slogans. The visitor should
understand the premise without reading a long explanation.

- Primary CTA: JOIN THE ARMY

- Secondary CTA: VIEW THE ARMY

- Small tertiary link: COMMANDER ACCESS

## B. Recruitment Office

The builder feels closer to an old Flash dress-up game or character
creator than a form. The pickle preview is always visible while the
visitor changes parts. Copy keeps the fiction alive, but the controls
remain obvious and accessible.

## C. Enlistment Ceremony

Submission should feel consequential. The recruit stands at attention,
receives an APPROVED or ENLISTED stamp, and is introduced by name.
Returning to the army should animate that exact recruit entering the
formation rather than simply refreshing a grid.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Key emotional moment</strong></p>
<p>The visitor sees something they made become a permanent part of
Kenzie's birthday world.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## D. Exploration

After enlisting, visitors can browse the rest of the army. The full
birthday messages are visible by opening recruit dossiers. This turns
the project into a collaborative birthday card rather than a private
form that disappears after submission.

**CREATION SYSTEM**

# 4. The Pickle Builder

Do not generate a custom image for each recruit. The builder composes
predefined SVG layers and stores only the selected options. This keeps
the project fast, consistent, cheap and visually controllable while
still allowing thousands of combinations.

## Customization Categories

| **Layer** | **Recommended v1 range** | **Examples**                                   |
|-----------|--------------------------|------------------------------------------------|
| Body      | 5-7                      | Tall, stubby, chunky, tiny, curved             |
| Eyes      | 6-8                      | Normal, sparkle, angry, sleepy, blank stare    |
| Mouth     | 5-6                      | Smile, smug, scream, tiny smile                |
| Hat       | 8-12                     | Cowboy, crown, party, wizard, helmet, bow      |
| Accessory | 8-12                     | Sword, cake, flowers, shield, wand, tiny purse |
| Color     | 4-6                      | Classic, light, dark, spicy, pastel, gold      |
| Effect    | 0-4 optional             | Sparkles, aura, tiny hearts                    |

## Recruit Metadata

- Creator name - the friend who made the recruit.

- Pickle name - e.g. Sir Dilliam, Brineonce, Captain Crunch.

- Division - determines identity and can influence behavior.

- Battle cry - a short silly phrase; optionally randomizable.

- Birthday transmission - the real message for Kenzie.

## Divisions

| **Division**               | **World purpose**        | **Behavior idea**                  |
|----------------------------|--------------------------|------------------------------------|
| Royal Brine Guard          | Protect Commander Kenzie | Salutes; more formal dialogue      |
| Emotional Support Division | Maintain morale          | Waves; heart reactions             |
| Cake Protection Unit       | Secure the cake          | Carries cake tools; security lines |
| Chaos Division             | Responsibilities unclear | Falls over; bizarre dialogue       |
| Party Operations           | Responsible for vibes    | Dances; confetti reactions         |
| Snack Battalion            | Critical logistics       | Carries snacks; inventory jokes    |
| Magical Forces             | Unlicensed magic         | Sparkles; spell-like effects       |
| Special Pickle Unit        | Classified               | Rare or mysterious behavior        |

**SHARED WORLD**

# 5. The Living Army

The Army view is the visual heart of the website. It should read as a
crowd of individual characters, not simply as a database rendered in
cards. A normal list or grid can exist as an accessibility fallback, but
the primary scene should feel like a parade ground populated by living
recruits.

## Ambient Behavior

- Idle bounce or breathing.

- Blinking.

- Saluting.

- Waving.

- Sleeping.

- Looking around.

- Falling over and recovering.

- Division-specific idle actions.

- Occasional speech bubbles.

- Small group chants during special moments.

## Realtime Reinforcements

Supabase Realtime can subscribe to newly inserted recruits. When someone
submits a pickle while another visitor is already watching the army, the
site can show NEW REINFORCEMENTS HAVE ARRIVED and animate that recruit
entering the formation. No page refresh is required.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Important performance rule</strong></p>
<p>Do not run expensive animation on every recruit at once. Animate
lightweight CSS idle states and rotate richer behaviors among a small
number of visible recruits.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Army Layout

For v1, use deterministic or semi-random formation slots rather than
game physics. The scene can distribute recruits into rows, introduce
small positional offsets, and allow slight movement around each assigned
slot. This is enough to create character without requiring Phaser, WebGL
or a physics engine.

**GUESTBOOK REPLACEMENT**

# 6. Recruit Dossiers and Messages

Every birthday message belongs to a recruit. Clicking a pickle brings it
forward and opens a dossier. This is the key interaction that transforms
the project from a themed guestbook into an actual character-based
social experience.

## Recommended Dossier Content

- Recruit name and large character view.

- Division.

- Enlisted by \[friend name\].

- Battle cry.

- Playful generated stats such as Loyalty, Chaos, Brine and Bravery.

- Transmission for Commander Kenzie - the actual birthday message.

- Commander-awarded medal or honorary title after Kenzie has interacted
  with the recruit.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Deep linking</strong></p>
<p>Each recruit should have a permanent route such as /recruit/uuid so a
friend can share the exact pickle they created.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**SPECIAL EXPERIENCE**

# 7. Commander Kenzie

Kenzie should not experience the website as another visitor. Commander
Mode changes the language, permissions and emotional framing. Her
arrival is the reveal that the entire army has been assembled
specifically for her.

## First Commander Arrival

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>01 Commander detected</strong> - A short takeover
sequence begins after authentication.</p>
<p><strong>02 Identity confirmed</strong> - The interface explicitly
recognizes Kenzie.</p>
<p><strong>03 Reveal</strong> - The existing army appears in full.</p>
<p><strong>04 Army response</strong> - Recruits chant LONG LIVE KENZIE
or salute simultaneously.</p>
<p><strong>05 Inspection begins</strong> - Kenzie can now open, promote
and decorate recruits.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Commander Powers

| **Action**     | **What Kenzie does**                   | **What everyone later sees**     |
|----------------|----------------------------------------|----------------------------------|
| Favorite       | Marks a recruit as a personal favorite | Commander's Favorite badge       |
| Award medal    | Chooses a playful medal                | Medal displayed on dossier       |
| Promote        | Assigns a higher honorary rank         | Promoted by Commander Kenzie     |
| Custom title   | Writes a ridiculous role/title         | Permanent title on recruit       |
| Inspect        | Reads a transmission                   | Optional viewed state / progress |
| Command parade | Triggers final sequence                | Birthday finale                  |

## Suggested Medals

- Distinguished Bravery

- Best Dressed

- Maximum Chaos

- Commander's Favorite

- Exceptional Service

- Defender of Cake

- Deeply Concerning

**FINALE**

# 8. The Birthday Parade

The parade is the final shared payoff and should be the largest
choreographed moment in the experience. Only Kenzie can trigger it.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>01 Attention all units</strong> - The interface announces
an army-wide command.</p>
<p><strong>02 Formation</strong> - Recruits move into organized rows or
another simple composition.</p>
<p><strong>03 March</strong> - The army begins a coordinated movement
sequence.</p>
<p><strong>04 Chants</strong> - Individual battle cries mix with
army-wide LONG LIVE KENZIE chants.</p>
<p><strong>05 Celebration</strong> - Cake, confetti and birthday
messaging take over the scene.</p>
<p><strong>06 Final message</strong> - HAPPY BIRTHDAY,
COMMANDER.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

Framer Motion can handle a restrained version. If you want complex
sequencing such as the army forming a K or heart, GSAP is a sensible
optional addition for this section only.

**ART DIRECTION**

# 9. Visual and Interaction Direction

The recommended direction is cute commander world + collectible
character cards: a polished, slightly storybook environment with
intentionally over-serious military UI language. It should feel handmade
and playful rather than tactical or realistic.

## Visual Attributes

- Soft illustrated environment rather than realistic military imagery.

- Sticker-like pickle characters with consistent proportions.

- Badges, ribbons, stamps and dossier details used as playful interface
  motifs.

- Rounded but structured UI; readable first, decorative second.

- One strong green family supported by warm neutrals and selective
  medal/gold accents.

- Responsive character scale so the army still reads on mobile.

## Animation Hierarchy

| **Level**  | **Use**                  | **Examples**                     |
|------------|--------------------------|----------------------------------|
| Ambient    | Constant but subtle      | Blink, breathe, wobble           |
| Responsive | Triggered by interaction | Wave on hover/tap, speech bubble |
| Event      | Important transitions    | Enlistment, new recruit arrival  |
| Commander  | Kenzie-only feedback     | Promotion, medal award           |
| Finale     | Largest sequence         | Birthday parade                  |

**VOICE**

# 10. Content and Dialogue System

The army's dialogue is a major part of the personality. Recruits should
speak in short bursts so the site feels alive without becoming visually
noisy.

## Generic Army Lines

- LONG LIVE KENZIE!

- FOR BRINE AND GLORY!

- PROTECT THE CAKE!

- KENZIE! KENZIE! KENZIE!

- NO PICKLE LEFT BEHIND!

- COMMANDER APPROACHING!

- BRINE LEVELS NOMINAL!

- BIRTHDAY FORMATION!

## Division-Specific Examples

| **Division**      | **Example lines**                          |
|-------------------|--------------------------------------------|
| Cake Protection   | THE CAKE IS SECURE. / PERIMETER CLEAR.     |
| Chaos             | WHO GAVE ME A SWORD? / EVERYTHING IS FINE! |
| Emotional Support | EVERYBODY IS DOING GREAT. / MORALE UP!     |
| Royal Guard       | FOR THE COMMANDER. / HOLD FORMATION.       |
| Party Operations  | VIBES CONFIRMED. / CONFETTI READY.         |

## Dialogue Scheduling

Use a simple scheduler: every few seconds choose one eligible visible
recruit, choose a generic or division-specific line, display it for a
short duration, then clear it. Special events can temporarily allow
group chants. Keep simultaneous bubbles limited.

**RECOMMENDED STACK**

# 11. Technical Architecture

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Recommended production stack</strong></p>
<p>React + Vite + React Router / Supabase Postgres + Realtime + Auth +
Row Level Security / Framer Motion + CSS / SVG assets / GitHub +
Vercel</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

| **Layer**      | **Technology**      | **Responsibility**                                       |
|----------------|---------------------|----------------------------------------------------------|
| Frontend       | React + Vite        | Application shell, builder, army, dossiers, Commander UI |
| Routing        | React Router        | /army, /recruit, /recruit/:id, /commander                |
| Database       | Supabase Postgres   | Persistent recruit and Commander data                    |
| Realtime       | Supabase Realtime   | Push newly created recruits into active army sessions    |
| Authentication | Supabase Auth       | Kenzie-only Commander access                             |
| Authorization  | Supabase RLS        | Enforce who can insert, read and modify data             |
| Animation      | CSS + Framer Motion | Idle behavior, transitions, enlistment, promotions       |
| Assets         | SVG / PNG           | Layered pickle artwork and scene graphics                |
| Source control | GitHub              | Repository and version history                           |
| Deployment     | Vercel              | Builds and public hosting                                |

## What We Do Not Need for v1

- Unity

- Phaser

- Three.js

- WebGL

- A custom Node backend

- A dedicated game server

- Guest user accounts

- User image uploads

- AI image generation

- Complex physics

**SUPABASE**

# 12. Data Model and Security

## Core Table: recruits

| **Field**          | **Type idea** | **Purpose**                  |
|--------------------|---------------|------------------------------|
| id                 | uuid          | Primary recruit identifier   |
| creator_name       | text          | Friend who created it        |
| pickle_name        | text          | Recruit display name         |
| body               | text          | Body asset key               |
| eyes               | text          | Eye asset key                |
| mouth              | text          | Mouth asset key              |
| hat                | text nullable | Hat asset key                |
| accessory          | text nullable | Accessory asset key          |
| color              | text          | Color variant                |
| division           | text          | Behavior/category assignment |
| battle_cry         | text          | Short recruit slogan         |
| message            | text          | Birthday transmission        |
| created_at         | timestamp     | Enlistment time              |
| is_visible         | boolean       | Moderation visibility        |
| favorite_by_kenzie | boolean       | Commander favorite state     |
| commander_title    | text nullable | Honorary title from Kenzie   |
| medal              | text nullable | Commander-awarded medal      |
| viewed_by_kenzie   | boolean       | Optional inspection progress |

## Optional Table: site_state

A single-row site_state table can hold global experience flags such as
commander_has_arrived, parade_triggered or birthday_mode. Keep this
small; do not turn global UI state into a database unless it needs to
persist or synchronize.

## Access Model

| **Actor**     | **Read recruits** | **Create recruit** | **Edit own recruit** | **Commander fields** | **Delete/hide**   |
|---------------|-------------------|--------------------|----------------------|----------------------|-------------------|
| Visitor       | Yes               | Yes                | No by default        | No                   | No                |
| Kenzie        | Yes               | Optional           | No                   | Yes                  | No unless desired |
| Project admin | Yes               | Yes                | Yes                  | Yes                  | Yes               |

## Security Requirements

- Enable Row Level Security on all public tables.

- Allow anonymous inserts only for whitelisted recruit fields.

- Enforce character limits at both UI and database level where
  practical.

- Never expose service-role keys in the frontend.

- Store Commander privileges using authenticated identity and RLS, not
  hidden frontend buttons.

- Sanitize or render message content as text, never raw HTML.

- Provide an admin moderation path to hide or delete inappropriate
  submissions.

- Add rate limiting / anti-spam protection if the link becomes public.

**REACT**

# 13. Frontend Component Architecture

The fundamental reusable object is the Pickle component. Every screen
should render the same character component rather than reimplementing a
builder preview, army sprite and dossier character separately.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Fundamental component</strong></p>
<p>&lt;Pickle body="chunky" eyes="sparkle" mouth="smug" hat="cowboy"
accessory="sword" color="classic" /&gt;</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Recommended Component Tree

App  
Router  
Headquarters  
RecruitBuilder  
Pickle  
PickleCustomizer  
RecruitForm  
EnlistmentCeremony  
Army  
ArmyField  
ArmyRecruit  
Pickle  
SpeechBubble  
RecruitDossier  
Commander  
ArmyField  
CommanderControls  
MedalPicker  
BirthdayParade

## Hooks / Data Layer

- useRecruits - initial fetch + filtered data.

- useRealtimeRecruits - subscribe to new inserts.

- useCommander - current authenticated Kenzie session and permissions.

- useArmyDialogue - schedules ambient speech bubbles.

- useRecruitActions - Commander updates such as medal, favorite and
  title.

**DESIGN SYSTEM**

# 14. Asset Production Plan

Create the pickle system as modular art. Each visual part must align to
a shared character canvas so combinations do not require hand adjustment
in code.

## Recommended Asset Inventory for MVP

| **Asset family** | **Target count** | **Production note**                            |
|------------------|------------------|------------------------------------------------|
| Bodies           | 5                | Shared anchor box and baseline                 |
| Eyes             | 8                | Same eye origin / bounding region              |
| Mouths           | 6                | Same mouth origin                              |
| Hats             | 10               | Consistent head anchor                         |
| Accessories      | 10               | Left/right hand or body anchor                 |
| Colors           | 5                | Prefer SVG fill tokens when possible           |
| Medals           | 7                | Commander award icons                          |
| Idle poses       | 5-7              | Can often be CSS transforms instead of new art |
| Environment      | 1 major scene    | Parade ground / HQ                             |
| UI motifs        | Small set        | Stamps, ribbons, dossier labels                |

## Asset Folder Structure

public/pickles/  
bodies/  
eyes/  
mouths/  
hats/  
accessories/  
medals/  
effects/  
public/environment/  
public/audio/

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Production rule</strong></p>
<p>Build and test alignment with a visual matrix before adding large
numbers of parts. Five perfectly compatible assets are more valuable
than twenty assets that glitch when combined.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**INFRASTRUCTURE**

# 15. Deployment and Launch Architecture

Vercel hosts the compiled React application. Supabase remains the
persistent backend. Most client actions can call Supabase directly using
the public anon key because Row Level Security protects data access. The
service-role key must never be shipped to the browser.

## Runtime Relationship

Visitor browser  
-\> Vercel serves React application  
-\> React reads/writes permitted data through Supabase client  
-\> Supabase Postgres persists recruits  
-\> Supabase Realtime pushes new recruit events  
-\> Supabase Auth identifies Kenzie in Commander Mode

## Environment Variables

- VITE_SUPABASE_URL

- VITE_SUPABASE_ANON_KEY

If server-side Vercel functions are introduced later, secret keys can
live in Vercel server environment variables, but service-role
credentials must never use the VITE\_ prefix or enter client code.

## Deployment Flow

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>01 GitHub repository</strong> - Source code and assets
live in version control.</p>
<p><strong>02 Vercel project</strong> - Connect the repository; every
push builds automatically.</p>
<p><strong>03 Supabase project</strong> - Create database, Auth
configuration, Realtime and RLS policies.</p>
<p><strong>04 Environment configuration</strong> - Add Supabase public
variables in Vercel.</p>
<p><strong>05 Custom domain</strong> - Optional; connect after staging
QA.</p>
<p><strong>06 Production launch</strong> - Seed recruits, test Commander
login, then distribute the public link.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**DELIVERY PLAN**

# 16. MVP, Roadmap and Build Sequence

## MVP - Must Ship

| **Feature**              | **Why it matters**                              |
|--------------------------|-------------------------------------------------|
| Headquarters             | Explains premise and routes visitors            |
| Layered Pickle component | Foundation for every visual state               |
| Pickle Builder           | Core contribution mechanic                      |
| Recruit form             | Captures name, division, battle cry and message |
| Supabase insert/read     | Makes contributions persistent                  |
| Army view                | Shows collaborative result                      |
| Recruit dossier          | Reveals messages                                |
| Realtime inserts         | Makes army feel shared and alive                |
| Commander Auth           | Separates Kenzie permissions                    |
| Commander actions        | Favorites, medals, promotions/titles            |
| Birthday Parade          | Final emotional payoff                          |
| Responsive behavior      | Works properly on phone and desktop             |

## Phase 2 - Polish

- Rare cosmetics

- Shareable recruit cards

- More division-specific idle behaviors

- Sound design / animalese chatter

- Group chants

- Army achievements

- Hidden legendary pickle

- Advanced parade choreography

- Commander statistics / inspection progress

## Recommended Build Order

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>01 Foundation</strong> - Create repo, Vite app, routing,
Supabase project and environment setup.</p>
<p><strong>02 Pickle renderer</strong> - Build the reusable layered
Pickle component.</p>
<p><strong>03 Builder</strong> - Add customization controls and live
preview.</p>
<p><strong>04 Persistence</strong> - Create recruits schema, RLS and
submission path.</p>
<p><strong>05 Army</strong> - Fetch recruits and render stable
formation.</p>
<p><strong>06 Dossier</strong> - Add click/tap detail and birthday
message reveal.</p>
<p><strong>07 Realtime</strong> - Subscribe to inserts and animate
reinforcements.</p>
<p><strong>08 Ambient behavior</strong> - Idle states and speech
scheduler.</p>
<p><strong>09 Commander</strong> - Auth, Kenzie copy, favorites, medals
and titles.</p>
<p><strong>10 Finale</strong> - Implement birthday parade.</p>
<p><strong>11 QA</strong> - Responsive, accessibility, security, content
and performance testing.</p>
<p><strong>12 Launch</strong> - Seed the army, invite friends, then
reveal to Kenzie.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

**SHIP CRITERIA**

# 17. QA and Launch Checklist

## Functional

- A new visitor can create and submit a recruit without an account.

- All builder combinations align visually and do not clip.

- Submission errors have clear recoverable states.

- A new recruit appears in the Army without a refresh.

- Every recruit dossier opens correctly and supports direct links.

- Kenzie can authenticate and ordinary visitors cannot access Commander
  writes.

- Commander medals/titles persist and appear publicly afterward.

- Parade can be triggered safely and restarted if desired.

## Security

- RLS enabled on all Supabase public tables.

- Anon key only in browser.

- No service-role secret in Vercel client variables.

- HTML/script input rendered as plain text.

- Reasonable message/name limits enforced.

- Moderation method tested before sharing the link broadly.

## Responsive and Accessibility

- Builder usable at 320-390 px widths.

- Tap targets large enough for mobile.

- No interaction depends only on hover.

- Reduced-motion preference respected for major animation.

- Dossiers and forms keyboard accessible.

- Decorative animation does not block message reading.

- Army has a usable list/grid fallback for dense mobile layouts.

## Pre-Reveal Launch

- Create 3-5 seed recruits so the world never looks empty.

- Test on at least one iPhone-sized viewport and one Android-sized
  viewport.

- Test production Supabase policies, not only local development.

- Verify Kenzie's Commander account before launch day.

- Invite contributors before sending Kenzie the URL.

- Back up/export recruit data shortly before the birthday reveal.

**NORTH STAR**

# Final Product Definition

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>What we are building</strong></p>
<p>A collaborative interactive birthday card disguised as a living
pickle army. Every friend leaves behind a character. Every character
carries a message. The army visibly grows as people contribute. Kenzie
arrives as its Commander, discovers what everyone built, interacts with
the recruits, and ends the experience by commanding the birthday
parade.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## North-Star Experience

**Create -\> Save -\> Appear -\> Click -\> Read must work perfectly
before anything else is considered finished.**

Everything beyond that loop - rare cosmetics, elaborate animation,
advanced parade choreography, achievements, hidden recruits - is
optional polish.
