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
    document.getElementById('sub').textContent = 'Bấm vào từng ruy băng để đọc thư.';
    rain();
  });

  // 4 ruy băng: mỗi lần chỉ mở 1 lá, mở lá mới thì lá cũ tự đóng
  var ribbons = document.querySelectorAll('.ribbon');
  function panelOf(btn){ return document.getElementById(btn.getAttribute('aria-controls')); }

  // Mở đủ 4 lá giữa -> hiện lá bên phải; mở lá bên phải (r5) -> hiện lá bên trái
  var seen = {}, rightOn = false, leftOn = false;
  var mids = document.querySelectorAll('.letters .ribbon');
  function showExtra(id){
    setTimeout(function(){ document.getElementById(id).classList.add('show'); }, 1000);
  }
  function unlock(btn){
    seen[btn.id] = true;
    if (!rightOn && Array.prototype.every.call(mids, function(b){ return seen[b.id]; })){
      rightOn = true; showExtra('extra-right');
    }
    if (btn.id === 'r5' && !leftOn){ leftOn = true; showExtra('extra-left'); }
  }

  ribbons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var willOpen = btn.getAttribute('aria-expanded') !== 'true';

      ribbons.forEach(function(b){
        b.setAttribute('aria-expanded', 'false');
        panelOf(b).classList.remove('open');
      });

      if (willOpen){
        btn.setAttribute('aria-expanded', 'true');
        unlock(btn);
        panelOf(btn).classList.add('open');
        setTimeout(function(){
          panelOf(btn).scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'nearest'});
        }, 850);
      }
    });
  });

  // Nền động: sao lấp lánh + tim bay lên
  var bg = document.querySelector('.bg');
  if (bg && !reduce){
    for (var a = 0; a < 26; a++){
      var sp = document.createElement('i'); sp.className = 'spark';
      sp.style.left = (Math.random() * 100) + '%'; sp.style.top = (Math.random() * 100) + '%';
      var z = 6 + Math.random() * 10; sp.style.width = z + 'px'; sp.style.height = z + 'px';
      sp.style.animationDuration = (2.5 + Math.random() * 4) + 's';
      sp.style.animationDelay = (Math.random() * 5) + 's';
      bg.appendChild(sp);
    }
    for (var h = 0; h < 9; h++){
      var ht = document.createElementNS(svgNS, 'svg'), u = document.createElementNS(svgNS, 'use');
      ht.setAttribute('viewBox', '0 0 100 100'); ht.setAttribute('class', 'bgheart');
      u.setAttribute('href', '#heart'); ht.appendChild(u);
      var hs = 14 + Math.random() * 18;
      ht.style.width = hs + 'px'; ht.style.height = hs + 'px';
      ht.style.left = (Math.random() * 100) + '%';
      ht.style.setProperty('--sx', (Math.random() * 80 - 40) + 'px');
      ht.style.animationDuration = (16 + Math.random() * 14) + 's';
      ht.style.animationDelay = (-Math.random() * 20) + 's';
      bg.appendChild(ht);
    }
  }
})();