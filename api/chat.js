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

const ROLE_ORDER = ['underwear', 'socks', 'bottom', 'top', 'outerwear', 'accessory'];

const SPORT_OCCASIONS = new Set(['gym', 'tennis', 'running', 'training', 'sport']);

const SPORT_WORDS =
  /\b(gym|tennis|workout|work out|training|train|run|running|jog|jogging|sport|sports|fitness|exercise|court|pilates|yoga|football|basketball|padel)\b/i;

function labelOf(product) {
  return (product.title || '') + ' ' + (product.type || '');
}

function isSocks(product) {
  return /\bsocks?\b/i.test(labelOf(product));
}

function isUnderwear(product) {
  return /\b(boxers?|briefs?|trunks?|underwear)\b/i.test(labelOf(product));
}

function isJacket(product) {
  const label = labelOf(product);
  if (/\bjackets?\b/i.test(label)) return true;
  if (/\b(hoodie|tee|t-shirt|shorts|pants|sweatpants|joggers|socks|boxers)\b/i.test(label)) return false;
  return (product.collections || []).some((c) => /\bjackets?\b/i.test(c) && !/hood/i.test(c));
}

const BOTTOM_WORDS = /\b(shorts?|pants|sweatpants|joggers?|trousers|leggings|tights|skirts?|bottoms?)\b/i;
const TOP_WORDS = /\b(tees?|t-shirts?|shirts?|polos?|tanks?|tank tops?|tops?|long sleeves?|sweatshirts?|hoodies?|crewnecks?|midlayers?|vests?|bras?)\b/i;

function isBottom(product) {
  if (isSocks(product) || isUnderwear(product)) return false;
  return BOTTOM_WORDS.test(labelOf(product));
}

function isTop(product) {
  if (isSocks(product) || isUnderwear(product) || isJacket(product) || isBottom(product)) return false;
  return TOP_WORDS.test(labelOf(product));
}

// Fixed categories always win over whatever role the model picked.
function roleFor(product, suggested) {
  if (isSocks(product)) return 'socks';
  if (isUnderwear(product)) return 'underwear';
  if (isJacket(product)) return 'outerwear';
  if (isBottom(product)) return 'bottom';
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

  return {
    handle: product.handle,
    title: product.title || '',
    type: product.product_type || '',
    occasions,
    collections,
    gender: genderFrom(tags, product.title || '', product.product_type || '', collections),
    about: strip(product.body_html).slice(0, 160),
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
        isJacket(p) ? 'JACKET: luxury lounge piece, never for sport' : null,
        p.price ? `price=${p.price}` : null,
        p.colours.length ? `colours=${p.colours.join('/')}` : null,
        p.available
          ? `in-stock sizes=${p.sizes.length ? p.sizes.join('/') : 'one size'}`
          : 'SOLD OUT',
        p.preorder ? 'PRE-ORDER' : null,
        p.about ? `about=${p.about}` : null
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

  const pool = (test) => catalog.filter((p) => p.available && fits(p) && test(p));

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

    const items = slots
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
        if (capJackets && isJacket(product)) {
          if (jacketTaken) {
            removed.push(`${product.title} (only one look gets a jacket)`);
            return null;
          }
          jacketTaken = true;
        }
        if (seen.has(product.handle)) return null;

        seen.add(product.handle);
        return { ...product, role: roleFor(product, role) };
      })
      .filter(Boolean);

    const hasRole = (role) => items.some((item) => item.role === role);

    // Every outfit must be complete. Fill any missing piece from the
    // matching category, rotating so the three looks don't repeat.
    const fill = (role, list) => {
      if (hasRole(role) || !list.length) return;
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
        name: String(outfit.name || `Look ${index + 1}`).slice(0, 40),
        note: String(outfit.note || '').slice(0, 160),
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
          enum: ['gym', 'tennis', 'running', 'training', 'sport', 'lounge', 'everyday', 'travel', 'evening', 'other']
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
                description: 'Handle of the shorts, pants or joggers from the LIVE CATALOG'
              },
              top: {
                type: 'string',
                description: 'Handle of the top from the LIVE CATALOG'
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
    `Voice: quiet, confident, concise and premium. Never pushy. No emoji.\n\n` +

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

  // Debug: /api/chat?debug=catalog&key=YOUR_DEBUG_KEY shows the catalog
  // exactly as the AI sees it. Disabled unless DEBUG_KEY is set in Vercel.
  if (
    req.method === 'GET' &&
    req.query &&
    req.query.debug === 'catalog' &&
    process.env.DEBUG_KEY &&
    req.query.key === process.env.DEBUG_KEY
  ) {
    const catalog = await getCatalog();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(
      catalog
        .map((p) => {
          const role = isSocks(p) ? 'socks' : isUnderwear(p) ? 'underwear' : isJacket(p) ? 'jacket'
            : isBottom(p) ? 'bottom' : isTop(p) ? 'top' : 'UNKNOWN';
          return `[${p.gender}] [${role}] ${p.available ? '' : '[SOLD OUT] '}${p.title}  |  collections: ${p.collections.join(', ') || 'none'}`;
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
            String((outfitCall.input && outfitCall.input.intro) || '').trim() ||
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