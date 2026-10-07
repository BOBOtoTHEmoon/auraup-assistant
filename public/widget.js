(function () {
  if (window.__auraupAssistantLoaded) return;
  window.__auraupAssistantLoaded = true;

  var script = document.querySelector('script[data-auraup-assistant]');

  var API =
    (script && script.getAttribute('data-api')) ||
    window.AURAUP_ASSISTANT_API ||
    '/api/chat';

  var WHATSAPP = 'https://wa.me/2349130393648';

  var ROLE_LABELS = {
    underwear: 'Underwear',
    socks: 'Socks',
    bottom: 'Bottoms',
    top: 'Top',
    set: 'Set',
    outerwear: 'Layer',
    accessory: 'Accessory'
  };


  // ==========================================
  // STYLES
  // ==========================================

  var css =
    '' +

    '.auaa-launch{' +
      'position:fixed;' +
      'bottom:22px;' +
      'right:22px;' +
      'z-index:2147483000;' +
      'width:auto;' +
      'height:52px;' +
      'padding:0 20px 0 16px;' +
      'display:flex;' +
      'align-items:center;' +
      'gap:10px;' +
      'background:#1a1a1a;' +
      'color:#fff;' +
      'border:none;' +
      'border-radius:40px;' +
      'cursor:pointer;' +
      'font-family:Montserrat,system-ui,sans-serif;' +
      'font-size:.62rem;' +
      'font-weight:500;' +
      'letter-spacing:.18em;' +
      'text-transform:uppercase;' +
      'box-shadow:0 8px 30px rgba(0,0,0,.28);' +
      'transition:transform .25s ease,opacity .25s ease;' +
    '}' +

    '.auaa-launch:hover{transform:translateY(-2px);}' +

    '.auaa-launch svg{' +
      'width:18px;' +
      'height:18px;' +
      'stroke:#fff;' +
      'fill:none;' +
      'stroke-width:1.6;' +
    '}' +

    '.auaa-launch.auaa-hide{' +
      'opacity:0;' +
      'pointer-events:none;' +
      'transform:scale(.9);' +
    '}' +


    '.auaa-panel{' +
      'position:fixed;' +
      'bottom:22px;' +
      'right:22px;' +
      'z-index:2147483000;' +
      'width:380px;' +
      'max-width:calc(100vw - 32px);' +
      'height:600px;' +
      'max-height:calc(100vh - 44px);' +
      'background:#fff;' +
      'border-radius:14px;' +
      'box-shadow:0 24px 70px rgba(0,0,0,.3);' +
      'display:flex;' +
      'flex-direction:column;' +
      'overflow:hidden;' +
      'font-family:Montserrat,system-ui,sans-serif;' +
      'opacity:0;' +
      'visibility:hidden;' +
      'transform:translateY(16px) scale(.98);' +
      'transition:opacity .3s ease,transform .3s ease,visibility 0s linear .3s;' +
    '}' +

    '.auaa-panel.auaa-open{' +
      'opacity:1;' +
      'visibility:visible;' +
      'transform:translateY(0) scale(1);' +
      'transition:opacity .3s ease,transform .3s ease;' +
    '}' +


    '.auaa-head{' +
      'background:#1a1a1a;' +
      'color:#fff;' +
      'padding:18px 18px 16px;' +
      'display:flex;' +
      'align-items:center;' +
      'justify-content:space-between;' +
    '}' +

    '.auaa-head h4{' +
      'margin:0;' +
      'font-size:.62rem;' +
      'font-weight:500;' +
      'letter-spacing:.3em;' +
      'text-transform:uppercase;' +
    '}' +

    '.auaa-head p{' +
      'margin:3px 0 0;' +
      'font-size:.5rem;' +
      'font-weight:300;' +
      'letter-spacing:.15em;' +
      'color:rgba(255,255,255,.5);' +
      'text-transform:uppercase;' +
    '}' +

    '.auaa-head-actions{display:flex;align-items:center;gap:8px;}' +

    '.auaa-icbtn{' +
      'background:none;' +
      'border:none;' +
      'color:rgba(255,255,255,.7);' +
      'cursor:pointer;' +
      'padding:4px;' +
      'display:flex;' +
      'align-items:center;' +
    '}' +

    '.auaa-icbtn:hover{color:#fff;}' +

    '.auaa-icbtn svg{' +
      'width:18px;' +
      'height:18px;' +
      'stroke:currentColor;' +
      'fill:none;' +
      'stroke-width:1.6;' +
    '}' +


    '.auaa-body{' +
      'position:relative;' +
      'flex:1;' +
      'overflow-y:auto;' +
      'padding:18px;' +
      'background:#f6f5f3;' +
      'display:flex;' +
      'flex-direction:column;' +
      'gap:12px;' +
      'scrollbar-width:thin;' +
    '}' +


    '.auaa-msg{' +
      'max-width:82%;' +
      'font-size:.7rem;' +
      'line-height:1.7;' +
      'letter-spacing:.01em;' +
      'padding:11px 14px;' +
      'border-radius:12px;' +
      'overflow-wrap:anywhere;' +
    '}' +

    '.auaa-msg.bot{' +
      'background:#fff;' +
      'color:#2a2a2a;' +
      'align-self:flex-start;' +
      'border:1px solid rgba(42,42,42,.06);' +
    '}' +

    '.auaa-msg.user{' +
      'background:#1a1a1a;' +
      'color:#fff;' +
      'align-self:flex-end;' +
    '}' +


    // Single product cards (non-outfit answers)
    '.auaa-cards{' +
      'display:flex;' +
      'flex-direction:column;' +
      'gap:8px;' +
      'align-self:flex-start;' +
      'width:82%;' +
    '}' +

    '.auaa-card{' +
      'display:flex;' +
      'gap:12px;' +
      'background:#fff;' +
      'border:1px solid rgba(42,42,42,.08);' +
      'border-radius:10px;' +
      'padding:10px;' +
      'text-decoration:none;' +
      'color:inherit;' +
      'transition:border-color .2s ease;' +
    '}' +

    '.auaa-card:hover{border-color:rgba(42,42,42,.25);}' +

    '.auaa-card img,' +
    '.auaa-card-img{' +
      'width:54px;' +
      'height:66px;' +
      'object-fit:cover;' +
      'background:#eeedea;' +
      'border-radius:6px;' +
      'flex-shrink:0;' +
    '}' +

    '.auaa-card-info{' +
      'display:flex;' +
      'flex-direction:column;' +
      'justify-content:center;' +
      'min-width:0;' +
    '}' +

    '.auaa-card-name{' +
      'font-size:.6rem;' +
      'font-weight:500;' +
      'letter-spacing:.06em;' +
      'text-transform:uppercase;' +
      'color:#1a1a1a;' +
      'margin:0 0 3px;' +
    '}' +

    '.auaa-card-price{' +
      'font-size:.6rem;' +
      'font-weight:300;' +
      'color:rgba(42,42,42,.6);' +
      'margin:0;' +
    '}' +

    '.auaa-card-oos{' +
      'font-size:.5rem;' +
      'letter-spacing:.15em;' +
      'text-transform:uppercase;' +
      'color:#a33;' +
      'margin-top:4px;' +
    '}' +


    // Outfit groups: one block per look, pieces in a swipeable row
    '.auaa-outfits{' +
      'display:flex;' +
      'flex-direction:column;' +
      'gap:10px;' +
      'align-self:stretch;' +
    '}' +

    '.auaa-outfit{' +
      'background:#fff;' +
      'border:1px solid rgba(42,42,42,.08);' +
      'border-radius:12px;' +
      'padding:14px;' +
    '}' +

    '.auaa-outfit-name{' +
      'margin:0 0 10px;' +
      'font-size:.6rem;' +
      'font-weight:500;' +
      'letter-spacing:.2em;' +
      'text-transform:uppercase;' +
      'color:#1a1a1a;' +
    '}' +

    '.auaa-outfit-note{' +
      'margin:-4px 0 12px;' +
      'font-size:.65rem;' +
      'font-weight:300;' +
      'line-height:1.6;' +
      'color:rgba(42,42,42,.7);' +
    '}' +

    // Every piece visible at once: 3 per line, wraps to a second line
    '.auaa-row{' +
      'display:grid;' +
      'grid-template-columns:repeat(3,minmax(0,1fr));' +
      'gap:12px 8px;' +
    '}' +

    '.auaa-tile{' +
      'display:block;' +
      'min-width:0;' +
      'text-decoration:none;' +
      'color:inherit;' +
    '}' +

    '.auaa-tile img,' +
    '.auaa-tile-img{' +
      'display:block;' +
      'width:100%;' +
      'aspect-ratio:4/5;' +
      'height:auto;' +
      'object-fit:cover;' +
      'background:#eeedea;' +
      'border-radius:8px;' +
    '}' +

    '.auaa-tile-role{' +
      'margin:7px 0 2px;' +
      'font-size:.5rem;' +
      'font-weight:400;' +
      'letter-spacing:.04em;' +
      'color:rgba(42,42,42,.45);' +
    '}' +

    '.auaa-tile-name{' +
      'margin:0 0 2px;' +
      'font-size:.55rem;' +
      'font-weight:500;' +
      'letter-spacing:.05em;' +
      'text-transform:uppercase;' +
      'color:#1a1a1a;' +
      'line-height:1.35;' +
      'display:-webkit-box;' +
      '-webkit-line-clamp:2;' +
      '-webkit-box-orient:vertical;' +
      'overflow:hidden;' +
    '}' +

    '.auaa-tile-price{' +
      'margin:0;' +
      'font-size:.55rem;' +
      'font-weight:300;' +
      'color:rgba(42,42,42,.6);' +
    '}' +

    '.auaa-tile-pre{' +
      'margin:3px 0 0;' +
      'font-size:.5rem;' +
      'color:rgba(42,42,42,.55);' +
    '}' +


    // Quick reply buttons (e.g. Men / Women)
    '.auaa-chips{' +
      'display:flex;' +
      'flex-wrap:wrap;' +
      'gap:8px;' +
      'align-self:flex-start;' +
    '}' +

    '.auaa-chip{' +
      'background:#fff;' +
      'border:1px solid #1a1a1a;' +
      'color:#1a1a1a;' +
      'border-radius:40px;' +
      'padding:9px 18px;' +
      'font-family:Montserrat,system-ui,sans-serif;' +
      'font-size:.6rem;' +
      'font-weight:500;' +
      'letter-spacing:.12em;' +
      'text-transform:uppercase;' +
      'cursor:pointer;' +
      'transition:background .2s ease,color .2s ease;' +
    '}' +

    '.auaa-chip:hover,' +
    '.auaa-chip:focus-visible{' +
      'background:#1a1a1a;' +
      'color:#fff;' +
      'outline:none;' +
    '}' +


    '.auaa-typing{' +
      'align-self:flex-start;' +
      'background:#fff;' +
      'border:1px solid rgba(42,42,42,.06);' +
      'border-radius:12px;' +
      'padding:13px 15px;' +
      'display:flex;' +
      'gap:5px;' +
    '}' +

    '.auaa-typing span{' +
      'width:6px;' +
      'height:6px;' +
      'border-radius:50%;' +
      'background:rgba(42,42,42,.35);' +
      'animation:auaaBlink 1.2s infinite ease-in-out;' +
    '}' +

    '.auaa-typing span:nth-child(2){animation-delay:.2s;}' +
    '.auaa-typing span:nth-child(3){animation-delay:.4s;}' +

    '@keyframes auaaBlink{' +
      '0%,80%,100%{opacity:.25;transform:translateY(0);}' +
      '40%{opacity:1;transform:translateY(-3px);}' +
    '}' +


    '.auaa-foot{' +
      'border-top:1px solid rgba(42,42,42,.08);' +
      'padding:12px;' +
      'display:flex;' +
      'gap:8px;' +
      'align-items:center;' +
      'background:#fff;' +
    '}' +

    '.auaa-input{' +
      'flex:1;' +
      'border:1px solid rgba(42,42,42,.15);' +
      'border-radius:22px;' +
      'padding:11px 16px;' +
      'font-family:Montserrat,system-ui,sans-serif;' +
      'font-size:16px;' +
      'letter-spacing:.02em;' +
      'color:#2a2a2a;' +
      'outline:none;' +
      'resize:none;' +
      'overflow-y:hidden;' +
      'line-height:1.35;' +
      'max-height:90px;' +
    '}' +

    '.auaa-input:focus{border-color:#1a1a1a;}' +

    '.auaa-input::placeholder{' +
      'color:rgba(42,42,42,.4);' +
      'white-space:nowrap;' +
      'overflow:hidden;' +
      'text-overflow:ellipsis;' +
    '}' +

    '.auaa-send{' +
      'width:38px;' +
      'height:38px;' +
      'flex-shrink:0;' +
      'border-radius:50%;' +
      'border:none;' +
      'background:#1a1a1a;' +
      'color:#fff;' +
      'cursor:pointer;' +
      'display:flex;' +
      'align-items:center;' +
      'justify-content:center;' +
    '}' +

    '.auaa-send:disabled{opacity:.4;cursor:default;}' +

    '.auaa-send svg{' +
      'width:16px;' +
      'height:16px;' +
      'stroke:#fff;' +
      'fill:none;' +
      'stroke-width:1.8;' +
    '}' +


    '@media (max-width:480px){' +

      '.auaa-panel{' +
        'bottom:0;' +
        'right:0;' +
        'width:100vw;' +
        'max-width:100vw;' +
        'height:100vh;' +
        'height:100dvh;' +
        'max-height:100dvh;' +
        'border-radius:0;' +
      '}' +

      '.auaa-foot{' +
        'padding-bottom:calc(12px + env(safe-area-inset-bottom, 0px));' +
      '}' +

      '.auaa-launch{' +
        'bottom:16px;' +
        'right:16px;' +
      '}' +

    '}';


  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);


  // ==========================================
  // LAUNCH BUTTON
  // ==========================================

  var launcher = document.createElement('button');
  launcher.className = 'auaa-launch';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Chat with AuraUP');

  launcher.innerHTML =
    '<svg viewBox="0 0 24 24">' +
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>' +
    '<span>Shop with AuraUP</span>';


  // ==========================================
  // CHAT PANEL
  // ==========================================

  var panel = document.createElement('div');
  panel.className = 'auaa-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'AuraUP shopping assistant');

  panel.innerHTML =
    '<div class="auaa-head">' +
      '<div>' +
        '<h4>AuraUP Assistant</h4>' +
        '<p>Quiet Strength in Motion</p>' +
      '</div>' +
      '<div class="auaa-head-actions">' +
        '<a class="auaa-icbtn" href="' + WHATSAPP + '" target="_blank" rel="noopener noreferrer" aria-label="Contact AuraUP on WhatsApp">' +
          '<svg viewBox="0 0 24 24">' +
            '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</a>' +
        '<button type="button" class="auaa-icbtn" data-close aria-label="Close assistant">' +
          '<svg viewBox="0 0 24 24">' +
            '<path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
    '</div>' +

    '<div class="auaa-body" id="auaaBody"></div>' +

    '<div class="auaa-foot">' +
      '<textarea class="auaa-input" id="auaaInput" rows="1" maxlength="1000" aria-label="Message AuraUP assistant" placeholder="Ask for a look or sizing"></textarea>' +
      '<button type="button" class="auaa-send" id="auaaSend" aria-label="Send message">' +
        '<svg viewBox="0 0 24 24">' +
          '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
    '</div>';

  document.body.appendChild(launcher);
  document.body.appendChild(panel);


  // ==========================================
  // ELEMENTS / STATE
  // ==========================================

  var bodyEl = panel.querySelector('#auaaBody');
  var inputEl = panel.querySelector('#auaaInput');
  var sendEl = panel.querySelector('#auaaSend');

  var messages = [];
  var busy = false;
  var greeted = false;


  // ==========================================
  // HELPERS
  // ==========================================

  function esc(value) {
    var div = document.createElement('div');
    div.textContent = String(value == null ? '' : value);
    return div.innerHTML;
  }

  function scrollDown() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // For long answers, bring the start of the reply into view
  // instead of jumping to the last outfit.
  function scrollToElement(element) {
    bodyEl.scrollTop = Math.max(element.offsetTop - 12, 0);
  }

  function addBubble(role, text) {
    var element = document.createElement('div');

    element.className = 'auaa-msg ' + (role === 'user' ? 'user' : 'bot');

    element.innerHTML = esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*\*/g, '')
      .replace(/\n/g, '<br>');

    bodyEl.appendChild(element);
    scrollDown();

    return element;
  }

  function productImage(product, fallbackClass) {
    return product.image
      ? '<img loading="lazy" src="' + esc(product.image) + '" alt="' + esc(product.title || 'AuraUP product') + '">'
      : '<div class="' + fallbackClass + '"></div>';
  }


  // ==========================================
  // ADD TO BAG (product cards + outfits)
  // ==========================================

  var SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL'];
  var productCache = {};

  var BUY_CSS = [
    '.auaa-card a{color:inherit;text-decoration:none;}',
    '.auaa-card-media{display:block;flex-shrink:0;}',
    '.auaa-card-name{display:block;}',
    '.auaa-buy{margin-top:8px;}',
    '.auaa-buy-btn,.auaa-look-btn{background:#1a1a1a;color:#fff;border:0;border-radius:40px;padding:8px 14px;font-family:Montserrat,system-ui,sans-serif;font-size:.5rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;}',
    '.auaa-look-btn{width:100%;padding:11px 14px;}',
    '.auaa-buy-btn[disabled],.auaa-look-btn[disabled]{opacity:.55;cursor:default;}',
    '.auaa-buy-label{margin:0 0 6px;font-size:.5rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(42,42,42,.55);line-height:1.5;}',
    '.auaa-sizes{display:flex;flex-wrap:wrap;gap:5px;}',
    '.auaa-size{min-width:30px;height:28px;padding:0 7px;margin:0;background:#fff;border:1px solid rgba(42,42,42,.22);border-radius:6px;font-family:Montserrat,system-ui,sans-serif;font-size:.55rem;font-weight:500;color:#1a1a1a;cursor:pointer;}',
    '.auaa-size:hover:not([disabled]){background:#1a1a1a;color:#fff;border-color:#1a1a1a;}',
    '.auaa-size[disabled]{opacity:.35;text-decoration:line-through;cursor:not-allowed;}',
    '.auaa-size.is-busy{opacity:.5;pointer-events:none;}',
    '.auaa-added{display:inline-block;margin:0 10px 0 0;font-size:.55rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#1a1a1a;line-height:1.6;}',
    '.auaa-viewbag{background:none;border:0;padding:0;margin:0;font-family:Montserrat,system-ui,sans-serif;font-size:.55rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:underline;color:#1a1a1a;cursor:pointer;}',
    '.auaa-buy-msg{margin:6px 0 0;font-size:.55rem;line-height:1.5;color:#a33;}',
    '.auaa-tile-link{display:block;color:inherit;text-decoration:none;}',
    '.auaa-tile-add{margin-top:6px;background:none;border:1px solid rgba(42,42,42,.25);border-radius:40px;padding:5px 10px;font-family:Montserrat,system-ui,sans-serif;font-size:.48rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#1a1a1a;cursor:pointer;}',
    '.auaa-tile-add.is-done{background:#1a1a1a;border-color:#1a1a1a;color:#fff;}',
    '.auaa-look{margin-top:14px;padding-top:12px;border-top:1px solid rgba(42,42,42,.08);}',
    '.auaa-look-panel:not(:empty){margin-top:10px;}',
    '.auaa-look-note{margin:6px 0 0;font-size:.55rem;line-height:1.5;color:rgba(42,42,42,.6);}'
  ].join('');

  (function () {
    var style = document.createElement('style');
    style.textContent = BUY_CSS;
    document.head.appendChild(style);
  })();

  function escAttr(value) { return esc(value).replace(/"/g, '&quot;'); }

  function handleFromUrl(url) {
    try {
      var match = new URL(url, location.origin).pathname.match(/\/products\/([^\/?#]+)/);
      return match ? match[1] : null;
    } catch (error) { return null; }
  }

  function loadProduct(url) {
    var handle = handleFromUrl(url);
    if (!handle) return Promise.reject(new Error('No product handle'));
    if (!productCache[handle]) {
      productCache[handle] = fetch('/products/' + handle + '.js', { headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .catch(function (error) { delete productCache[handle]; throw error; });
    }
    return productCache[handle];
  }

  function sizeIndex(product) {
    return (product.options || []).map(function (o) {
      return String(typeof o === 'string' ? o : o.name).toLowerCase();
    }).indexOf('size');
  }

  function rankSize(value) {
    var i = SIZE_ORDER.indexOf(String(value).toUpperCase());
    return i === -1 ? 99 : i;
  }

  // One entry per size (or per option value), with the first in-stock variant for it
  function choicesFor(product) {
    var idx = sizeIndex(product), use = idx > -1 ? idx : 0;
    var map = {}, list = [];
    product.variants.forEach(function (v) {
      var label = v.options && v.options[use];
      if (label == null) return;
      if (!map[label]) { map[label] = { label: label, variant: null }; list.push(map[label]); }
      if (v.available && !map[label].variant) map[label].variant = v;
    });
    if (idx > -1) list.sort(function (a, b) { return rankSize(a.label) - rankSize(b.label); });
    return list;
  }

  function addItems(items) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: items })
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); })
      .then(function (result) {
        return fetch('/cart.js', { headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json(); })
          .then(function (cart) {
            document.querySelectorAll('#lhCartCount, [data-cart-count]').forEach(function (el) {
              el.textContent = cart.item_count;
              if (el.id === 'lhCartCount') el.style.display = cart.item_count ? 'flex' : 'none';
            });
            document.dispatchEvent(new CustomEvent('au:cart-updated', { detail: cart }));
            return result;
          });
      });
  }

  function viewBag() {
    close();
    if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
    else window.location.href = '/cart';
  }

  function renderSizes(box, list, label, onPick) {
    box.innerHTML = '<p class="auaa-buy-label">' + esc(label) + '</p><div class="auaa-sizes"></div>';
    var wrap = box.querySelector('.auaa-sizes');
    list.forEach(function (option) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'auaa-size';
      chip.textContent = option.label;
      if (!option.variant) { chip.disabled = true; chip.title = 'Sold out'; }
      chip.addEventListener('click', function () { if (option.variant) onPick(option.variant, chip); });
      wrap.appendChild(chip);
    });
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function showDone(box, text) {
    box.innerHTML = '<span class="auaa-added">' + esc(text) + '</span><button type="button" class="auaa-viewbag">View bag</button>';
    box.querySelector('.auaa-viewbag').addEventListener('click', viewBag);
  }

  function showMsg(box, text) {
    var msg = box.querySelector('.auaa-buy-msg');
    if (!msg) { msg = document.createElement('p'); msg.className = 'auaa-buy-msg'; box.appendChild(msg); }
    msg.textContent = text;
  }

  function variantLabel(v) { return v.title && v.title !== 'Default Title' ? ' \u00b7 ' + v.title : ''; }

  // Add one product: straight in if it has one variant, otherwise show its sizes
  function buyOne(box, url, name, onAdded) {
    box.innerHTML = '<p class="auaa-buy-label">Loading sizes</p>';
    loadProduct(url).then(function (product) {
      function pick(variant, chip) {
        if (chip) chip.classList.add('is-busy');
        addItems([{ id: variant.id, quantity: 1 }])
          .then(function () {
            showDone(box, 'Added' + (name ? ' \u00b7 ' + name : '') + variantLabel(variant));
            if (onAdded) onAdded();
          })
          .catch(function (error) {
            if (chip) chip.classList.remove('is-busy');
            showMsg(box, (error && error.description) || 'Could not add. Please try again.');
          });
      }
      if (product.variants.length === 1) {
        if (product.variants[0].available) pick(product.variants[0]);
        else box.innerHTML = '<p class="auaa-buy-msg">Sold out</p>';
        return;
      }
      renderSizes(box, choicesFor(product), (name ? name + ' \u00b7 ' : '') + (sizeIndex(product) > -1 ? 'Select size' : 'Select option'), pick);
    }).catch(function () {
      box.innerHTML = '<p class="auaa-buy-msg">Could not load sizes. Please open the product.</p>';
    });
  }

  function mountCardBuy(box, url) {
    box.innerHTML = '<button type="button" class="auaa-buy-btn">Add to bag</button>';
    box.querySelector('.auaa-buy-btn').addEventListener('click', function () { buyOne(box, url, ''); });
  }

  // Outfit block: "+ Add" on each piece, plus "Add full look" in one size
  function mountLook(block, row) {
    var look = document.createElement('div');
    look.className = 'auaa-look';
    look.innerHTML = '<button type="button" class="auaa-look-btn">Add full look to bag</button><div class="auaa-look-panel"></div>';
    block.appendChild(look);

    var panel = look.querySelector('.auaa-look-panel');
    var lookBtn = look.querySelector('.auaa-look-btn');
    var tiles = Array.prototype.slice.call(row.querySelectorAll('.auaa-tile'));

    function markAdded(tile) {
      var b = tile.querySelector('.auaa-tile-add');
      b.textContent = 'Added';
      b.classList.add('is-done');
    }

    tiles.forEach(function (tile) {
      tile.querySelector('.auaa-tile-add').addEventListener('click', function () {
        buyOne(panel, tile.__item.url, tile.__item.title, function () { markAdded(tile); });
      });
    });

    lookBtn.addEventListener('click', function () {
      panel.innerHTML = '<p class="auaa-buy-label">Loading sizes</p>';
      Promise.all(tiles.map(function (tile) {
        return loadProduct(tile.__item.url).then(
          function (p) { return { tile: tile, item: tile.__item, product: p }; },
          function () { return { tile: tile, item: tile.__item, product: null }; }
        );
      })).then(function (rows) {
        // every size offered by any piece in the look
        var map = {}, sizes = [];
        rows.forEach(function (r) {
          if (!r.product) return;
          var idx = sizeIndex(r.product);
          if (idx < 0) return;
          r.product.variants.forEach(function (v) {
            var s = v.options[idx];
            if (!map[s]) { map[s] = { label: s, variant: null }; sizes.push(map[s]); }
            if (v.available) map[s].variant = v;
          });
        });
        sizes.sort(function (a, b) { return rankSize(a.label) - rankSize(b.label); });

        function addLook(size, chip) {
          var items = [], missing = [], added = [];
          rows.forEach(function (r) {
            var chosen = null;
            if (r.product) {
              var idx = sizeIndex(r.product);
              for (var i = 0; i < r.product.variants.length; i++) {
                var v = r.product.variants[i];
                if (v.available && (idx < 0 || v.options[idx] === size)) { chosen = v; break; }
              }
            }
            if (chosen) { items.push({ id: chosen.id, quantity: 1 }); added.push(r); }
            else missing.push(r.item.title);
          });
          if (!items.length) { showMsg(panel, 'None of these pieces are available' + (size ? ' in ' + size : '') + '.'); return; }
          if (chip) chip.classList.add('is-busy');
          addItems(items).then(function () {
            added.forEach(function (r) { markAdded(r.tile); });
            showDone(panel, 'Added ' + items.length + (items.length === 1 ? ' piece' : ' pieces') + (size ? ' \u00b7 ' + size : ''));
            if (missing.length) {
              var note = document.createElement('p');
              note.className = 'auaa-look-note';
              note.textContent = 'Not available' + (size ? ' in ' + size : '') + ': ' + missing.join(', ') + '. Tap + Add on those pieces to pick another size.';
              panel.appendChild(note);
            }
            lookBtn.textContent = 'Look added';
            lookBtn.disabled = true;
          }).catch(function (error) {
            if (chip) chip.classList.remove('is-busy');
            showMsg(panel, (error && error.description) || 'Could not add. Please try again.');
          });
        }

        if (!sizes.length) { addLook(null); return; }
        renderSizes(panel, sizes, 'Choose your size for the full look', function (v, chip) { addLook(chip.textContent, chip); });
      });
    });
  }


  // ==========================================
  // SINGLE PRODUCT CARDS
  // ==========================================

  function addCards(products) {
    if (!Array.isArray(products) || !products.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'auaa-cards';

    products.forEach(function (product) {
      if (!product || !product.url) return;

      var card = document.createElement('div');
      card.className = 'auaa-card';

      card.innerHTML =
        '<a class="auaa-card-media" href="' + escAttr(product.url) + '" target="_top">' +
          productImage(product, 'auaa-card-img') +
        '</a>' +
        '<div class="auaa-card-info">' +
          '<a class="auaa-card-name" href="' + escAttr(product.url) + '" target="_top">' + esc(product.title) + '</a>' +
          '<p class="auaa-card-price">' + esc(product.price) + '</p>' +
          (product.available
            ? '<div class="auaa-buy"></div>'
            : '<span class="auaa-card-oos">Sold out</span>') +
        '</div>';

      var buy = card.querySelector('.auaa-buy');
      if (buy) mountCardBuy(buy, product.url);

      wrap.appendChild(card);
    });

    if (wrap.children.length) {
      bodyEl.appendChild(wrap);
      scrollDown();
    }
  }


  // ==========================================
  // OUTFIT GROUPS
  // ==========================================

  function addOutfits(outfits) {
    if (!Array.isArray(outfits) || !outfits.length) return false;

    var wrap = document.createElement('div');
    wrap.className = 'auaa-outfits';

    outfits.forEach(function (outfit) {
      if (!outfit || !Array.isArray(outfit.items) || !outfit.items.length) return;

      var block = document.createElement('div');
      block.className = 'auaa-outfit';

      var row = document.createElement('div');
      row.className = 'auaa-row';

      outfit.items.forEach(function (item) {
        if (!item || !item.url) return;

        var tile = document.createElement('div');
        tile.className = 'auaa-tile';
        tile.__item = item;

        tile.innerHTML =
          '<a class="auaa-tile-link" href="' + escAttr(item.url) + '" target="_top">' +
            productImage(item, 'auaa-tile-img') +
            '<p class="auaa-tile-role">' + esc(ROLE_LABELS[item.role] || '') + '</p>' +
            '<p class="auaa-tile-name">' + esc(item.title) + '</p>' +
            '<p class="auaa-tile-price">' + esc(item.price) + '</p>' +
            (item.preorder ? '<p class="auaa-tile-pre">Pre-order</p>' : '') +
          '</a>' +
          '<button type="button" class="auaa-tile-add">+ Add</button>';

        row.appendChild(tile);
      });

      if (!row.children.length) return;

      block.innerHTML =
        '<p class="auaa-outfit-name">' + esc(outfit.name) + '</p>' +
        (outfit.note ? '<p class="auaa-outfit-note">' + esc(outfit.note) + '</p>' : '');
      block.appendChild(row);
      mountLook(block, row);
      wrap.appendChild(block);
    });

    if (!wrap.children.length) return false;

    bodyEl.appendChild(wrap);
    return true;
  }


  // ==========================================
  // QUICK REPLIES
  // ==========================================

  function clearChips() {
    var old = bodyEl.querySelectorAll('.auaa-chips');
    for (var i = 0; i < old.length; i++) old[i].remove();
  }

  function addChips(options) {
    if (!Array.isArray(options) || !options.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'auaa-chips';

    options.forEach(function (label) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'auaa-chip';
      chip.textContent = label;

      chip.addEventListener('click', function () {
        if (busy) return;
        clearChips();
        inputEl.value = label;
        send();
      });

      wrap.appendChild(chip);
    });

    bodyEl.appendChild(wrap);
    scrollDown();
  }


  // ==========================================
  // TYPING INDICATOR
  // ==========================================

  function showTyping() {
    hideTyping();

    var typing = document.createElement('div');
    typing.className = 'auaa-typing';
    typing.id = 'auaaTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';

    bodyEl.appendChild(typing);
    scrollDown();
  }

  function hideTyping() {
    var typing = document.getElementById('auaaTyping');
    if (typing) typing.remove();
  }


  // ==========================================
  // OPEN / CLOSE
  // ==========================================

  function open() {
    panel.classList.add('auaa-open');
    launcher.classList.add('auaa-hide');

    if (!greeted) {
      greeted = true;
      addBubble(
        'bot',
        'Welcome to AuraUP. I can put together complete looks for the gym, the court or lounging, find a piece, check sizing, or answer questions about shipping and returns. What are you looking for?'
      );
    }

    setTimeout(function () {
      inputEl.focus();
    }, 300);
  }

  function close() {
    panel.classList.remove('auaa-open');
    launcher.classList.remove('auaa-hide');
  }


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  async function send() {
    var text = inputEl.value.trim();
    if (!text || busy) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';

    clearChips();
    addBubble('user', text);

    messages.push({ role: 'user', content: text });
    messages = messages.slice(-12);

    busy = true;
    sendEl.disabled = true;
    showTyping();

    try {
      var response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages })
      });

      var data = null;
      try {
        data = await response.json();
      } catch (error) {
        data = null;
      }

      hideTyping();

      if (!response.ok) {
        throw new Error((data && data.error) || 'HTTP ' + response.status);
      }

      var reply =
        (data && data.reply) ||
        'Sorry, I could not answer that. Please contact us on WhatsApp for a quick reply.';

      var bubble = addBubble('bot', reply);

      messages.push({ role: 'assistant', content: reply });
      messages = messages.slice(-12);

      var hasOutfits = addOutfits(data && data.outfits);
      addCards(data && data.products);
      addChips(data && data.quick_replies);

      if (hasOutfits) {
        scrollToElement(bubble);
      }
    } catch (error) {
      console.error('AuraUP assistant request failed:', error);
      hideTyping();
      addBubble('bot', 'Something went wrong. Please reach us on WhatsApp for help.');
    } finally {
      busy = false;
      sendEl.disabled = false;
      inputEl.focus();
    }
  }


  // ==========================================
  // EVENTS
  // ==========================================

  launcher.addEventListener('click', open);

  panel.querySelector('[data-close]').addEventListener('click', close);

  sendEl.addEventListener('click', send);

  inputEl.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  });

  inputEl.addEventListener('input', function () {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + 'px';
    // Only allow scrolling once a long message passes the max height.
    inputEl.style.overflowY = inputEl.scrollHeight > 90 ? 'auto' : 'hidden';
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('auaa-open')) {
      close();
    }
  });
})();