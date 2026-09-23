import Anthropic from '@anthropic-ai/sdk';

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


// ==================================================
// CORS
// Allow both AuraUP domains
// ==================================================

const DEFAULT_ALLOWED_ORIGINS = [
  'https://auraupstore.com',
  'https://www.auraupstore.com'
];

const ALLOWED_ORIGINS = new Set(
  (
    process.env.ALLOW_ORIGINS ||
    DEFAULT_ALLOWED_ORIGINS.join(',')
  )
    .split(',')
    .map((value) =>
      value.trim().replace(/\/+$/, '')
    )
    .filter(Boolean)
);


// ==================================================
// FETCH WITH TIMEOUT
// ==================================================

async function fetchWithTimeout(
  url,
  options = {},
  timeoutMs = 10000
) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}


// ==================================================
// PUBLIC SHOPIFY JSON REQUEST
// NO TOKEN REQUIRED
// ==================================================

async function shopJson(path) {
  const response = await fetchWithTimeout(
    STORE_ORIGIN + path,
    {
      method: 'GET',

      headers: {
        Accept: 'application/json',
        'User-Agent':
          'AuraUP-Shopping-Assistant/1.0'
      }
    },
    10000
  );

  if (!response.ok) {
    throw new Error(
      `Shopify endpoint failed: ${response.status} ${path}`
    );
  }

  return response.json();
}


// ==================================================
// PUBLIC SHOPIFY HTML REQUEST
// Used for policies/pages
// ==================================================

async function shopHtml(path) {
  const response = await fetchWithTimeout(
    STORE_ORIGIN + path,
    {
      method: 'GET',

      headers: {
        Accept: 'text/html',
        'User-Agent':
          'AuraUP-Shopping-Assistant/1.0'
      }
    },
    10000
  );

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
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      ' '
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      ' '
    )
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

  const match = text.match(
    /<main\b[^>]*>([\s\S]*?)<\/main>/i
  );

  return strip(
    match ? match[1] : text
  );
}


// ==================================================
// STORE CURRENCY
// ==================================================

let currencyCache = {
  value: 'NGN',
  at: 0
};


async function getCurrency() {
  if (
    Date.now() - currencyCache.at <
    3600000
  ) {
    return currencyCache.value;
  }

  try {
    const cart =
      await shopJson('/cart.js');

    currencyCache = {
      value:
        cart && cart.currency
          ? cart.currency
          : 'NGN',

      at: Date.now()
    };
  } catch (error) {
    currencyCache = {
      value: 'NGN',
      at: Date.now()
    };
  }

  return currencyCache.value;
}


function moneyFromMinorUnits(
  amount,
  currency
) {
  try {
    return new Intl.NumberFormat(
      'en-NG',
      {
        style: 'currency',
        currency:
          currency || 'NGN',
        maximumFractionDigits: 2
      }
    ).format(
      Number(amount || 0) / 100
    );
  } catch (error) {
    return (
      Number(amount || 0) /
        100 +
      ' ' +
      (currency || 'NGN')
    );
  }
}


// ==================================================
// AURAUP STORE KNOWLEDGE
//
// Cached for one hour so every customer message
// doesn't download the policy pages again.
// ==================================================

let knowledgeCache = {
  text: null,
  at: 0
};


async function getKnowledge() {
  if (
    knowledgeCache.text !== null &&
    Date.now() -
      knowledgeCache.at <
      3600000
  ) {
    return knowledgeCache.text;
  }


  const sources = [
    {
      title:
        'SHIPPING POLICY',
      path:
        '/policies/shipping-policy'
    },

    {
      title:
        'RETURNS / REFUND POLICY',
      path:
        '/policies/refund-policy'
    },

    {
      title:
        'ABOUT',
      path:
        '/pages/about'
    },

    {
      title:
        'CONTACT',
      path:
        '/pages/contact'
    },

    {
      title:
        'FAQ',
      path:
        '/pages/faq'
    },

    {
      title:
        'SIZE GUIDE',
      path:
        '/pages/size-guide'
    },

    {
      title:
        'SIZING',
      path:
        '/pages/sizing'
    }
  ];


  const results =
    await Promise.all(
      sources.map(
        async (source) => {
          try {
            const html =
              await shopHtml(
                source.path
              );

            if (!html) {
              return null;
            }

            const content =
              mainContent(html);

            // Ignore genuinely empty pages
            if (
              !content ||
              content.length < 40
            ) {
              return null;
            }

            return (
              source.title +
              ':\n' +
              content
            );
          } catch (error) {
            console.error(
              `Knowledge fetch failed for ${source.path}:`,
              error.message
            );

            return null;
          }
        }
      )
    );


  // Remove accidental duplicate content
  const unique = [];
  const seen = new Set();

  for (
    const item of
      results.filter(Boolean)
  ) {
    if (!seen.has(item)) {
      seen.add(item);
      unique.push(item);
    }
  }


  knowledgeCache = {
    text:
      unique.join('\n\n'),

    at:
      Date.now()
  };


  return knowledgeCache.text;
}


// ==================================================
// PRODUCT HELPERS
// ==================================================

function getHandleFromUrl(url) {
  try {
    const clean =
      String(url || '')
        .split('?')[0];

    const match =
      clean.match(
        /\/products\/([^/?#]+)/i
      );

    return match
      ? decodeURIComponent(
          match[1]
        )
      : '';
  } catch (error) {
    return '';
  }
}


function normalizeImage(image) {
  let value = image;

  if (
    value &&
    typeof value === 'object'
  ) {
    value =
      value.url ||
      value.src ||
      '';
  }

  value =
    String(value || '');

  if (
    value.startsWith('//')
  ) {
    return 'https:' + value;
  }

  return value;
}


// ==================================================
// PRODUCT OPTIONS
// Builds Size / Colour etc.
// ==================================================

function buildOptions(product) {
  const variants =
    Array.isArray(
      product.variants
    )
      ? product.variants
      : [];


  const rawOptions =
    Array.isArray(
      product.options
    )
      ? product.options
      : [];


  return rawOptions.map(
    (option, index) => {

      const name =
        typeof option ===
        'string'
          ? option
          : (
              option &&
              option.name
            ) ||
            `Option ${index + 1}`;


      let values = [];


      if (
        option &&
        typeof option ===
          'object' &&
        Array.isArray(
          option.values
        )
      ) {
        values =
          option.values;
      } else {
        values =
          variants

            .map(
              (variant) => {

                if (
                  Array.isArray(
                    variant.options
                  ) &&
                  variant.options[
                    index
                  ] !==
                    undefined
                ) {
                  return variant
                    .options[
                      index
                    ];
                }

                return variant[
                  `option${index + 1}`
                ];
              }
            )

            .filter(Boolean);
      }


      return {
        name,

        values:
          Array.from(
            new Set(values)
          )
      };
    }
  );
}


// ==================================================
// LIVE PRODUCT SEARCH
//
// 1. Predictive Search finds matching products
// 2. /products/{handle}.js gets live variants,
//    sizes, prices and stock.
// ==================================================

async function searchProducts(q) {
  const query =
    String(q || '')
      .trim();

  if (!query) {
    return [];
  }


  const currency =
    await getCurrency();


  const searchUrl =
    new URL(
      '/search/suggest.json',
      STORE_ORIGIN
    );


  searchUrl.searchParams.set(
    'q',
    query
  );

  searchUrl.searchParams.set(
    'resources[type]',
    'product'
  );

  searchUrl.searchParams.set(
    'resources[limit]',
    '5'
  );

  searchUrl.searchParams.set(
    'resources[options][unavailable_products]',
    'show'
  );


  let suggestions;


  try {
    suggestions =
      await shopJson(
        searchUrl.pathname +
        searchUrl.search
      );
  } catch (error) {
    console.error(
      'Predictive search failed:',
      error.message
    );

    return [];
  }


  const matches =
    suggestions &&
    suggestions.resources &&
    suggestions.resources
      .results &&
    Array.isArray(
      suggestions.resources
        .results.products
    )
      ? suggestions.resources
          .results.products
      : [];


  const products = [];


  for (
    const match of
      matches.slice(0, 5)
  ) {

    const handle =
      match.handle ||
      getHandleFromUrl(
        match.url
      );


    if (!handle) {
      continue;
    }


    try {

      const product =
        await shopJson(
          `/products/${encodeURIComponent(
            handle
          )}.js`
        );


      products.push({

        title:
          product.title ||
          match.title ||
          '',


        handle,


        url:
          `${PUBLIC_ORIGIN}/products/${encodeURIComponent(
            handle
          )}`,


        image:
          normalizeImage(
            product
              .featured_image ||
            match.image ||
            ''
          ),


        price:
          moneyFromMinorUnits(
            product.price_min !==
              undefined
              ? product.price_min
              : product.price,

            currency
          ),


        available:
          Boolean(
            product.available
          ),


        options:
          buildOptions(
            product
          ),


        variants:
          (
            Array.isArray(
              product.variants
            )
              ? product.variants
              : []
          ).map(
            (variant) => ({

              id:
                variant.id,


              title:
                variant.title,


              available:
                Boolean(
                  variant.available
                ),


              price:
                moneyFromMinorUnits(
                  variant.price,
                  currency
                ),


              options:
                Array.isArray(
                  variant.options
                )
                  ? variant.options
                  : []
            })
          )
      });

    } catch (error) {

      console.error(
        `Product JSON failed for ${handle}:`,
        error.message
      );
    }
  }


  return products;
}


// ==================================================
// CLAUDE TOOL
// ==================================================

const tools = [
  {
    name:
      'search_products',

    description:
      'Search the live AuraUP catalog for real current products. ' +
      'Call this whenever a shopper asks about AuraUP products, product names, styles, colours, prices, sizes, variants, stock or availability. ' +
      'Use only the returned catalog data and never invent products, prices, sizes or stock.',

    input_schema: {
      type:
        'object',

      properties: {
        query: {
          type:
            'string',

          description:
            'Concise product search keywords, for example: black shorts, hoodie, cap, polo, trousers'
        }
      },

      required:
        ['query']
    }
  }
];


// ==================================================
// SERVERLESS API HANDLER
// ==================================================

export default async function handler(
  req,
  res
) {

  const origin =
    String(
      req.headers.origin || ''
    ).replace(/\/+$/, '');


  // -------------------------------
  // CORS
  // -------------------------------

  if (
    origin &&
    ALLOWED_ORIGINS.has(
      origin
    )
  ) {
    res.setHeader(
      'Access-Control-Allow-Origin',
      origin
    );
  }


  res.setHeader(
    'Vary',
    'Origin'
  );


  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, OPTIONS'
  );


  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );


  res.setHeader(
    'Cache-Control',
    'no-store'
  );


  // -------------------------------
  // CORS PREFLIGHT
  // -------------------------------

  if (
    req.method === 'OPTIONS'
  ) {

    if (
      origin &&
      !ALLOWED_ORIGINS.has(
        origin
      )
    ) {
      return res
        .status(403)
        .end();
    }

    return res
      .status(204)
      .end();
  }


  // -------------------------------
  // POST ONLY
  // -------------------------------

  if (
    req.method !== 'POST'
  ) {
    return res
      .status(405)
      .json({
        error:
          'method_not_allowed'
      });
  }


  // -------------------------------
  // BLOCK UNKNOWN WEBSITES
  // -------------------------------

  if (
    origin &&
    !ALLOWED_ORIGINS.has(
      origin
    )
  ) {
    return res
      .status(403)
      .json({
        error:
          'origin_not_allowed'
      });
  }


  // -------------------------------
  // CHECK ANTHROPIC KEY
  // -------------------------------

  if (
    !process.env
      .ANTHROPIC_API_KEY
  ) {

    console.error(
      'Missing ANTHROPIC_API_KEY'
    );

    return res
      .status(500)
      .json({
        error:
          'server_configuration_error',

        reply:
          'The AuraUP assistant is temporarily unavailable.'
      });
  }


  try {

    const body =
      req.body || {};


    const incoming =
      Array.isArray(
        body.messages
      )
        ? body.messages
        : null;


    if (!incoming) {
      return res
        .status(400)
        .json({
          error:
            'messages_required'
        });
    }


    // -------------------------------
    // LOAD LIVE STORE INFORMATION
    // -------------------------------

    const knowledge =
      await getKnowledge();


    // -------------------------------
    // AURAUP ASSISTANT INSTRUCTIONS
    // -------------------------------

    const system =

      `You are the AuraUP shopping assistant on www.auraupstore.com.\n` +

      `AuraUP is a Lagos-based luxury athleisure brand. Tagline: "Quiet Strength in Motion".\n` +

      `Voice: quiet, confident, concise and premium. Keep replies short and elegant. Never be pushy. Do not use emoji.\n\n` +


      `CATALOG RULES:\n` +

      `- Whenever the shopper asks about any AuraUP product, product name, style, colour, price, size, variant, stock or availability, you MUST call search_products first.\n` +

      `- Use only data returned by search_products. Never invent products, prices, sizes, colours or availability.\n` +

      `- Do not say a size or variant is available unless its returned variant has available=true.\n` +

      `- Recommend no more than 3 products at a time.\n` +

      `- If there is no matching product, say you could not find a matching live product rather than guessing.\n\n` +


      `STORE INFORMATION RULES:\n` +

      `- Answer shipping, exchange, refund, sizing, contact and store-information questions only from STORE INFO below.\n` +

      `- If the answer is not present in STORE INFO, do not guess. Direct the shopper to WhatsApp ${WHATSAPP} or ${EMAIL}.\n` +

      `- Never promise a delivery date unless STORE INFO explicitly supports it.\n\n` +


      `GENERAL RULES:\n` +

      `- You may give brief styling, movement and general wellness guidance where useful.\n` +

      `- Do not give medical, injury or detailed training-program advice.\n` +

      `- Never invent places, people, events or facts you cannot verify.\n` +

      `- Keep the answer to a few sentences unless the shopper clearly asks for more detail.\n\n` +


      `STORE INFO:\n` +

      (
        knowledge ||

        `No verified store information is currently available. ` +
        `For store-policy questions, direct the shopper to WhatsApp ${WHATSAPP} or ${EMAIL}.`
      );


    // -------------------------------
    // KEEP LAST 12 CHAT MESSAGES
    // -------------------------------

    let convo =
      incoming
        .slice(-12)
        .map(
          (message) => ({

            role:
              message.role ===
                'assistant'
                ? 'assistant'
                : 'user',

            content:
              String(
                message.content || ''
              )
          })
        );


    let products = [];
    let reply = '';


    // -------------------------------
    // CLAUDE + TOOL LOOP
    // -------------------------------

    for (
      let step = 0;
      step < 4;
      step++
    ) {

      const response =
        await anthropic
          .messages
          .create({

            model:
              MODEL,

            max_tokens:
              700,

            system,

            tools,

            messages:
              convo
          });


      const toolUses =
        response.content.filter(
          (block) =>
            block.type ===
            'tool_use'
        );


      // -------------------------------
      // CLAUDE REQUESTED PRODUCT SEARCH
      // -------------------------------

      if (
        toolUses.length > 0
      ) {

        convo.push({
          role:
            'assistant',

          content:
            response.content
        });


        const toolResults = [];


        for (
          const block of
            toolUses
        ) {

          if (
            block.name !==
            'search_products'
          ) {

            toolResults.push({

              type:
                'tool_result',

              tool_use_id:
                block.id,

              content:
                'Unsupported tool.',

              is_error:
                true
            });

            continue;
          }


          let found = [];


          try {

            found =
              await searchProducts(

                block.input &&
                block.input.query

                  ? block.input
                      .query

                  : ''
              );

          } catch (error) {

            console.error(
              'Product search error:',
              error.message
            );
          }


          products =
            products.concat(
              found
            );


          toolResults.push({

            type:
              'tool_result',

            tool_use_id:
              block.id,

            content:
              JSON.stringify(
                found
              )
          });
        }


        convo.push({

          role:
            'user',

          content:
            toolResults
        });


        continue;
      }


      // -------------------------------
      // FINAL TEXT RESPONSE
      // -------------------------------

      reply =
        response.content

          .filter(
            (block) =>
              block.type ===
              'text'
          )

          .map(
            (block) =>
              block.text
          )

          .join('\n')

          .trim();


      break;
    }


    // -------------------------------
    // REMOVE DUPLICATE PRODUCT CARDS
    // -------------------------------

    const seen =
      new Set();


    const cards =
      products

        .filter(
          (product) => {

            if (
              !product.url ||
              seen.has(
                product.url
              )
            ) {
              return false;
            }


            seen.add(
              product.url
            );


            return true;
          }
        )

        .slice(0, 3);


    // -------------------------------
    // SEND RESPONSE TO WIDGET
    // -------------------------------

    return res
      .status(200)
      .json({

        reply:
          reply ||

          `I can connect you with our team on WhatsApp ${WHATSAPP} for that.`,

        products:
          cards
      });


  } catch (error) {

    console.error(
      'AuraUP assistant error:',
      error
    );


    return res
      .status(500)
      .json({

        error:
          'assistant_error',

        reply:
          `Sorry, something went wrong on our end. Please reach us on WhatsApp ${WHATSAPP}.`
      });
  }
}