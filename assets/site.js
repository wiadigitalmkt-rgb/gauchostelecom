// Site da Gaúchos Telecom. Sem bibliotecas de fora: tudo aqui.
// A consulta de cobertura e o pedido vão para o servidor (mesmo endereço do site), que confere no mapa da rede.
(() => {
  const ZAP = '5551989687050';
  const FIM_BLACK_FRIDAY = new Date('2026-12-01T00:00:00-03:00');

  const PLANOS = [
    { grupo: 'Gaúcho Mais+', mega: 400, preco: 89.9, uso: 'Casa com até 4 pessoas, TV e celulares ao mesmo tempo.' },
    { grupo: 'Gaúcho Mais+', mega: 500, preco: 99.9, uso: 'Família com várias TVs e celulares, sem disputa de internet.' },
    { grupo: 'Gaúcho Mais+', mega: 600, preco: 109.9, uso: 'Casa cheia, com câmeras de segurança e home office.' },
    { grupo: 'Gaúcho Plus', mega: 700, preco: 119.9, uso: 'Filmes e séries em 4K em mais de uma TV.' },
    { grupo: 'Gaúcho Plus', mega: 800, preco: 129.9, uso: 'Jogos online com resposta rápida e downloads pesados.' },
    { grupo: 'Gaúcho Plus', mega: 900, preco: 139.9, uso: 'Streaming, jogos e trabalho pesado, tudo junto, o dia inteiro.' },
    { grupo: 'Gaúcho Ultra', mega: 1000, preco: 149.9, uso: 'A velocidade máxima, para quem não abre mão de nada.' },
  ];
  const GRUPOS = [
    { nome: 'Gaúcho Mais+', frase: 'Para a família toda' },
    { nome: 'Gaúcho Plus', frase: 'Para filmes, séries e jogos' },
    { nome: 'Gaúcho Ultra', frase: 'Velocidade máxima', classe: 'grupo-ultra' },
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reais = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;
  const megaTexto = (m) => (m >= 1000 ? `${m / 1000} GIGA` : `${m} MEGA`);
  const zap = (texto) => `https://wa.me/${ZAP}?text=${encodeURIComponent(texto)}`;
  const querPlano = (p) => zap(`Olá! Quero contratar o ${p.grupo} de ${megaTexto(p.mega)} por ${reais(p.preco)} por mês.`);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Links de WhatsApp com a mensagem pronta
  function ligarZap(raiz = document) {
    $$('[data-zap]', raiz).forEach((a) => { a.href = zap(a.dataset.zap); a.target = '_blank'; a.rel = 'noopener'; });
  }

  // Black Friday: some sozinha depois de 30/11
  if (new Date() < FIM_BLACK_FRIDAY) { $('#faixa-bf').hidden = false; $('#ip-bf').hidden = false; }

  // Menu do celular
  const menuBotao = $('#menu-botao');
  menuBotao.addEventListener('click', () => {
    const aberto = $('#menu').classList.toggle('aberto');
    menuBotao.setAttribute('aria-expanded', String(aberto));
  });
  $$('#menu a').forEach((a) => a.addEventListener('click', () => { $('#menu').classList.remove('aberto'); menuBotao.setAttribute('aria-expanded', 'false'); }));

  // Planos por grupo
  $('#grupos').innerHTML = GRUPOS.map((g) => `
    <article class="grupo ${g.classe || ''}">
      <div class="grupo-nome"><h3>${esc(g.nome)}</h3><p>${esc(g.frase)}</p></div>
      <div class="grupo-planos">${PLANOS.filter((p) => p.grupo === g.nome).map((p) => `
        <div class="plano">
          <p class="plano-mega">${megaTexto(p.mega)}</p>
          <p class="plano-preco">${reais(p.preco)} <small>por mês</small></p>
          <p class="plano-uso">${esc(p.uso)}</p>
          <a class="botao ${g.classe ? 'botao-amarelo' : 'botao-verde'}" href="${querPlano(p)}" target="_blank" rel="noopener">Quero este plano</a>
        </div>`).join('')}
      </div>
    </article>`).join('');

  // Quem usa a internet aí? (soma o que cada coisa pede de internet ao mesmo tempo)
  const ITENS = [
    { id: 'pessoas', nome: 'Pessoas em casa', dica: 'celular, redes sociais e vídeos', mbps: 45, valor: 3, min: 1 },
    { id: 'tvs', nome: 'TVs assistindo juntas', dica: 'filmes, séries e futebol', mbps: 60, valor: 1 },
    { id: 'games', nome: 'Videogame ou PC gamer', dica: 'jogo online e downloads', mbps: 120, valor: 0 },
    { id: 'trabalho', nome: 'Home office ou aula online', dica: 'chamada de vídeo e arquivos', mbps: 60, valor: 0 },
    { id: 'cameras', nome: 'Câmeras de segurança', dica: 'vendo pelo celular de fora', mbps: 15, valor: 0 },
  ];
  $('#contadores').innerHTML = ITENS.map((i) => `
    <div class="contador">
      <div><strong>${i.nome}</strong><span>${i.dica}</span></div>
      <div class="passo-num">
        <button type="button" data-item="${i.id}" data-d="-1" aria-label="Menos ${i.nome}">−</button>
        <output id="n-${i.id}">${i.valor}</output>
        <button type="button" data-item="${i.id}" data-d="1" aria-label="Mais ${i.nome}">+</button>
      </div>
    </div>`).join('');
  function recomendar() {
    const total = ITENS.reduce((s, i) => s + i.valor * i.mbps, 0);
    const p = PLANOS.find((x) => x.mega >= total) || PLANOS[PLANOS.length - 1];
    $('#qp-mega').textContent = megaTexto(p.mega);
    $('#qp-grupo').textContent = p.grupo;
    $('#qp-preco').textContent = `${reais(p.preco)} por mês`;
    $('#qp-porque').textContent = `A sua casa usa por volta de ${Math.max(total, 50)} MEGA nos horários de pico. O ${megaTexto(p.mega)} dá conta com folga.`;
    $('#qp-quero').href = querPlano(p);
    $('#qp-quero').target = '_blank';
  }
  $('#contadores').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-item]');
    if (!b) return;
    const i = ITENS.find((x) => x.id === b.dataset.item);
    i.valor = Math.min(12, Math.max(i.min || 0, i.valor + Number(b.dataset.d)));
    $(`#n-${i.id}`).textContent = i.valor;
    recomendar();
  });
  recomendar();

  // Arrasta e vê a diferença
  const DOWNLOADS = [
    { nome: 'Filme em 4K', gb: 20 },
    { nome: 'Jogo novo de videogame', gb: 100 },
    { nome: 'Fotos do celular para a nuvem', gb: 5 },
  ];
  const tempo = (gb, mbps) => {
    const s = (gb * 8000) / (mbps * 0.9);
    if (s < 60) return `${Math.round(s)} s`;
    const min = Math.round(s / 60);
    return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;
  };
  const regua = $('#regua');
  regua.max = String(PLANOS.length - 1);
  $('#regua-marcas').innerHTML = PLANOS.map((p) => `<span>${p.mega >= 1000 ? '1 GIGA' : p.mega}</span>`).join('');
  $('#corrida').innerHTML = DOWNLOADS.map((d, k) => `
    <div class="corrida-item">
      <p><strong>${d.nome}</strong><span>${d.gb} GB</span></p>
      <div class="pista"><i id="pista-${k}"></i></div>
      <p class="tempos"><strong id="tempo-${k}"></strong><span>${tempo(d.gb, 50)} com 50 MEGA</span></p>
    </div>`).join('');
  function mostrarVelocidade() {
    const p = PLANOS[Number(regua.value)];
    regua.setAttribute('aria-valuetext', `${megaTexto(p.mega)}, ${reais(p.preco)} por mês`);
    $('#vel-grupo').textContent = p.grupo;
    $('#vel-mega').textContent = megaTexto(p.mega);
    $('#vel-preco').innerHTML = `${reais(p.preco)} <small>por mês, com fidelidade de 12 meses</small>`;
    $('#vel-quero').href = querPlano(p);
    $('#vel-quero').target = '_blank';
    DOWNLOADS.forEach((d, k) => {
      $(`#tempo-${k}`).textContent = tempo(d.gb, p.mega);
      $(`#pista-${k}`).style.width = `${Math.max(3, (50 / p.mega) * 100)}%`;
    });
  }
  regua.addEventListener('input', mostrarVelocidade);
  mostrarVelocidade();

  // Atendimento aberto agora? (horário de Brasília)
  (function horario() {
    const agora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const d = agora.getDay(); const h = agora.getHours() + agora.getMinutes() / 60;
    const [ini, fim] = d === 0 ? [14, 18] : d === 6 ? [9, 20] : [9, 22];
    const aberto = h >= ini && h < fim;
    const el = $('#aberto');
    el.textContent = aberto ? `Atendimento aberto agora, até as ${fim}h.` : 'Atendimento fechado agora. Mande sua mensagem que a gente responde assim que abrir.';
    el.classList.toggle('fechado', !aberto);
  })();

  // Máscaras simples
  const so = (v) => v.replace(/\D/g, '');
  // Telefone: tira o +55 do Brasil quando a pessoa digita ou cola com ele
  const semPais = (d) => (d.length > 11 && d.startsWith('55') ? d.slice(2) : d);
  function mascaraCep(el) { el.addEventListener('input', () => { const d = so(el.value).slice(0, 8); el.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d; }); }
  function mascaraFone(el) {
    el.addEventListener('input', () => {
      const d = semPais(so(el.value)).slice(0, 11);
      el.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
    });
  }

  // Cobertura
  const cep = $('#cep'); const numero = $('#numero');
  mascaraCep(cep);
  let endereco = null; // {cep, rua, bairro, cidade, uf, numero} ou {lat, lng}
  cep.addEventListener('input', async () => {
    const d = so(cep.value);
    $('#cob-rua').textContent = '';
    endereco = null;
    if (d.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = await r.json();
      if (j.erro) { $('#cob-rua').textContent = 'CEP não encontrado. Confira os números.'; return; }
      endereco = { cep: d, rua: j.logradouro, bairro: j.bairro, cidade: j.localidade, uf: j.uf };
      $('#cob-rua').textContent = [j.logradouro, j.bairro, `${j.localidade}/${j.uf}`].filter(Boolean).join(' - ');
    } catch { $('#cob-rua').textContent = 'Não deu para buscar o CEP agora. Tente de novo ou fale no WhatsApp.'; }
  });

  function mostrarResposta(tipo, titulo, texto, comBotao) {
    const box = $('#cob-resposta');
    box.className = `cob-resposta ${tipo}`;
    box.hidden = false;
    box.innerHTML = `<strong>${esc(titulo)}</strong><span>${esc(texto)}</span>${comBotao === 'pedido' ? '<br><button type="button" class="botao botao-amarelo" id="abrir-pedido">Quero contratar</button>'
      : comBotao === 'zap' ? `<br><a class="botao botao-verde" target="_blank" rel="noopener" href="${zap(`Olá! Quero saber se a fibra chega no meu endereço: ${textoEndereco()}`)}">Falar no WhatsApp</a>` : ''}`;
    const b = $('#abrir-pedido');
    if (b) b.addEventListener('click', abrirPedido);
  }
  const textoEndereco = () => (endereco?.rua ? `${endereco.rua}, ${endereco.numero || ''} - ${endereco.bairro || ''} - ${endereco.cidade}/${endereco.uf}` : 'pela localização do celular');

  async function consultar(corpo) {
    const botao = $('#cob-botao');
    botao.disabled = true; botao.textContent = 'Consultando...';
    try {
      const r = await fetch('/api/site/cobertura', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo) });
      if (!r.ok) throw new Error('falhou');
      const j = await r.json();
      if (j.endereco && !endereco?.rua) endereco = { ...endereco, rua: j.endereco };
      if (j.atende && j.certeza) mostrarResposta('sim', 'Temos fibra aí!', 'Deixe os seus dados que a gente chama você para agendar a instalação.', 'pedido');
      else if (j.atende) mostrarResposta('talvez', 'Parece que temos fibra aí', 'Um atendente confere o seu endereço e chama você. Deixe os seus dados.', 'pedido');
      else mostrarResposta('nao', 'Ainda não chegamos aí', 'Deixe os seus dados que a gente avisa quando a fibra chegar na sua rua.', 'pedido');
    } catch {
      mostrarResposta('talvez', 'A gente confere pelo WhatsApp', 'Não deu para consultar o mapa agora. Mande o seu endereço que a gente responde rapidinho.', 'zap');
    } finally { botao.disabled = false; botao.textContent = 'Consultar'; }
  }
  $('#cob-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!endereco?.cidade) { $('#cob-rua').textContent = 'Digite o CEP da sua rua (8 números).'; cep.focus(); return; }
    if (!numero.value.trim()) { $('#cob-rua').textContent = 'Digite o número da casa.'; numero.focus(); return; }
    endereco.numero = numero.value.trim();
    consultar(endereco);
  });
  $('#cob-local').addEventListener('click', () => {
    if (!navigator.geolocation) { mostrarResposta('talvez', 'Sem localização', 'O seu navegador não liberou a localização. Use o CEP.', ''); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { endereco = { lat: pos.coords.latitude, lng: pos.coords.longitude }; consultar(endereco); },
      () => mostrarResposta('talvez', 'Sem localização', 'Não deu para pegar a localização. Use o CEP e o número.', ''),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  });

  // Pedido "Quero a fibra em casa"
  const janela = $('#janela');
  $('#sel-plano').innerHTML = '<option value="">Ainda não sei</option>' + PLANOS.map((p) => `<option value="${p.grupo} ${megaTexto(p.mega)} (${reais(p.preco)})">${megaTexto(p.mega)} · ${reais(p.preco)}</option>`).join('');
  mascaraFone($('#form-pedido [name=telefone]'));
  function abrirPedido() {
    $('#janela-end').textContent = textoEndereco();
    $('#form-pedido').hidden = false; $('#pedido-ok').hidden = true; $('#pedido-erro').hidden = true;
    if (janela.showModal) janela.showModal(); else janela.setAttribute('open', '');
  }
  $('#fechar').addEventListener('click', () => janela.close());
  janela.addEventListener('click', (e) => { if (e.target === janela) janela.close(); });
  $('#form-pedido').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const erro = (t) => { $('#pedido-erro').textContent = t; $('#pedido-erro').hidden = false; };
    if (f.nome.value.trim().length < 3) return erro('Escreva o seu nome completo.');
    const tel = semPais(so(f.telefone.value));
    if (tel.length < 10) return erro('Confira o WhatsApp, com DDD.');
    if (!f.aceite.checked) return erro('Marque que concorda em ser chamado.');
    const b = $('#pedido-botao'); b.disabled = true; b.textContent = 'Enviando...';
    try {
      const r = await fetch('/api/site/interesse', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...endereco, nome: f.nome.value.trim(), telefone: tel, complemento: f.complemento.value.trim(), plano_texto: f.plano.value || null,
          periodo: f.periodo.value, aceite: true, site_web: f.site_web.value }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.erro || 'Não deu para enviar agora.');
      f.hidden = true; $('#pedido-ok').hidden = false; ligarZap($('#pedido-ok'));
    } catch (err) {
      erro(`${err.message} Se preferir, fale no WhatsApp (51) 98968-7050.`);
    } finally { b.disabled = false; b.textContent = 'Enviar o pedido'; }
  });

  ligarZap();
})();
