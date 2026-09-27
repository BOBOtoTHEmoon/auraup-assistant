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
      'padding:14px 0 14px 14px;' +
    '}' +

    '.auaa-outfit-name{' +
      'margin:0 14px 10px 0;' +
      'font-size:.6rem;' +
      'font-weight:500;' +
      'letter-spacing:.2em;' +
      'text-transform:uppercase;' +
      'color:#1a1a1a;' +
    '}' +

    '.auaa-row{' +
      'display:flex;' +
      'gap:8px;' +
      'overflow-x:auto;' +
      'padding-right:14px;' +
      'scroll-snap-type:x proximity;' +
      '-webkit-overflow-scrolling:touch;' +
      'scrollbar-width:none;' +
    '}' +

    '.auaa-row::-webkit-scrollbar{display:none;}' +

    '.auaa-tile{' +
      'flex:0 0 100px;' +
      'text-decoration:none;' +
      'color:inherit;' +
      'scroll-snap-align:start;' +
    '}' +

    '.auaa-tile img,' +
    '.auaa-tile-img{' +
      'display:block;' +
      'width:100px;' +
      'height:124px;' +
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
      'max-height:90px;' +
    '}' +

    '.auaa-input:focus{border-color:#1a1a1a;}' +

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
      '<textarea class="auaa-input" id="auaaInput" rows="1" maxlength="1000" aria-label="Message AuraUP assistant" placeholder="Ask for a gym fit, sizing, shipping..."></textarea>' +
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
  // SINGLE PRODUCT CARDS
  // ==========================================

  function addCards(products) {
    if (!Array.isArray(products) || !products.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'auaa-cards';

    products.forEach(function (product) {
      if (!product || !product.url) return;

      var link = document.createElement('a');
      link.className = 'auaa-card';
      link.href = product.url;
      link.target = '_top';

      link.innerHTML =
        productImage(product, 'auaa-card-img') +
        '<div class="auaa-card-info">' +
          '<p class="auaa-card-name">' + esc(product.title) + '</p>' +
          '<p class="auaa-card-price">' + esc(product.price) + '</p>' +
          (product.available ? '' : '<span class="auaa-card-oos">Sold out</span>') +
        '</div>';

      wrap.appendChild(link);
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

        var tile = document.createElement('a');
        tile.className = 'auaa-tile';
        tile.href = item.url;
        tile.target = '_top';

        tile.innerHTML =
          productImage(item, 'auaa-tile-img') +
          '<p class="auaa-tile-role">' + esc(ROLE_LABELS[item.role] || '') + '</p>' +
          '<p class="auaa-tile-name">' + esc(item.title) + '</p>' +
          '<p class="auaa-tile-price">' + esc(item.price) + '</p>' +
          (item.preorder ? '<p class="auaa-tile-pre">Pre-order</p>' : '');

        row.appendChild(tile);
      });

      if (!row.children.length) return;

      block.innerHTML = '<p class="auaa-outfit-name">' + esc(outfit.name) + '</p>';
      block.appendChild(row);
      wrap.appendChild(block);
    });

    if (!wrap.children.length) return false;

    bodyEl.appendChild(wrap);
    return true;
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
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('auaa-open')) {
      close();
    }
  });
})();