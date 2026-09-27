import Anthropic from '@anthropic-ai/sdk';

// Outfit answers can take two model calls, so give the function room.
export const config = { maxDuration: 60 };

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});


// ==================================================
// AURAUP CONFIG
// ==================================================

const PUBLIC_ORIGIN = (
  process.env.PUBLIC_ORIGIN ||
  'https://www.auraupstore.com'
).replace(/\/+$/, '');

const STORE_ORIGIN = (
  process.env.STORE_ORIGIN ||
  'https://auraupstore.com'
).replace(/\/+$/, '');

const MODEL =
  process.env.ANTHROPIC_MODEL ||
  'claude-haiku-4-5-20251001';

const WHATSAPP = '+234 913 039 3648';
const EMAIL = 'hello@auraupstore.com';

const BRAND_FACTS =
  'BRAND FACTS (verified, always known):\n' +
  '- AuraUP is a Lagos-based luxury athleisure brand founded in 2025. Tagline: "Quiet Strength in Motion".\n' +
  '- Physical store: Shop 39, Westbrook Mall, Chisco, Ikate, Lekki, Lagos.\n' +
  '- Store hours: Monday to Sunday, 10am to 7pm.\n' +
  '- Contact: WhatsApp +234 913 039 3648, email hello@auraupstore.com, Instagram @auraupstore.\n' +
  '- Founder: AuraUP was founded by Ebuka in Lagos in 2025. He built it around subtle, understated luxury: premium materials and timeless everyday pieces.\n' +
  '- The brand launched with a Sip & Shop event at Westbrook Mall, Ikate, Lagos.\n';


// ==================================================
// PRODUCT PROFILES
//
// The AI cannot see photos while chatting (it would be too slow and
// costly per message). Instead, each product is looked at ONCE by the
// profile builder (see ?profiles=build below), which describes what the
// piece is, its colour, and which occasions it suits. Paste the builder's
// output over the line below. Products without a profile still work,
// they just fall back to their names.
// ==================================================

const PRODUCT_PROFILES = {
  "auraup-flex-tee-white": {
    "category": "top",
    "what": "crew neck short sleeve t-shirt",
    "colour": "white",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "chinos, joggers, shorts, blazers for layering"
  },
  "auraup-tank-top-gray": {
    "category": "top",
    "what": "sleeveless performance tank top",
    "colour": "white",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running"
    ],
    "pairs_with": "athletic shorts, joggers, or performance leggings for training"
  },
  "auraup-track-jacket-copy": {
    "category": "outerwear",
    "what": "Track jacket with contrast stripe sleeves",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "Neutral joggers, leggings, or relaxed trousers for versatile styling"
  },
  "auraup-classics-copy": {
    "category": "top",
    "what": "Classic crew-neck short-sleeve t-shirt",
    "colour": "white",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "Tailored trousers, jeans, shorts, skirts, blazers, layering pieces"
  },
  "auraup-classic-black-copy": {
    "category": "top",
    "what": "classic crew neck short sleeve t-shirt",
    "colour": "light beige",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "tailored trousers, denim, skirts, layered under jackets"
  },
  "auraup-ardent-tangerine": {
    "category": "top",
    "what": "color-block short-sleeve polo shirt",
    "colour": "ember and white",
    "colour_family": "accent",
    "occasions": [
      "everyday",
      "going_out",
      "work",
      "travel"
    ],
    "pairs_with": "neutral trousers, chinos, or relaxed shorts for versatile styling"
  },
  "auraup-midlayer-long-sleeve-red": {
    "category": "top",
    "what": "long sleeve quarter zip pullover midlayer",
    "colour": "coral red",
    "colour_family": "accent",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "joggers, leggings, shorts, or layered under jackets"
  },
  "auraup-ardent-sage": {
    "category": "top",
    "what": "color-block short sleeve polo shirt",
    "colour": "sage green and white",
    "colour_family": "accent",
    "occasions": [
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "neutral chinos, tailored trousers, or casual shorts for versatile styling"
  },
  "auraup-solace-boxers-olive": {
    "category": "underwear",
    "what": "performance boxer shorts",
    "colour": "olive",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "t-shirts, shirts, or worn alone for comfort and confidence"
  },
  "auraup-solace-boxers-slate": {
    "category": "underwear",
    "what": "performance boxer shorts",
    "colour": "slate",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "wear under any outfit for comfortable all-day support"
  },
  "auraup-panel-cap-green": {
    "category": "accessory",
    "what": "two-tone panel cap with embroidered logo",
    "colour": "green and cream",
    "colour_family": "accent",
    "occasions": [
      "everyday",
      "lounge",
      "travel",
      "going_out"
    ],
    "pairs_with": "casual tops, athleisure sets, relaxed weekend outfits"
  },
  "auraup-solace-boxers-navy-blue": {
    "category": "underwear",
    "what": "mid-length performance boxer shorts",
    "colour": "navy blue",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "any outfit as a base layer for comfort and support"
  },
  "auraup-quater-zip-track-jacket-copy": {
    "category": "outerwear",
    "what": "half-zip track jacket with contrast sleeve stripe",
    "colour": "forest green",
    "colour_family": "accent",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "joggers, chinos, or relaxed trousers for elevated casual wear"
  },
  "auraup-apex-hoodie": {
    "category": "outerwear",
    "what": "oversized washed heavyweight hoodie",
    "colour": "charcoal",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "joggers, relaxed trousers, or oversized sweatpants for effortless style"
  },
  "auraup-motion-tee": {
    "category": "top",
    "what": "short sleeve crew neck performance t-shirt",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "running",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "joggers, track pants, or casual shorts for versatile styling"
  },
  "aurauo-court-cap": {
    "category": "accessory",
    "what": "lightweight performance baseball cap",
    "colour": "white",
    "colour_family": "neutral",
    "occasions": [
      "tennis",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "athleisure sets, casual tops, sportswear, and polished everyday outfits"
  },
  "auraup-panel-cap": {
    "category": "accessory",
    "what": "panel cut baseball cap with embroidered logo",
    "colour": "dark green",
    "colour_family": "accent",
    "occasions": [
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "casual tops, athleisure sets, relaxed weekend outfits"
  },
  "auraup-regent-tee": {
    "category": "top",
    "what": "Crew neck t-shirt with contrast sleeve trim",
    "colour": "cream",
    "colour_family": "neutral",
    "occasions": [
      "everyday",
      "lounge",
      "travel",
      "going_out"
    ],
    "pairs_with": "Neutral bottoms, relaxed shorts, or tailored trousers for versatile styling"
  },
  "auraup-eleve": {
    "category": "top",
    "what": "washed heritage t-shirt with signature motto",
    "colour": "charcoal grey",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "relaxed trousers, jeans, cargo pants, or layered under jackets"
  },
  "auraup-solace-boxers": {
    "category": "underwear",
    "what": "black performance boxer briefs",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "worn under any outfit for comfort and support"
  },
  "aura-up-orion": {
    "category": "bottom",
    "what": "wide-leg charcoal sweatpants with tapered ankles",
    "colour": "charcoal grey",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tees, crop tops, sneakers, and luxury jackets"
  },
  "auraup-panel-cap-1": {
    "category": "accessory",
    "what": "panel cap with embroidered logo",
    "colour": "red",
    "colour_family": "accent",
    "occasions": [
      "gym",
      "lounge",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "athleisure fits, casual wear, tracksuits, and everyday outfits"
  },
  "auraup-epoque-tee": {
    "category": "top",
    "what": "washed heritage crew neck t-shirt",
    "colour": "stone",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "tailored trousers, relaxed jeans, linen shorts, minimalist sneakers"
  },
  "auraup-crop-tee": {
    "category": "top",
    "what": "black and white color-block crop athletic tee",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "everyday"
    ],
    "pairs_with": "high-waisted leggings, athletic shorts, or layered under jackets"
  },
  "auraup-washed-pink-joggers": {
    "category": "bottom",
    "what": "relaxed wide-leg sweatpants with soft lived-in wash",
    "colour": "pink",
    "colour_family": "accent",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tees, cropped tanks, sneakers, slides"
  },
  "auraup-strap-camisole": {
    "category": "top",
    "what": "sleeveless fitted cami with contrast binding",
    "colour": "cobalt blue",
    "colour_family": "accent",
    "occasions": [
      "gym",
      "tennis",
      "running"
    ],
    "pairs_with": "high-waisted leggings, joggers, or athletic shorts"
  },
  "auraup-black-swaetshirt-zip-up": {
    "category": "outerwear",
    "what": "Half-zip quarter-zip track jacket with contrast stripes",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "joggers, track pants, or tailored trousers for versatile styling"
  },
  "auraup-panelled-jersey": {
    "category": "top",
    "what": "Panelled polo shirt with contrast collar and cuffs",
    "colour": "white",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "Neutral trousers, chinos, or relaxed shorts for casual elegance"
  },
  "auraup-monogram-hoodie": {
    "category": "bottom",
    "what": "relaxed monogram print shorts",
    "colour": "cream",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "matching cropped pullover or oversized tees for effortless coordination"
  },
  "auraup-heather-grey-joggers-v2": {
    "category": "bottom",
    "what": "relaxed wide-leg heather grey sweatpants",
    "colour": "light heather grey",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tees, crop tops, sneakers, minimal accessories"
  },
  "auraup-raw-hem-short": {
    "category": "bottom",
    "what": "relaxed raw hem shorts",
    "colour": "sand",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "crop tops, oversized tees, tank tops, sneakers, slides"
  },
  "auraup-sweatpants-in-vintage-blue": {
    "category": "bottom",
    "what": "relaxed wide-leg sweatpants with faded vintage wash",
    "colour": "light blue",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tops, cropped tees, sneakers, minimal accessories"
  },
  "auraup-plain-black-sport-sport": {
    "category": "bottom",
    "what": "lightweight athletic shorts with drawcord waist",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running"
    ],
    "pairs_with": "tank tops, t-shirts, and athletic jackets for training"
  },
  "auraup-elevated-camo-wine-short-sleeve": {
    "category": "top",
    "what": "V-neck short sleeve t-shirt",
    "colour": "red",
    "colour_family": "accent",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "neutral bottoms, sneakers, or casual wear for relaxed settings"
  },
  "auraup-solitaire-black-tee": {
    "category": "top",
    "what": "crew neck t-shirt with embroidered text detail",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "tailored trousers, relaxed denim, neutral joggers, minimalist sneakers"
  },
  "auraup-next": {
    "category": "socks",
    "what": "white ribbed crew socks with small logo",
    "colour": "white",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "sneakers, trainers, athletic wear, casual outfits, loafers"
  },
  "auraup-sport-plain-black-joggers": {
    "category": "bottom",
    "what": "relaxed tapered sweatpants",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tees, tanks, hoodies, trainers for relaxed styling"
  },
  "auraup-wine-joggers": {
    "category": "bottom",
    "what": "relaxed wide-leg sweatpants with contrast stripe detail",
    "colour": "wine",
    "colour_family": "accent",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized hoodies, cropped tees, luxury sneakers, structured jackets"
  },
  "auraup-ash-sweatshirt": {
    "category": "outerwear",
    "what": "relaxed zip-up sweatshirt jacket with collar",
    "colour": "charcoal",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "joggers, chinos, or tailored trousers for versatile styling"
  },
  "auraup-visor": {
    "category": "accessory",
    "what": "Black padded visor with embroidered logo",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "athletic wear, casual tops, and workout outfits for sun protection"
  },
  "auraup-white-shorts": {
    "category": "bottom",
    "what": "lightweight training shorts with drawcord waist",
    "colour": "cream",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running",
      "everyday"
    ],
    "pairs_with": "tank tops, t-shirts, sports bras, lightweight trainers"
  },
  "auraup-track-jacket": {
    "category": "outerwear",
    "what": "Track jacket with contrast stripe detailing",
    "colour": "oxblood",
    "colour_family": "accent",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "joggers, tailored trousers, or casual denim for versatile styling"
  },
  "auraup-grey-shorts": {
    "category": "bottom",
    "what": "relaxed drawstring sweat shorts",
    "colour": "charcoal grey",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "t-shirts, tank tops, hoodies, trainers, slides"
  },
  "auraup-runner-black-short": {
    "category": "bottom",
    "what": "relaxed drawcord athletic shorts with graphic print",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "running",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "tank tops, t-shirts, hoodies, sneakers, and lightweight layers"
  },
  "auraup-sweat-pant": {
    "category": "bottom",
    "what": "relaxed wide-leg brushed sweatpants",
    "colour": "light heather grey",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tees, crop tops, sneakers, slides"
  },
  "auraup-strip-black-joggers": {
    "category": "bottom",
    "what": "relaxed wide-leg sweatpants with side stripe",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel",
      "going_out"
    ],
    "pairs_with": "oversized tops, cropped tees, hoodies, sneakers or slides"
  },
  "auraup-heather-grey-pants": {
    "category": "bottom",
    "what": "relaxed wide-leg heather grey sweatpants",
    "colour": "light heather grey",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tees, hoodies, lightweight jackets, neutral sneakers"
  },
  "auraup-pea-green-joggers": {
    "category": "bottom",
    "what": "relaxed wide-leg sweatpants",
    "colour": "pea green",
    "colour_family": "accent",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "oversized tops, crop tops, sneakers, minimal accessories"
  },
  "auraup-white-tee": {
    "category": "top",
    "what": "classic crew neck short sleeve t-shirt",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "lounge",
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "jeans, tailored trousers, skirts, layers, athleisure bottoms"
  },
  "auraup-elevate-camo-long-sleeve": {
    "category": "top",
    "what": "long sleeve v-neck tee with logo print",
    "colour": "off white",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "joggers, relaxed trousers, shorts for casual comfort"
  },
  "auraup-black-sweat-pant": {
    "category": "bottom",
    "what": "black tapered sweatpants with drawstring",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "AuraUP 051 set top or oversized sweatshirts"
  },
  "auraup-red-jersey": {
    "category": "top",
    "what": "retro striped polo shirt short sleeve",
    "colour": "red",
    "colour_family": "accent",
    "occasions": [
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "tailored trousers, straight-leg denim, casual shorts"
  },
  "auraup-wine-camo-long-sleeve": {
    "category": "top",
    "what": "V-neck long sleeve regular fit tee",
    "colour": "coral red",
    "colour_family": "accent",
    "occasions": [
      "gym",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "neutral bottoms, sneakers, joggers or casual trousers"
  },
  "auraup-flex-black-tee": {
    "category": "top",
    "what": "crew neck t-shirt with raglan sleeves",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "joggers, chinos, or relaxed trousers for versatile styling"
  },
  "auraup-solitaire-tee": {
    "category": "top",
    "what": "crew neck t-shirt with embroidered logo",
    "colour": "cream",
    "colour_family": "neutral",
    "occasions": [
      "lounge",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "tailored trousers, relaxed jeans, linen shorts, minimalist accessories"
  },
  "auraup-wine-long-sleeve-tee": {
    "category": "top",
    "what": "long sleeve quarter zip pullover midlayer",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "running",
      "lounge",
      "everyday",
      "travel"
    ],
    "pairs_with": "joggers, track pants, leggings, or casual bottoms"
  },
  "auraup-black-tank-top": {
    "category": "top",
    "what": "sleeveless performance tank top",
    "colour": "black",
    "colour_family": "neutral",
    "occasions": [
      "gym",
      "tennis",
      "running"
    ],
    "pairs_with": "athletic shorts, joggers, or leggings for training"
  },
  "auraup-motion-polo": {
    "category": "top",
    "what": "color-block polo shirt with contrasting yoke",
    "colour": "mint and lavender",
    "colour_family": "accent",
    "occasions": [
      "work",
      "everyday",
      "going_out",
      "travel"
    ],
    "pairs_with": "navy chinos, white shorts, or tailored trousers for polished looks"
  }
};

// Hand corrections on top of the photo check. These survive when the
// builder is run again, so fix things here rather than in the block above.
//   add: occasions to add      remove: occasions to take away
//   any other field (colour, what, category) replaces the photo check's value
const PROFILE_OVERRIDES = {
  // Polos are classic tennis wear
  'auraup-ardent-sage': { add: ['tennis'] },
  'auraup-ardent-tangerine': { add: ['tennis'] },
  'auraup-motion-polo': { add: ['tennis'] },
  'auraup-panelled-jersey': { add: ['tennis'] },

  // Same tee as the Flex Black, so it trains too
  'auraup-flex-tee-white': { add: ['gym'] },

  // The photo check read it as white
  'auraup-tank-top-gray': { colour: 'light grey' },

  // No bottoms were marked for work. These black tapered pairs are the
  // most polished; remove these two lines if Ebuka disagrees.
  'auraup-black-sweat-pant': { add: ['work', 'going_out'] },
  'auraup-sport-plain-black-joggers': { add: ['work'] },

  // Checked from the photo: a women's two-piece, cropped half-zip
  // pullover with matching shorts, sold as one product.
  'auraup-monogram-hoodie': {
    category: 'set',
    what: 'cropped half-zip pullover and shorts set',
    colour: 'light heather grey',
    colour_family: 'neutral',
    gender: 'women',
    pairs_with: 'white socks and clean trainers; complete on its own'
  },

  // Colours checked against the product photos
  'auraup-white-tee': { colour: 'white' },
  'auraup-classic-black-copy': { colour: 'black' },
  'auraup-wine-long-sleeve-tee': { colour: 'wine', colour_family: 'accent' }
};

const PROFILE_CATEGORIES = ['underwear', 'socks', 'set', 'bottom', 'top', 'outerwear', 'accessory'];

function applyOverride(profile, override) {
  const merged = applyOverrideRaw(profile, override);
  if (merged && !PROFILE_CATEGORIES.includes(merged.category)) {
    // A typo like "outware" would confuse the outfit builder, so ignore it
    // and let the product name decide instead.
    console.warn(`Unknown profile category "${merged.category}", ignoring it`);
    return { ...merged, category: null };
  }
  return merged;
}

function applyOverrideRaw(profile, override) {
  if (!profile) return null;
  if (!override) return profile;

  const merged = { ...profile, occasions: [...(profile.occasions || [])] };

  Object.keys(override).forEach((key) => {
    if (key === 'add') {
      override.add.forEach((o) => { if (!merged.occasions.includes(o)) merged.occasions.push(o); });
    } else if (key === 'remove') {
      merged.occasions = merged.occasions.filter((o) => !override.remove.includes(o));
    } else {
      merged[key] = override[key];
    }
  });

  return merged;
}

const PROFILE_MODEL = process.env.ANTHROPIC_PROFILE_MODEL || MODEL;

const PROFILE_OCCASIONS = ['gym', 'tennis', 'running', 'lounge', 'work', 'everyday', 'going_out', 'travel'];

// Map the chat's occasion names onto the profile's occasion names.
const OCCASION_ALIASES = { training: 'gym', sport: 'gym', evening: 'going_out' };

function normOccasion(value) {
  const key = String(value || '').toLowerCase();
  return OCCASION_ALIASES[key] || key;
}

// Strip long dashes from anything the shopper reads.
function tidy(text) {
  return String(text || '')
    .replace(/\s*[\u2014\u2013]\s*/g, ', ')
    .replace(/\s+-\s+/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*([.!?])/g, '$1')
    .trim();
}


// ==================================================
// CORS
// ==================================================

const DEFAULT_ALLOWED_ORIGINS = [
  'https://auraupstore.com',
  'https://www.auraupstore.com'
];

const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOW_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map((value) => value.trim().replace(/\/+$/, ''))
    .filter(Boolean)
);


// ==================================================
// FETCH HELPERS
// ==================================================

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function shopJson(path) {
  const response = await fetchWithTimeout(STORE_ORIGIN + path, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'AuraUP-Shopping-Assistant/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Shopify endpoint failed: ${response.status} ${path}`);
  }

  return response.json();
}

async function shopHtml(path) {
  const response = await fetchWithTimeout(STORE_ORIGIN + path, {
    method: 'GET',
    headers: {
      Accept: 'text/html',
      'User-Agent': 'AuraUP-Shopping-Assistant/1.0'
    }
  });

  if (!response.ok) {
    return '';
  }

  return response.text();
}


// ==================================================
// CLEAN HTML
// ==================================================

function strip(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);
}

function mainContent(html) {
  const text = String(html || '');
  const match = text.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return strip(match ? match[1] : text);
}


// ==================================================
// STORE CURRENCY
// ==================================================

let currencyCache = { value: 'NGN', at: 0 };

async function getCurrency() {
  if (Date.now() - currencyCache.at < 3600000) {
    return currencyCache.value;
  }

  try {
    const cart = await shopJson('/cart.js');
    currencyCache = {
      value: cart && cart.currency ? cart.currency : 'NGN',
      at: Date.now()
    };
  } catch (error) {
    currencyCache = { value: 'NGN', at: Date.now() };
  }

  return currencyCache.value;
}

// products.json prices are already in major units, e.g. "45000.00"
function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      maximumFractionDigits: 2
    }).format(Number(amount || 0));
  } catch (error) {
    return Number(amount || 0) + ' ' + (currency || 'NGN');
  }
}


// ==================================================
// STORE KNOWLEDGE (policies and pages, cached 1 hour)
// ==================================================

let knowledgeCache = { text: null, at: 0 };

async function getKnowledge() {
  if (knowledgeCache.text !== null && Date.now() - knowledgeCache.at < 3600000) {
    return knowledgeCache.text;
  }

  const sources = [
    { title: 'SHIPPING POLICY', path: '/policies/shipping-policy' },
    { title: 'RETURNS / REFUND POLICY', path: '/policies/refund-policy' },
    { title: 'ABOUT', path: '/pages/about' },
    { title: 'CONTACT', path: '/pages/contact' },
    { title: 'FAQ', path: '/pages/faq' },
    { title: 'SIZE GUIDE', path: '/pages/size-guide' },
    { title: 'SIZING', path: '/pages/sizing' }
  ];

  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        const html = await shopHtml(source.path);
        if (!html) return null;

        const content = mainContent(html);
        if (!content || content.length < 40) return null;

        return source.title + ':\n' + content;
      } catch (error) {
        console.error(`Knowledge fetch failed for ${source.path}:`, error.message);
        return null;
      }
    })
  );

  const unique = Array.from(new Set(results.filter(Boolean)));

  knowledgeCache = { text: unique.join('\n\n'), at: Date.now() };
  return knowledgeCache.text;
}


// ==================================================
// PRODUCT CLASSIFICATION
// ==================================================

const ROLE_ORDER = ['underwear', 'socks', 'set', 'bottom', 'top', 'outerwear', 'accessory'];

const SPORT_OCCASIONS = new Set(['gym', 'tennis', 'running', 'training', 'sport']);

const SPORT_WORDS =
  /\b(gym|tennis|workout|work out|training|train|run|running|jog|jogging|sport|sports|fitness|exercise|court|pilates|yoga|football|basketball|padel)\b/i;

function labelOf(product) {
  return (product.title || '') + ' ' + (product.type || '');
}

function profileCategory(product) {
  return product && product.profile && product.profile.category ? product.profile.category : null;
}

function isSocks(product) {
  const cat = profileCategory(product);
  if (cat) return cat === 'socks';
  return /\bsocks?\b/i.test(labelOf(product));
}

function isUnderwear(product) {
  const cat = profileCategory(product);
  if (cat) return cat === 'underwear';
  return /\b(boxers?|briefs?|trunks?|underwear)\b/i.test(labelOf(product));
}

function isJacket(product) {
  const cat = profileCategory(product);
  if (cat && cat !== 'outerwear') return false;
  if (cat === 'outerwear' && /jacket/i.test(product.profile.what || '')) return true;
  const label = labelOf(product);
  if (/\bjackets?\b/i.test(label)) return true;
  if (/\b(hoodie|tee|t-shirt|shorts|pants|sweatpants|joggers|socks|boxers)\b/i.test(label)) return false;
  return (product.collections || []).some((c) => /\bjackets?\b/i.test(c) && !/hood/i.test(c));
}

const BOTTOM_WORDS = /\b(shorts?|pants|sweatpants|joggers?|trousers|leggings|tights|skirts?|bottoms?)\b/i;
const TOP_WORDS = /\b(tees?|t-shirts?|shirts?|polos?|tanks?|tank tops?|tops?|long sleeves?|sweatshirts?|hoodies?|crewnecks?|midlayers?|vests?|bras?)\b/i;

// "Short Sleeve" / "Long Sleeve" describe tops, so they must never
// count as shorts.
const SLEEVE_WORDS = /\b(short|long)[\s-]*sleeves?\b/gi;

function isBottom(product) {
  const cat = profileCategory(product);
  if (cat) return cat === 'bottom';
  if (isSocks(product) || isUnderwear(product)) return false;
  return BOTTOM_WORDS.test(labelOf(product).replace(SLEEVE_WORDS, ' '));
}

function isTop(product) {
  const cat = profileCategory(product);
  if (cat) return cat === 'top';
  if (isSocks(product) || isUnderwear(product) || isJacket(product) || isBottom(product)) return false;
  return /\bsleeves?\b/i.test(labelOf(product)) || TOP_WORDS.test(labelOf(product));
}

// Does this piece suit the occasion? Underwear and socks always do.
// Pieces without a profile are allowed (we have nothing to judge by).
function suitsOccasion(product, occasion) {
  const occ = normOccasion(occasion);
  if (!occ || occ === 'other' || !PROFILE_OCCASIONS.includes(occ)) return true;
  if (isSocks(product) || isUnderwear(product)) return true;
  const list = product.profile && Array.isArray(product.profile.occasions) ? product.profile.occasions : null;
  if (!list || !list.length) return true;
  return list.includes(occ);
}

// Fixed categories always win over whatever role the model picked.
function roleFor(product, suggested) {
  const cat = profileCategory(product);
  if (cat && ROLE_ORDER.includes(cat)) return cat;
  if (isSocks(product)) return 'socks';
  if (isUnderwear(product)) return 'underwear';
  if (isJacket(product)) return 'outerwear';
  if (isBottom(product)) return 'bottom';
  if (isTop(product)) return 'top';
  return ROLE_ORDER.includes(suggested) ? suggested : 'top';
}


// ==================================================
// LIVE CATALOG
//
// The whole catalog is small, so we load it once
// (public /products.json, no token) and give the
// model the full list. That lets it build complete
// outfits across every category in one go.
// Cached for 5 minutes so stock stays fresh.
// ==================================================

const CATALOG_TTL = 5 * 60 * 1000;
let catalogCache = { items: [], at: 0 };

function normalizeImage(value) {
  const src = String(value || '');
  return src.startsWith('//') ? 'https:' + src : src;
}

function uniqueList(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

const WOMEN_WORDS = /\b(women'?s?|womens|womenswear|ladies|female|her)\b/i;
const MEN_WORDS = /\b(men'?s?|mens|menswear|male|him)\b/i;

// Men / women / unisex. Checks tags first, then the collections the
// product sits in (e.g. "Men", "Women", "For Her"), then the title.
function genderFrom(tags, title, type, collections) {
  const lower = tags.map((tag) => tag.toLowerCase());

  if (lower.some((t) => /^(gender_)?unisex$/.test(t))) return 'unisex';
  if (lower.some((t) => /^(gender_)?(women|womens|women's|ladies|female)$/.test(t))) return 'women';
  if (lower.some((t) => /^(gender_)?(men|mens|men's|male)$/.test(t))) return 'men';

  const inWomen = collections.some((c) => WOMEN_WORDS.test(c));
  const inMen = collections.some((c) => MEN_WORDS.test(c));
  if (inWomen && !inMen) return 'women';
  if (inMen && !inWomen) return 'men';
  if (inMen && inWomen) return 'unisex';

  const text = `${title} ${type}`;
  if (WOMEN_WORDS.test(text)) return 'women';
  if (MEN_WORDS.test(text)) return 'men';

  return 'unisex';
}

function toCatalogItem(product, currency, collections = []) {
  const tags = (
    Array.isArray(product.tags)
      ? product.tags
      : String(product.tags || '').split(',')
  )
    .map((tag) => String(tag).trim())
    .filter(Boolean);

  const occasions = tags
    .filter((tag) => /^occasion_/i.test(tag))
    .map((tag) => tag.replace(/^occasion_/i, '').toLowerCase());

  const preorder = tags.some((tag) => /pre-?order/i.test(tag));

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const options = Array.isArray(product.options) ? product.options : [];

  const sizeIndex = options.findIndex((o) => /size/i.test((o && o.name) || ''));
  const colourIndex = options.findIndex((o) => /colou?r/i.test((o && o.name) || ''));

  const valueAt = (variant, index) =>
    index < 0 ? null : variant['option' + (index + 1)];

  const inStock = variants.filter((variant) => variant.available);

  const prices = variants
    .map((variant) => Number(variant.price))
    .filter((price) => !Number.isNaN(price));

  const firstImage =
    Array.isArray(product.images) && product.images[0]
      ? product.images[0].src
      : '';

  const profile = applyOverride(PRODUCT_PROFILES[product.handle], PROFILE_OVERRIDES[product.handle]);

  return {
    gender:
      (profile && ['men', 'women', 'unisex'].includes(profile.gender) && profile.gender) ||
      genderFrom(tags, product.title || '', product.product_type || '', collections),
    handle: product.handle,
    title: product.title || '',
    type: product.product_type || '',
    occasions,
    collections,
    about: strip(product.body_html).slice(0, 160),
    profile,
    preorder,
    available: inStock.length > 0,
    sizes: uniqueList(inStock.map((variant) => valueAt(variant, sizeIndex))),
    colours: uniqueList(variants.map((variant) => valueAt(variant, colourIndex))),
    price: prices.length ? formatMoney(Math.min(...prices), currency) : '',
    image: normalizeImage(firstImage),
    url: `${PUBLIC_ORIGIN}/products/${encodeURIComponent(product.handle)}`
  };
}

// Collections are how AuraUP groups products (Men, Women, categories),
// so we read every collection and note which products sit in it.
const SKIP_COLLECTIONS = new Set(['all', 'frontpage', 'all-products']);

async function getCollectionMap() {
  const map = new Map();
  let collections = [];

  try {
    const data = await shopJson('/collections.json?limit=250');
    collections = (data && Array.isArray(data.collections) ? data.collections : [])
      .filter((c) => c && c.handle && !SKIP_COLLECTIONS.has(c.handle));
  } catch (error) {
    console.error('Collections fetch failed:', error.message);
    return map;
  }

  await Promise.all(
    collections.slice(0, 40).map(async (collection) => {
      try {
        const data = await shopJson(
          `/collections/${encodeURIComponent(collection.handle)}/products.json?limit=250`
        );
        const products = data && Array.isArray(data.products) ? data.products : [];

        products.forEach((product) => {
          if (!product || !product.handle) return;
          const list = map.get(product.handle) || [];
          list.push(collection.title || collection.handle);
          map.set(product.handle, list);
        });
      } catch (error) {
        console.error(`Collection fetch failed for ${collection.handle}:`, error.message);
      }
    })
  );

  return map;
}

async function getCatalog() {
  if (catalogCache.items.length && Date.now() - catalogCache.at < CATALOG_TTL) {
    return catalogCache.items;
  }

  try {
    const [currency, collectionMap] = await Promise.all([getCurrency(), getCollectionMap()]);
    const raw = [];

    for (let page = 1; page <= 4; page++) {
      const data = await shopJson(`/products.json?limit=250&page=${page}`);
      const batch = data && Array.isArray(data.products) ? data.products : [];
      raw.push(...batch);
      if (batch.length < 250) break;
    }

    catalogCache = {
      items: raw
        .filter((p) => p && p.handle)
        .map((p) => toCatalogItem(p, currency, collectionMap.get(p.handle) || [])),
      at: Date.now()
    };
  } catch (error) {
    // Keep serving the last good catalog if Shopify hiccups.
    console.error('Catalog fetch failed:', error.message);
  }

  return catalogCache.items;
}

function catalogText(items) {
  if (!items.length) {
    return 'The live catalog could not be loaded right now. Do not recommend specific products; direct the shopper to WhatsApp.';
  }

  return items
    .map((p) => {
      const parts = [
        `handle=${p.handle}`,
        `title=${p.title}`,
        p.type ? `type=${p.type}` : null,
        `for=${p.gender}`,
        p.collections.length ? `collections=${p.collections.join('/')}` : null,
        p.occasions.length ? `occasions=${p.occasions.join('/')}` : null,
        p.profile && p.profile.category ? `kind=${p.profile.category}` : null,
        p.profile ? `is=${p.profile.what}` : null,
        p.profile ? `colour=${p.profile.colour} (${p.profile.colour_family})` : null,
        p.profile && p.profile.occasions && p.profile.occasions.length
          ? `good for=${p.profile.occasions.join('/')}`
          : null,
        p.profile && p.profile.pairs_with ? `pairs with=${p.profile.pairs_with}` : null,
        isJacket(p) ? 'JACKET: luxury lounge piece, never for sport' : null,
        p.price ? `price=${p.price}` : null,
        p.colours.length ? `colours=${p.colours.join('/')}` : null,
        p.available
          ? `in-stock sizes=${p.sizes.length ? p.sizes.join('/') : 'one size'}`
          : 'SOLD OUT',
        p.preorder ? 'PRE-ORDER' : null,
        !p.profile && p.about ? `about=${p.about}` : null
      ].filter(Boolean);

      return '- ' + parts.join(' | ');
    })
    .join('\n');
}


// ==================================================
// DISPLAY GUARDS
//
// The model chooses the pieces, but the code enforces
// Ebuka's rules so they hold even if the model slips:
// no jackets in sport looks, socks and underwear in
// every outfit, socks alongside any recommendation.
// ==================================================

function buildOutfits(input, catalog, userText) {
  const byHandle = new Map(catalog.map((p) => [p.handle, p]));
  const occasion = String((input && input.occasion) || '').toLowerCase();
  const sport = SPORT_OCCASIONS.has(occasion) || SPORT_WORDS.test(userText);

  const gender = ['men', 'women'].includes(String((input && input.gender) || '').toLowerCase())
    ? String(input.gender).toLowerCase()
    : null;

  // unisex pieces suit everyone; otherwise the piece must match the shopper
  const fits = (p) => !gender || p.gender === 'unisex' || p.gender === gender;

  // Prefer pieces made for this occasion. If a category has none (for
  // example no bottoms suit work), use the most everyday-appropriate ones
  // instead of leaving the outfit incomplete.
  const suitsHere = (p) => suitsOccasion(p, occasion);

  const pool = (test) => {
    const all = catalog.filter((p) => p.available && fits(p) && test(p));
    const strict = all.filter(suitsHere);
    if (strict.length) return strict;
    const everyday = all.filter((p) => suitsOccasion(p, 'everyday'));
    return everyday.length ? everyday : all;
  };

  const roleCovered = {};
  ROLE_ORDER.forEach((role) => {
    roleCovered[role] = catalog.some(
      (p) => p.available && fits(p) && roleFor(p, null) === role && suitsHere(p)
    );
  });

  const allowedHere = (p, role) =>
    suitsHere(p) || (!roleCovered[role] && suitsOccasion(p, 'everyday'));

  const socks = pool(isSocks);
  const underwear = pool(isUnderwear);

  // For sport, shorts come first; otherwise any bottom.
  const bottoms = pool(isBottom).sort((a, b) =>
    sport ? Number(/shorts?/i.test(labelOf(b))) - Number(/shorts?/i.test(labelOf(a))) : 0
  );
  const tops = pool(isTop);

  const requested = Array.isArray(input && input.outfits) ? input.outfits : [];
  const outfits = [];

  // Outside lounge requests, only one of the three looks may use a jacket.
  const capJackets = !sport && occasion !== 'lounge';
  let jacketTaken = false;

  const slots = [
    ['underwear', 'underwear'],
    ['socks', 'socks'],
    ['bottom', 'bottom'],
    ['top', 'top'],
    ['outer_layer', 'outerwear']
  ];

  requested.slice(0, 3).forEach((outfit, index) => {
    const seen = new Set();
    const removed = [];
    const takenRoles = new Set();

    // Pass 1: validate each piece and work out what it really is.
    const candidates = slots
      .map(([key, role]) => {
        const handle = String((outfit && outfit[key]) || '').trim();
        if (!handle) return null;

        const product = byHandle.get(handle);

        if (!product) {
          removed.push(`${handle} (not in catalog)`);
          return null;
        }
        if (!product.available) {
          removed.push(`${product.title} (sold out)`);
          return null;
        }
        if (!fits(product)) {
          removed.push(`${product.title} (made for ${product.gender})`);
          return null;
        }
        if (sport && isJacket(product)) {
          removed.push(`${product.title} (jackets are lounge only)`);
          return null;
        }
        if (!allowedHere(product, roleFor(product, role))) {
          removed.push(`${product.title} (not suitable for ${normOccasion(occasion)})`);
          return null;
        }

        return { product, slotRole: role, actualRole: roleFor(product, role) };
      })
      .filter(Boolean);

    // Pass 2: one piece per role. Pieces that sit in the right slot win;
    // a piece in the wrong slot (a tee put in "bottom") only gets in if
    // its real role is still free.
    const items = [];
    // A set is a top and bottom in one, so it claims both slots.
    const claims = (role) => (role === 'set' ? ['set', 'top', 'bottom'] : [role]);
    const claimed = (role) =>
      claims(role).some((r) => takenRoles.has(r)) ||
      ((role === 'top' || role === 'bottom') && takenRoles.has('set'));

    const accept = (c) => {
      if (seen.has(c.product.handle) || claimed(c.actualRole)) return false;

      if (capJackets && isJacket(c.product)) {
        if (jacketTaken) {
          removed.push(`${c.product.title} (only one look gets a jacket)`);
          return true;
        }
        jacketTaken = true;
      }

      claims(c.actualRole).forEach((r) => takenRoles.add(r));
      seen.add(c.product.handle);
      items.push({ ...c.product, role: c.actualRole });
      return true;
    };

    const rightSlot = candidates.filter((c) => c.actualRole === c.slotRole);
    const wrongSlot = candidates.filter((c) => c.actualRole !== c.slotRole);

    rightSlot.forEach(accept);
    wrongSlot.forEach((c) => {
      if (seen.has(c.product.handle)) return;
      if (!accept(c)) removed.push(`${c.product.title} (was not a ${c.slotRole})`);
    });

    const hasRole = (role) => items.some((item) => item.role === role);

    // Every outfit must be complete. Fill any missing piece from the
    // matching category, rotating so the three looks don't repeat.
    const fill = (role, list) => {
      if (hasRole(role) || !list.length) return;
      if ((role === 'top' || role === 'bottom') && hasRole('set')) return;
      for (let i = 0; i < list.length; i++) {
        const pick = list[(index + i) % list.length];
        if (!seen.has(pick.handle)) {
          seen.add(pick.handle);
          items.push({ ...pick, role });
          return;
        }
      }
    };

    fill('underwear', underwear);
    fill('socks', socks);
    fill('bottom', bottoms);
    fill('top', tops);

    items.sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));

    if (items.length >= 2) {
      outfits.push({
        name: tidy(outfit.name || `Look ${index + 1}`).slice(0, 40),
        note: tidy(outfit.note).slice(0, 160),
        items,
        removed
      });
    }
  });

  return outfits;
}

function buildProducts(input, catalog) {
  const byHandle = new Map(catalog.map((p) => [p.handle, p]));
  const handles = Array.isArray(input && input.handles) ? input.handles : [];

  const list = uniqueList(handles.map((h) => String(h || '').trim()))
    .map((handle) => byHandle.get(handle))
    .filter(Boolean)
    .slice(0, 4);

  if (list.length && !list.some(isSocks)) {
    const pair = catalog.find((p) => p.available && isSocks(p));
    if (pair) list.push(pair);
  }

  return list;
}

function describeOutfits(outfits) {
  if (!outfits.length) {
    return 'Nothing could be shown: none of those handles are in stock or allowed for this occasion. Rebuild the outfits from the LIVE CATALOG.';
  }

  return (
    'These outfits are now on screen with a picture of every piece:\n' +
    outfits
      .map(
        (outfit) =>
          `${outfit.name}: ` +
          outfit.items.map((item) => `${item.title} (${item.role})`).join(', ') +
          (outfit.removed.length
            ? `. Removed and NOT shown: ${outfit.removed.join(', ')}`
            : '')
      )
      .join('\n') +
    '\n\nNow write the reply. For each outfit, write one short line that names EVERY piece listed above for it, ' +
    'including the underwear and the socks. Do not mention any removed piece.'
  );
}

function describeProducts(products) {
  if (!products.length) {
    return 'Nothing could be shown: none of those handles exist in the LIVE CATALOG.';
  }

  return (
    'Shown to the shopper: ' +
    products.map((p) => p.title + (p.available ? '' : ' (sold out)')).join(', ')
  );
}

// Safety net: if the model names products without showing them,
// match catalog titles in the reply so every named item gets a picture.
function productsNamedIn(reply, catalog) {
  const text = String(reply || '').toLowerCase();

  return catalog
    .filter((p) => p.title && p.title.length >= 4 && text.includes(p.title.toLowerCase()))
    .slice(0, 4);
}


// ==================================================
// PROFILE BUILDER
//
// Looks at each product photo once and writes a short, strict
// style profile. Run it from the browser (see handler) whenever
// products are added, then paste the output into PRODUCT_PROFILES.
// ==================================================

const PROFILE_INSTRUCTIONS =
  'You are cataloguing pieces for AuraUP, a Lagos luxury athleisure brand, so an AI stylist can build outfits. ' +
  'Look carefully at the photo and the details, then reply with ONLY a JSON object, no other text:\n' +
  '{"category": one of "underwear", "socks", "set", "bottom", "top", "outerwear", "accessory". Use "set" when the photo shows a matching top and bottom sold together as one product,\n' +
  ' "what": what the piece actually is in under 10 words, e.g. "sleeveless ribbed tank top" or "relaxed wide-leg sweatpants",\n' +
  ' "colour": the main colour in plain words, e.g. "light heather grey",\n' +
  ' "colour_family": "neutral" for black, white, grey, charcoal, slate, navy, cream, beige or stone, otherwise "accent",\n' +
  ' "occasions": an array of the occasions this piece genuinely suits, chosen only from gym, tennis, running, lounge, work, everyday, going_out, travel,\n' +
  ' "pairs_with": under 12 words on what it pairs well with}\n\n' +
  'Rules for occasions. Be strict; when unsure, leave an occasion out.\n' +
  '- Sleeveless tops and tank tops: gym, tennis, running only. Never work, lounge or going_out.\n' +
  '- Performance or athletic shorts: gym, tennis, running only.\n' +
  '- Jackets are the brand\'s luxury lounge pieces: lounge first; everyday, travel or going_out if polished. NEVER gym, tennis or running.\n' +
  '- Work means a smart-casual office: only clean, covered, polished pieces. No sleeveless tops, no athletic shorts, no loud camo.\n' +
  '- Underwear and socks: list all eight occasions.\n' +
  '- Do not use em dashes or en dashes.';

function sizedImage(url, width) {
  try {
    const u = new URL(url);
    u.searchParams.set('width', String(width));
    return u.toString();
  } catch (error) {
    return url;
  }
}

function cleanProfile(raw) {
  const categories = PROFILE_CATEGORIES;
  const category = categories.includes(raw && raw.category) ? raw.category : null;
  if (!category) throw new Error('bad category');

  return {
    category,
    what: tidy(raw.what).slice(0, 80),
    colour: tidy(raw.colour).slice(0, 40),
    colour_family: raw.colour_family === 'accent' ? 'accent' : 'neutral',
    occasions: (Array.isArray(raw.occasions) ? raw.occasions : [])
      .map((o) => String(o).toLowerCase().replace(/\s+/g, '_'))
      .filter((o) => PROFILE_OCCASIONS.includes(o)),
    pairs_with: tidy(raw.pairs_with).slice(0, 100)
  };
}

async function profileProduct(product) {
  const content = [];

  if (product.image) {
    content.push({
      type: 'image',
      source: { type: 'url', url: sizedImage(product.image, 600) }
    });
  }

  content.push({
    type: 'text',
    text:
      `Product: ${product.title}\n` +
      `Type: ${product.type || 'none'}\n` +
      `Collections: ${product.collections.join(', ') || 'none'}\n` +
      `Colour options: ${product.colours.join(', ') || 'none'}\n` +
      `Description: ${product.about || 'none'}\n\n` +
      PROFILE_INSTRUCTIONS
  });

  const response = await anthropic.messages.create({
    model: PROFILE_MODEL,
    max_tokens: 400,
    messages: [{ role: 'user', content }]
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return cleanProfile(JSON.parse(json));
}

async function buildProfiles(catalog, onlyMissing) {
  const todo = catalog.filter((p) => !onlyMissing || !PRODUCT_PROFILES[p.handle]);
  const results = { ...(onlyMissing ? PRODUCT_PROFILES : {}) };
  const failed = [];

  // 8 at a time keeps it well inside the function time limit.
  for (let i = 0; i < todo.length; i += 8) {
    await Promise.all(
      todo.slice(i, i + 8).map(async (product) => {
        try {
          results[product.handle] = await profileProduct(product);
        } catch (error) {
          console.error(`Profile failed for ${product.handle}:`, error.message);
          failed.push(product.handle);
          if (PRODUCT_PROFILES[product.handle]) results[product.handle] = PRODUCT_PROFILES[product.handle];
        }
      })
    );
  }

  return { results, failed, done: todo.length - failed.length };
}


// ==================================================
// CLAUDE TOOLS
// ==================================================

const tools = [
  {
    name: 'show_outfits',
    description:
      'Display complete outfits to the shopper as picture cards, grouped by outfit. ' +
      'Use this for every outfit, fit, look or "what should I wear" request. ' +
      'Always send three outfits, each built from underwear through to socks.',
    input_schema: {
      type: 'object',
      properties: {
        gender: {
          type: 'string',
          enum: ['men', 'women'],
          description: 'Who the outfits are for. Only call once this is known.'
        },
        intro: {
          type: 'string',
          description: 'One short opening line shown above the outfits, e.g. "Three gym looks for you."'
        },
        occasion: {
          type: 'string',
          enum: ['gym', 'tennis', 'running', 'training', 'sport', 'lounge', 'work', 'everyday', 'going_out', 'travel', 'evening', 'other']
        },
        outfits: {
          type: 'array',
          minItems: 1,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Short outfit name, two to four words'
              },
              note: {
                type: 'string',
                description: 'One short sentence on the feel of this look and when to wear it. Do not list the pieces; the pictures show them.'
              },
              underwear: {
                type: 'string',
                description: 'Handle of the underwear from the LIVE CATALOG. Include it whenever underwear exists for this gender.'
              },
              bottom: {
                type: 'string',
                description: 'Handle of the shorts, pants or joggers from the LIVE CATALOG. If using a set, put the set handle here and in top.'
              },
              top: {
                type: 'string',
                description: 'Handle of the top from the LIVE CATALOG. If using a set, put the set handle here and in bottom.'
              },
              socks: {
                type: 'string',
                description: 'Handle of the AuraUP socks from the LIVE CATALOG'
              },
              outer_layer: {
                type: 'string',
                description: 'Optional handle of an outer layer. Never a jacket for sport.'
              }
            },
            required: ['name', 'note', 'bottom', 'top', 'socks']
          }
        }
      },
      required: ['gender', 'occasion', 'intro', 'outfits']
    }
  },
  {
    name: 'ask_gender',
    description:
      'Show Men and Women buttons so the shopper can say who the look is for. ' +
      'Use this before building outfits when you do not yet know if the shopper wants menswear or womenswear. ' +
      'Write your short question as text in the same response as this call.',
    input_schema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'show_products',
    description:
      'Display picture cards for the products you mention when the shopper is not asking for a full outfit. ' +
      'Call it every time you name specific products.',
    input_schema: {
      type: 'object',
      properties: {
        handles: {
          type: 'array',
          minItems: 1,
          maxItems: 4,
          items: {
            type: 'string',
            description: 'Exact product handle from the LIVE CATALOG'
          }
        }
      },
      required: ['handles']
    }
  }
];


// ==================================================
// SYSTEM PROMPT
// ==================================================

function buildSystem(knowledge, catalog) {
  return (
    `You are the AuraUP shopping assistant on www.auraupstore.com.\n` +
    `AuraUP is a Lagos-based luxury athleisure brand. Tagline: "Quiet Strength in Motion".\n` +
    `Voice: quiet, confident, concise and premium. Never pushy. No emoji. Never use em dashes or en dashes; use commas or full stops instead.\n\n` +

    `YOU ARE A STYLIST:\n` +
    `- Most products include a profile taken from their photo: is (what the piece actually is), colour, good for (the occasions it suits) and pairs with. Trust these over the product name.\n` +
    `- kind=set means a matching top and bottom sold together. It covers both the top and the bottom of an outfit, so only add underwear, socks and, if suitable, an outer layer.\n` +
    `- Only use a piece for an occasion listed in its good for. Never put gym or sleeveless pieces in work, lounge or going-out looks.\n` +
    `- Work means smart-casual: clean, covered, polished pieces only. If no piece in a category is marked for work, choose the darkest, neatest everyday option (for example black tapered joggers).\n` +
    `- Set the occasion in show_outfits to match the request exactly (work for office or work, going_out for dinner or nights out).\n\n` +

    `CATALOG RULES:\n` +
    `- The LIVE CATALOG below is every product on sale right now. Recommend only products listed there, using their exact handles.\n` +
    `- Never invent products, prices, sizes, colours or stock. Only call a size available if it appears in that product's in-stock sizes.\n` +
    `- Never recommend SOLD OUT products. If a product is marked PRE-ORDER, say so when you recommend it.\n` +
    `- If a kind of product is not in the catalog, do not mention that kind of product at all.\n` +
    `- Whenever you name specific products, you MUST show them with show_outfits or show_products so the shopper sees a picture of every item you mention.\n\n` +

    `MEN OR WOMEN:\n` +
    `- Before building any outfit, you must know if it is for men or women. Each product shows for=men, for=women or for=unisex.\n` +
    `- If the shopper has not made it clear (for example "for my girlfriend", "for him", "women's", "I'm a guy"), call ask_gender and, in that same response, write one short question such as "Happy to style that. Is this for men or women?" Do not build outfits in the same reply.\n` +
    `- Once you know, remember it for the rest of the chat and do not ask again.\n` +
    `- Only use pieces made for that gender or unisex. When single products are requested, prefer that gender too if known.\n\n` +
    `SOCKS:\n` +
    `- AuraUP socks finish every look. Whenever you recommend products, include a pair of AuraUP socks too, unless socks are sold out.\n\n` +

    `OUTFITS:\n` +
    `- When the shopper asks for an outfit, a fit, a look, or what to wear for any activity or occasion, always build THREE complete outfits and show them with show_outfits.\n` +
    `- Each outfit is complete from the inside out: underwear, bottoms, top and socks. An outer layer is optional; add one only when it genuinely suits the occasion, never by default.\n` +
    `- Each product lists the store collections it belongs to. Use them to understand what a piece is for, and prefer pieces from collections that match the request.\n` +
    `- Underwear and socks may repeat across outfits if the choice is limited.\n\n` +

    `COLOUR:\n` +
    `- Build each outfit around one clear idea: either tonal (one colour family, such as all black or all grey), or a neutral base (black, white, grey, slate, ash, charcoal, navy, cream) with ONE colour accent (such as wine, green or olive).\n` +
    `- Never put two accent or earthy colours together, such as wine with brown or taupe, or green with wine.\n` +
    `- Anchor a bold accent piece with black, white or grey.\n` +
    `- Work out each colour from the title, colours and about text. If a product's colour is still unclear, only use it in a simple tonal or neutral look.\n` +
    `- Underwear and socks do not count toward the palette.\n` +
    `- Make the three outfits clearly different, ideally one dark tonal, one light, and one with an accent.\n\n` +

    `JACKETS:\n` +
    `- Jackets are AuraUP's luxury lounge pieces. For lounge requests they are welcome in any outfit.\n` +
    `- For any other non-sport request (work, everyday, travel, going out), use a jacket in at most ONE of the three outfits.\n` +
    `- Never recommend a jacket for gym, tennis, running, training or any sport, not even as an extra. ` +
    `For sport outfits, add a non-jacket outer layer only if one suits the activity; otherwise leave the outer layer out.\n\n` +

    `WRITING THE REPLY:\n` +
    `- For outfits, everything goes inside show_outfits: a one-line intro, and for each outfit a name and a one-sentence note on its feel. Do not list the pieces in text; each outfit card shows every piece with its picture and label.\n` +
    `- The pictures, names and prices appear under your text, so do not list links or repeat every price unless asked.\n` +
    `- Write in plain text only. No Markdown: no ** bold, no # headings, no asterisks or bullet symbols.\n` +
    `- Otherwise keep answers to a few sentences unless the shopper asks for more detail.\n\n` +

    `STORE INFORMATION RULES:\n` +
    `- Answer shipping, exchange, refund, sizing, contact and store questions only from BRAND FACTS and STORE INFO below.\n` +
    `- If the answer is not there, do not guess. Direct the shopper to WhatsApp ${WHATSAPP} or ${EMAIL}.\n` +
    `- Never promise a delivery date unless STORE INFO explicitly supports it.\n\n` +

    `GENERAL RULES:\n` +
    `- You may give brief styling, movement and general wellness guidance where useful.\n` +
    `- Do not give medical, injury or detailed training-programme advice.\n` +
    `- Never invent places, people, events or facts you cannot verify.\n\n` +

    BRAND_FACTS + `\n` +

    `STORE INFO:\n` +
    (knowledge ||
      `No verified store information is currently available. For store-policy questions, direct the shopper to WhatsApp ${WHATSAPP} or ${EMAIL}.`) +
    `\n\n` +

    `LIVE CATALOG:\n` +
    catalogText(catalog)
  );
}


// ==================================================
// SERVERLESS API HANDLER
// ==================================================

export default async function handler(req, res) {
  const origin = String(req.headers.origin || '').replace(/\/+$/, '');

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return res.status(403).end();
    }
    return res.status(204).end();
  }

  const query = req.query || {};
  const keyOk =
    req.method === 'GET' &&
    process.env.DEBUG_KEY &&
    query.key === process.env.DEBUG_KEY;

  // Profile builder: /api/chat?profiles=build&key=YOUR_DEBUG_KEY
  // Add &missing=1 to only profile products that don't have one yet.
  // Output is a block of code to paste over PRODUCT_PROFILES.
  if (keyOk && query.profiles === 'build') {
    const catalog = await getCatalog();
    const { results, failed, done } = await buildProfiles(catalog, query.missing === '1');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(
      `// Profiled ${done} products.` +
      (failed.length ? ` Failed: ${failed.join(', ')}. Run with &missing=1 after pasting to retry.` : '') +
      `\n// Paste everything below over the whole PRODUCT_PROFILES block. Leave PROFILE_OVERRIDES as it is.\n\n` +
      `const PRODUCT_PROFILES = ${JSON.stringify(results, null, 2)};\n`
    );
  }

  // Debug: /api/chat?debug=catalog&key=YOUR_DEBUG_KEY shows the catalog
  // exactly as the AI sees it. Disabled unless DEBUG_KEY is set in Vercel.
  if (keyOk && query.debug === 'catalog') {
    const catalog = await getCatalog();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(
      catalog
        .map((p) => {
          const role = isSocks(p) ? 'socks' : isUnderwear(p) ? 'underwear' : isJacket(p) ? 'jacket'
            : isBottom(p) ? 'bottom' : isTop(p) ? 'top' : 'UNKNOWN';
          const profile = p.profile
            ? `${p.profile.what}, ${p.profile.colour} | good for: ${p.profile.occasions.join('/')}`
            : 'NO PROFILE';
          return `[${p.gender}] [${role}] ${p.available ? '' : '[SOLD OUT] '}${p.title}  |  ${profile}  |  collections: ${p.collections.join(', ') || 'none'}`;
        })
        .join('\n')
    );
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'origin_not_allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY');
    return res.status(500).json({
      error: 'server_configuration_error',
      reply: 'The AuraUP assistant is temporarily unavailable.'
    });
  }

  try {
    const body = req.body || {};
    const incoming = Array.isArray(body.messages) ? body.messages : null;

    if (!incoming) {
      return res.status(400).json({ error: 'messages_required' });
    }

    const [knowledge, catalog] = await Promise.all([getKnowledge(), getCatalog()]);

    const system = buildSystem(knowledge, catalog);

    const convo = incoming.slice(-12).map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: String(message.content || '').slice(0, 2000)
    }));

    const lastUser = [...convo].reverse().find((m) => m.role === 'user');
    const userText = lastUser ? lastUser.content : '';

    let outfits = [];
    let products = [];
    let reply = '';
    let quickReplies = [];
    let lastText = '';

    // Usually two rounds: show the pieces, then write the text.
    for (let step = 0; step < 4; step++) {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1200,
        system: [
          {
            type: 'text',
            text: system,
            cache_control: { type: 'ephemeral' }
          }
        ],
        tools,
        messages: convo
      });

      const toolUses = response.content.filter((block) => block.type === 'tool_use');

      const turnText = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim();

      // Remember any text the model writes, even next to a tool call,
      // so a reply is never lost if a later round comes back empty.
      if (turnText) lastText = turnText;

      if (toolUses.length === 0) {
        reply = turnText;
        break;
      }

      // Asking men or women ends the turn right away: show the buttons
      // and the question, no second model call (faster, and no loops).
      if (toolUses.some((block) => block.name === 'ask_gender') && !outfits.length) {
        quickReplies = ['Men', 'Women'];
        reply = turnText || 'Happy to put that together. Is this for men or women?';
        break;
      }

      // Outfits are fully described inside the tool call (intro, names,
      // notes), so once they build successfully the turn is done.
      const outfitCall = toolUses.find((block) => block.name === 'show_outfits');
      if (outfitCall) {
        const built = buildOutfits(outfitCall.input, catalog, userText);
        if (built.length) {
          outfits = built;
          reply =
            tidy((outfitCall.input && outfitCall.input.intro) || '') ||
            'Three looks for you.';
          quickReplies = [];
          break;
        }
      }

      convo.push({ role: 'assistant', content: response.content });

      const toolResults = toolUses.map((block) => {
        if (block.name === 'show_outfits') {
          const built = buildOutfits(block.input, catalog, userText);
          outfits = outfits.concat(built).slice(0, 3);

          return {
            type: 'tool_result',
            tool_use_id: block.id,
            content: describeOutfits(built)
          };
        }

        if (block.name === 'ask_gender') {
          quickReplies = ['Men', 'Women'];

          return {
            type: 'tool_result',
            tool_use_id: block.id,
            content: 'Men and Women buttons are now shown under your message. Write one short question asking who the look is for. Do not build outfits yet.'
          };
        }

        if (block.name === 'show_products') {
          const built = buildProducts(block.input, catalog);
          products = products.concat(built);

          return {
            type: 'tool_result',
            tool_use_id: block.id,
            content: describeProducts(built)
          };
        }

        return {
          type: 'tool_result',
          tool_use_id: block.id,
          content: 'Unsupported tool.',
          is_error: true
        };
      });

      convo.push({ role: 'user', content: toolResults });
    }

    if (!reply) reply = lastText;

    if (!reply) {
      console.warn('Assistant returned no text', { userText, outfits: outfits.length, products: products.length });
    }

    // If the model asked men or women in plain text, still show the buttons.
    if (!outfits.length && !quickReplies.length && /\bmen or women\b|\bwomen or men\b/i.test(reply)) {
      quickReplies = ['Men', 'Women'];
    }

    // Deduplicate single product cards.
    const seen = new Set();
    let cards = products.filter((p) => {
      if (!p.url || seen.has(p.url)) return false;
      seen.add(p.url);
      return true;
    });

    if (!outfits.length && !cards.length && reply) {
      cards = productsNamedIn(reply, catalog);
    }

    reply = tidy(reply);

    return res.status(200).json({
      reply:
        reply ||
        (outfits.length || cards.length
          ? 'Here are some pieces I picked for you.'
          : `Sorry, I missed that. Could you say it another way? You can also reach our team on WhatsApp ${WHATSAPP}.`),
      outfits: outfits.map((outfit) => ({ name: outfit.name, note: outfit.note, items: outfit.items })),
      products: cards.slice(0, 5),
      quick_replies: outfits.length ? [] : quickReplies
    });
  } catch (error) {
    console.error('AuraUP assistant error:', error);

    return res.status(500).json({
      error: 'assistant_error',
      reply: `Sorry, something went wrong on our end. Please reach us on WhatsApp ${WHATSAPP}.`
    });
  }
}