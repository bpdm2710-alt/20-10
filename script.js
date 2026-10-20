(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tên người nhận / người gửi qua link: ?to=Lan&from=Minh
  var q = new URLSearchParams(location.search);
  var to = (q.get('to') || '').trim(), from = (q.get('from') || '').trim();
  if (to)   document.getElementById('title').textContent = 'Chúc mừng 20/10, ' + to;
  if (from) document.getElementById('sign').textContent = 'Từ ' + from;

  // Tạo cánh hoa: 8 cánh ngoài + 8 cánh trong
  var g = document.getElementById('petals'), svgNS = 'http://www.w3.org/2000/svg';
  function petal(cls, rot, d){
    var e = document.createElementNS(svgNS, 'ellipse');
    e.setAttribute('class', 'pt ' + cls);
    e.setAttribute('cx', 100); e.setAttribute('cy', 56);
    e.setAttribute('rx', 23);  e.setAttribute('ry', 46);
    e.style.setProperty('--r', rot + 'deg');
    e.style.setProperty('--d', d + 's');
    g.appendChild(e);
  }
  for (var i = 0; i < 8; i++) petal('o', i * 45, i * 0.05);
  for (var j = 0; j < 8; j++) petal('i', j * 45 + 22.5, 0.4 + j * 0.05);

  // Cánh hoa rơi
  function rain(){
    if (reduce) return;
    for (var k = 0; k < 26; k++){
      var s = document.createElement('span');
      s.className = 'fall';
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.setProperty('--x', (Math.random() * 160 - 80) + 'px');
      s.style.animationDuration = (5 + Math.random() * 5) + 's';
      s.style.animationDelay = (Math.random() * 2.5) + 's';
      var sz = 10 + Math.random() * 10;
      s.style.width = sz + 'px'; s.style.height = (sz * 1.3) + 'px';
      document.body.appendChild(s);
      (function(n){ setTimeout(function(){ n.remove(); }, 12000); })(s);
    }
  }

  // Nút "Mở quà": hoa nở, ruy băng hiện ra
  document.getElementById('open').addEventListener('click', function(){
    document.getElementById('app').classList.add('opened');
    document.body.classList.add('lit');                       // dây đèn rủ xuống + bật sáng
    setTimeout(function(){ lightsPlayed = true; }, 4500);     // sau đó resize sẽ không chạy lại hiệu ứng
    document.getElementById('sub').textContent = 'Bấm vào từng ruy băng để đọc thư.';
    rain();
  });

  // 4 ruy băng: mỗi lần chỉ mở 1 lá, mở lá mới thì lá cũ tự đóng
  var ribbons = document.querySelectorAll('.ribbon');
  function panelOf(btn){ return document.getElementById(btn.getAttribute('aria-controls')); }

  ribbons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var willOpen = btn.getAttribute('aria-expanded') !== 'true';

      ribbons.forEach(function(b){
        b.setAttribute('aria-expanded', 'false');
        panelOf(b).classList.remove('open');
      });

      if (willOpen){
        btn.setAttribute('aria-expanded', 'true');
        panelOf(btn).classList.add('open');
        setTimeout(function(){
          panelOf(btn).scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'nearest'});
        }, 850);
      }
    });
  });
  // Dây đèn nhấp nháy ở hai bên trang
  var COLORS = ['#ffcf4d', '#b48cff', '#ff8fb3', '#5fdcae', '#ff9a6b'];  // màu bóng đèn
  var SWAG = 150;     // chiều dài mỗi nhịp dây (px)
  var SAG  = 52;      // độ võng của dây (px)
  var T    = [0.15, 0.38, 0.62, 0.85];   // vị trí 4 bóng trên mỗi nhịp
  var lightsPlayed = false;

  function buildLights(){
    ['l', 'r'].forEach(function(side){
      var box = document.querySelector('.lights-' + side);
      if (!box){
        box = document.createElement('div');
        box.className = 'lights lights-' + side;
        box.setAttribute('aria-hidden', 'true');
        document.body.appendChild(box);
      }
      var H = window.innerHeight, n = Math.ceil(H / SWAG) + 1;
      var d = 'M0 0', bulbs = '';
      for (var s = 0; s < n; s++){
        var y0 = s * SWAG, y1 = y0 + SWAG, cy = y0 + SWAG / 2;
        d += ' Q ' + SAG + ' ' + cy + ' 0 ' + y1;
        T.forEach(function(t, idx){
          var tt = t + (Math.random() * 0.06 - 0.03), u = 1 - tt;
          var x = 2 * u * tt * SAG;
          var y = u * u * y0 + 2 * u * tt * cy + tt * tt * y1;
          var col = COLORS[(s * T.length + idx + (side === 'r' ? 2 : 0)) % COLORS.length];
          var dur = (1.4 + Math.random() * 2.4).toFixed(2), dl = (Math.random() * 4).toFixed(2);
          var ed = lightsPlayed ? 0 : (1.1 + (s * T.length + idx) * 0.045 + (side === 'r' ? 0.03 : 0)).toFixed(2);  // thứ tự bật sáng
          bulbs += '<i class="bulb" style="left:' + x.toFixed(1) + 'px;top:' + (y + 3).toFixed(1) +
                   'px;--c:' + col + ';--dur:' + dur + 's;--dl:-' + dl + 's;--ed:' + ed + 's"></i>';
        });
      }
      box.innerHTML = '<svg width="56" height="' + H + '" viewBox="0 0 56 ' + H + '">' +
        '<path d="' + d + '" fill="none" stroke="#8e6aa8" stroke-width="1.4" opacity=".75"/></svg>' + bulbs;
    });
  }
  buildLights();
  var lightsTimer;
  window.addEventListener('resize', function(){
    clearTimeout(lightsTimer); lightsTimer = setTimeout(buildLights, 250);
  });
})();