import { ProjectItem, ClientLogo } from '../types.ts';
import pinkBandanaHero from '../assets/images/pink_bandana_hero_1790062243989.jpg';
import pinkBandanaModel from '../assets/images/pink_bandana_model_1790062262220.jpg';
import pinkBandanaAction from '../assets/images/pink_bandana_action_1790062279598.jpg';
import heroShowcaseVideo from '../assets/videos/hero-showcase.mp4';
import heroShowcasePoster from '../assets/images/hero-showcase-poster.jpg';

/* =============================================================================
 * 📂 PORTFOLIO BACKEND CONTENT & DATA STORE
 * =============================================================================
 * This file is the single source of truth for all projects, media, and site content.
 * Any change made here immediately updates the live portfolio.
 *
 * 📐 THUMBNAIL GUIDELINE:
 * - All project thumbnails display in 4:3 LANDSCAPE aspect ratio (e.g. 1200×900, 800×600).
 * - Videos and gallery stills inside the case study detail page can be 16:9, 16:10, or 4:3.
 *
 * 🚀 QUICK GUIDE — HOW TO ADD A NEW PROJECT:
 * 1. Copy the PROJECT TEMPLATE below.
 * 2. Paste it anywhere inside the `PROJECTS` array (or at the top/bottom).
 * 3. Update the `id`, `number`, `title`, `client`, `service`, and `posterUrl`.
 * 4. Save this file — the new case study, thumbnail, and filter option update instantly!
 *
 * 📋 NEW PROJECT TEMPLATE (Copy & paste into PROJECTS):
 * -----------------------------------------------------------------------------
 * {
 *   id: 'my-new-project-slug',
 *   number: '10',
 *   title: 'Project Title Here',
 *   client: 'Client Name',
 *   service: 'Character animation', // Primary category for the Services dropdown
 *   year: '2026',
 *   badge: 'New', // Optional: badge in top corner ('Featured', 'Keynote', etc.)
 *   featured: true,
 *   posterUrl: 'https://images.unsplash.com/...', // Recommended 4:3 landscape image
 *   previewVideoUrl: 'https://.../video.mp4', // Optional MP4 for hover preview
 *   description: 'Full synopsis or case study overview...',
 *   services: ['2D Animation', 'Character Design', 'Rigging'],
 *   tools: ['After Effects', 'Photoshop', 'Toon Boom'],
 *   gallery: [
 *     {
 *       type: 'image',
 *       url: 'https://images.unsplash.com/...',
 *       caption: 'Keyframe render or concept art still',
 *     },
 *     {
 *       type: 'video',
 *       url: 'https://.../video.mp4',
 *       caption: 'Full motion cutdown or turnaround',
 *     },
 *   ],
 * },
 * -----------------------------------------------------------------------------
 * ============================================================================= */

/* -----------------------------------------------------------------------------
 * 1. CLIENT LOGOS & MARQUEE
 * ----------------------------------------------------------------------------- */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'Pink Bandana (Original IP)' },
  { name: 'Coca-Cola' },
  { name: 'MTV Base' },
  { name: 'Snapchat' },
  { name: 'Snap AR' },
  { name: 'TEDx Abuja' },
  { name: 'Visit Nigeria' },
  { name: 'Flitaa' },
  { name: 'Afro Soccer' },
  { name: 'Neuro 6' },
  { name: 'ErrandsBuddy' },
];

/* -----------------------------------------------------------------------------
 * 2. HERO DESCRIPTOR ROTATING LINES
 * ----------------------------------------------------------------------------- */
export const DESCRIPTOR_LINES = [
  'Character animation & IP',
  'Brand systems',
  '2D motion',
  'Explainers & SaaS',
];

/* -----------------------------------------------------------------------------
 * 3. HERO SHOWREEL & BACKGROUND MEDIA
 * ----------------------------------------------------------------------------- */
export const HERO_BG_VIDEO_URL = heroShowcaseVideo;
export const HERO_BG_POSTER_URL = heroShowcasePoster;
export const REEL_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
export const REEL_POSTER_URL = '/assets/images/hero-showcase-poster.jpg';
export const BIO_PHOTO_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop';

/* -----------------------------------------------------------------------------
 * 4. CASE STUDIES & WORKS LIST (All thumbnails display in 4:3 Landscape)
 * ----------------------------------------------------------------------------- */
export const PROJECTS: ProjectItem[] = [
  {
    id: 'pink-bandana-first-ip',
    number: '01',
    badge: 'First IP',
    featured: true,
    title: 'Pink Bandana: Worldbuilding & Character Animation',
    client: 'Original IP / Akura Studio',
    service: 'Character animation',
    year: '2025',
    posterUrl: pinkBandanaHero,
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Debut original intellectual property and narrative character animation project created and directed by Wachin Akura. Built around expressive 2D character animation, dynamic action choreography, full turnaround model sheets, and an afrofuturistic sci-fi universe defined by the heroine in the iconic pink bandana.',
    services: [
      'Character Animation & Rigging',
      'Original IP & Worldbuilding',
      'Visual Development & Turnarounds',
      'Frame-by-Frame 2D Action',
      'Storyboarding & Style Framing',
    ],
    tools: ['After Effects', 'Photoshop', 'Toon Boom', 'Illustrator', 'ExtendScript'],
    gallery: [
      {
        type: 'image',
        url: pinkBandanaHero,
        caption: 'Protagonist key visual — high-contrast character pose & signature pink bandana',
      },
      {
        type: 'image',
        url: pinkBandanaModel,
        caption: 'Character model turnaround sheet — orthographics, facial expressions, and costume breakdown',
      },
      {
        type: 'image',
        url: pinkBandanaAction,
        caption: 'Dynamic 2D animation keyframe — rooftop traversal sequence and cloth physics',
      },
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        caption: 'Character animation motion reel & test sequences',
      },
    ],
  },
  {
    id: 'coca-cola-mtv-base',
    number: '02',
    title: 'Coca-Cola / MTV Base: Naija Like Never Before',
    client: 'Coca-Cola & MTV Base',
    service: '2D motion & Direction',
    year: '2021',
    posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Motion design and direction for Coca-Cola and MTV Base for their "Naija Like Never Before" campaign, highlighting contemporary Nigerian culinary heritage, youth culture, and unspoken food rules through energetic kinetic typography and collage art.',
    services: ['Motion Design', 'Creative Direction', 'Kinetic Typography', 'Broadcast Bumpers'],
    tools: ['Photoshop', 'Illustrator', 'After Effects'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        caption: 'Campaign title reveal and rhythmic kinetic collage sequence',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
        caption: 'Unspoken Rules About Food — editorial typographic spreads',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
        caption: 'Nigerian culinary collage framing and torn paper motion textures',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop',
        caption: 'Social promo toolkit and #NaijaLikeNeverBefore hashtag identity',
      },
    ],
  },
  {
    id: 'snap-ar-micro-animations',
    number: '03',
    title: 'Snap AR: AWE Event Keynote & Stage Visuals',
    client: 'Snapchat / Snap AR',
    event: 'Snap AWE Event (Augmented World Expo)',
    venue: 'Main Stage & Opening Keynote',
    service: 'Stage & keynote visuals',
    year: '2023',
    posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Motion design and live screen systems created for Snapchat and Snap AR at the Snap AWE Event (Augmented World Expo). Featured directly on the main stage and spotlighted throughout the opening keynote, delivering widescreen LED stage backdrops, animated keynote speaker transitions, Lens Studio product reveals, and kinetic typographic micro-animations under the banner of "Art & Tech in Equal Measures".',
    services: [
      'Main Stage Visuals',
      'Keynote Presentation Motion',
      'LED Screen Backdrops',
      'Lens Studio Micro-Animations',
      'UI Motion Design',
      'Live Event Graphics',
    ],
    tools: ['After Effects', 'Cinema 4D', 'Illustrator'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        caption: 'Snap AWE Keynote Reel: Main stage kinetic opening and "Art & Tech in Equal Measures" reveal',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
        caption: 'Snap AWE Event: Live on the main stage — panoramic LED backdrop graphics during the keynote opening',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop',
        caption: 'In the Keynote: Full-screen product announcement slides and developer feature walkthroughs',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        caption: 'Keynote Feature Showcase: Snap AR coordinate framing and 3D spatial perspective grid',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
        caption: 'Keynote Stage Demo: Lens Studio UI toolbar micro-interactions and stylus state transitions',
      },
    ],
  },
  {
    id: 'visit-nigeria-campaign',
    number: '04',
    title: 'Visit Nigeria: The Giant is Calling',
    client: 'Visit Nigeria',
    service: 'Brand systems & 2D motion',
    year: '2023',
    posterUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    description: 'Motion design and campaign identity for the Visit Nigeria tourism initiative, celebrating the country\'s boundless cultural wealth, hospitality, and landmark horizons under "The Giant is Calling" and "New Nigeria" banners.',
    services: ['Campaign Motion', 'Kinetic Identity', 'Brand Direction'],
    tools: ['After Effects', 'Illustrator'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        caption: 'The Giant is Calling title animation and typographic landscape reveals',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop',
        caption: 'New Nigeria identity patterns and West African green gradient systems',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
        caption: 'Tourism broadcast interstitial package and landmark typography',
      },
    ],
  },
  {
    id: 'neuro-6-idents',
    number: '05',
    title: 'Neuro 6 Studio Broadcast Idents',
    client: 'Neuro 6 Studio',
    service: '2D motion',
    year: '2024',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    description: 'Futuristic broadcast idents designed and animated for Neuro 6 Studio as part of their global brand rollout, pairing cybernetic optical eye emblems with spiked metallic typographic marks.',
    services: ['Broadcast Idents', 'Style Framing', 'Visual Systems'],
    tools: ['Illustrator', 'After Effects'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        caption: 'Neuro 6 optical lens activation and glowing iris ident sequence',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
        caption: 'Cybernetic iris glow and reticle perspective grid composition',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
        caption: '3D metallic spiked numeral 6 emblem render and channel bug',
      },
    ],
  },
  {
    id: 'tedx-abuja-stage-animations',
    number: '06',
    title: 'TEDx Abuja: Our World in Circles',
    client: 'TEDx Abuja Nigeria',
    event: 'TEDx Abuja Live Conference',
    venue: 'Auditorium Main Stage & Keynote Screen',
    service: 'Stage & keynote visuals',
    year: '2025',
    posterUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    description: 'Immersive big-screen visual experience for the TEDx Abuja live conference. Designed runtime keynote graphics, speaker identification reveals (including Falz), and dynamic stage visualizers expressing "Our World in Circles".',
    services: ['Stage & Keynote Visuals', 'Stage Motion Graphics', 'Runtime Event Visuals', 'Speaker Ident Systems'],
    tools: ['After Effects', 'Illustrator'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        caption: 'Stage projection loop and concentric red acoustic waveforms',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
        caption: 'Keynote speaker stage reveal graphic for Falz and guest thought leaders',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
        caption: 'Concentric circle motion grammar across live auditorium displays',
      },
    ],
  },
  {
    id: 'flitaa-banking-brand-film',
    number: '07',
    title: 'Flitaa Banking App: Brand-Film & Product Kinetics',
    client: 'Flitaa',
    service: 'Explainers & SaaS',
    year: '2026',
    posterUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'Brand film and tactile product kinetics for Flitaa, an African cross-border banking app enabling frictionless payments across the continent. Articulates the design philosophy, modular iconography, and safety architecture.',
    services: ['FinTech Brand Film', 'UI Product Kinetics', 'Explainer Motion'],
    tools: ['After Effects', 'Figma'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        caption: 'Flitaa pan-African transaction choreography and currency exchange loop',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
        caption: 'Custom app icon matrix and tactile transaction glyph design system',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
        caption: 'Warm terracotta palette and seamless money transfer journey',
      },
    ],
  },
  {
    id: 'afro-soccer-broadcast-package',
    number: '08',
    title: 'Afro Soccer Broadcast Package',
    client: 'Afro Soccer',
    service: 'Brand system and broadcast',
    year: '2026',
    posterUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Comprehensive sports television broadcast package covering network idents, match bumpers, program schedules, lower thirds, and sponsor screen graphics under the ethos "African Football Greatness is Earned Not Bought".',
    services: ['Broadcast Package', 'Lower Thirds Toolkit', 'Match Bumpers', 'Network Idents'],
    tools: ['After Effects', 'Figma'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        caption: 'Afro Soccer match intro bumper and gold typography takeover',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
        caption: 'African Football Greatness is Earned Not Bought manifesto graphic',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
        caption: 'Live score bug, lineup cards, and tournament schedule grid',
      },
    ],
  },
  {
    id: 'errandsbuddy-explainer',
    number: '09',
    title: 'ErrandsBuddy: Own Your Time',
    client: 'ErrandsBuddy',
    service: 'Explainers & SaaS',
    year: '2026',
    posterUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Narrative explainer video for ErrandsBuddy, an on-demand home service platform enabling remote workers and busy families to delegate chores, streamline life, and focus on what truly matters ("Own your time to freedom").',
    services: ['Explainer Video', 'Character & Story Animation', '2D Motion'],
    tools: ['After Effects', 'Illustrator', 'Figma'],
    gallery: [
      {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        caption: 'Remote worker day-in-the-life narrative animation and app dispatch',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop',
        caption: 'Own Your Time to Freedom brand hero lockup and clean badge typography',
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
        caption: 'Service category selector and seamless booking flow choreography',
      },
    ],
  },
];

