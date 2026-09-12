/* =========================================================
   Bar do Compadre — configurações e comportamento do site
   =========================================================
   Tudo que muda com frequência (WhatsApp, endereço, horário,
   redes sociais) fica centralizado aqui em cima. Edite só
   este bloco — o resto da página se atualiza sozinho. */

const SITE = {
  // Número do WhatsApp no formato internacional, só números:
  // 55 (Brasil) + DDD + número.
  whatsapp: "5511991147454",

  whatsappMessages: {
    padrao: "Olá! Vim pelo site do Bar do Compadre e gostaria de mais informações.",
    orcamento: "Olá! Vim pelo site e quero fazer um orçamento para um evento no Bar do Compadre / Eventos Compadre.",
    cardapio: "Olá! Vi o cardápio no site do Bar do Compadre e quero fazer um pedido.",
    espetosPF: "Olá! Quero pedir um combo de espetinhos para churrasco (pessoa física).",
    espetosPJ: "Olá! Sou de uma empresa e quero um orçamento de combos de espetinhos para churrasco (pessoa jurídica, com nota fiscal).",
    espetosRevenda: "Olá! Tenho um bar/restaurante e quero informações sobre revenda e distribuição de espetinhos.",
  },

  address: "Rua das Orquídeas, 619 — Cajamar Portais, Cajamar - SP",
  mapsQuery: "Rua das Orquídeas, 619, Cajamar Portais, Cajamar - SP",

  instagram: "https://www.instagram.com/ocumpadree/",
  facebook: "https://facebook.com/", // TODO: coloque a página

  hours: [
    { dia: "Terça a Quinta", horario: "18h às 00h" },
    { dia: "Sexta e Sábado", horario: "18h às 02h" },
    { dia: "Domingo", horario: "16h às 23h" },
    { dia: "Segunda", horario: "Fechado" },
  ],
};

/* ---------- Helpers ---------- */
function waLink(messageKey) {
  const msg = SITE.whatsappMessages[messageKey] || SITE.whatsappMessages.padrao;
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
}

/* Faz um .ph-image mostrar o placeholder estilizado se a imagem falhar
   (arquivo ainda não existe, ou link externo expirado/quebrado). */
function wireImagePlaceholder(img) {
  img.addEventListener("error", () => img.closest(".ph-image")?.classList.add("is-missing"), { once: true });
  if (img.complete && img.naturalWidth === 0) {
    img.closest(".ph-image")?.classList.add("is-missing");
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.addEventListener("DOMContentLoaded", () => {
  /* Preenche todos os links/botões que apontam pro WhatsApp */
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const key = el.getAttribute("data-wa") || "padrao";
    el.setAttribute("href", waLink(key));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* Preenche endereço, mapa, instagram, facebook onde marcados */
  document.querySelectorAll("[data-config='address']").forEach((el) => (el.textContent = SITE.address));
  document.querySelectorAll("[data-config='instagram']").forEach((el) => el.setAttribute("href", SITE.instagram));
  document.querySelectorAll("[data-config='facebook']").forEach((el) => el.setAttribute("href", SITE.facebook));

  const mapFrame = document.querySelector("[data-config='map']");
  if (mapFrame) {
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`;
  }

  const hoursList = document.querySelector("[data-config='hours']");
  if (hoursList) {
    hoursList.innerHTML = SITE.hours
      .map((h) => `<li><span>${h.dia}</span><strong>${h.horario}</strong></li>`)
      .join("");
  }

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const list = document.querySelector(".nav__list");
  if (toggle && list) {
    toggle.addEventListener("click", () => {
      const open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    list.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        list.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Placeholder de imagem: some se a foto real não existir ---------- */
  document.querySelectorAll(".ph-image img").forEach(wireImagePlaceholder);

  /* ---------- Revelar seções ao rolar ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Marca o link ativo do menu ao rolar pelas seções ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");
  if ("IntersectionObserver" in window && sections.length) {
    const navIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((sec) => navIo.observe(sec));
  }

  /* ---------- Formulário de orçamento -> monta mensagem e abre no WhatsApp ---------- */
  const form = document.querySelector("#form-orcamento");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = (data.get("nome") || "").toString().trim();
      const tipo = (data.get("tipo") || "").toString().trim();
      const data_evento = (data.get("data_evento") || "").toString().trim();
      const pessoas = (data.get("pessoas") || "").toString().trim();
      const mensagem = (data.get("mensagem") || "").toString().trim();

      const linhas = [
        "Olá! Quero fazer um orçamento pelo site do Bar do Compadre / Eventos Compadre.",
        nome && `Nome: ${nome}`,
        tipo && `Tipo de evento/pedido: ${tipo}`,
        data_evento && `Data desejada: ${data_evento}`,
        pessoas && `Número de pessoas: ${pessoas}`,
        mensagem && `Mensagem: ${mensagem}`,
      ].filter(Boolean);

      const url = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(linhas.join("\n"))}`;
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initInstagramEmbeds();
  initTilt3D();
  initPromoFeed();
});

/* =========================================================
   Instagram — fotos e vídeos reais do perfil
   =========================================================
   Cada bloco [data-ig-embed] no HTML tem um atributo
   data-ig-url. Deixe vazio para mostrar um placeholder, ou
   cole ali o link de um post/reels público (Instagram > ... >
   Copiar link) para o post/vídeo real aparecer embutido no
   site — sem precisar de chave de API. */
function initInstagramEmbeds() {
  const embeds = document.querySelectorAll("[data-ig-embed]");
  if (!embeds.length) return;

  let hasReal = false;
  embeds.forEach((el) => {
    const url = (el.getAttribute("data-ig-url") || "").trim();
    if (url.startsWith("http")) {
      hasReal = true;
      el.classList.add("ig-embed--ready");
      // O link de reserva abaixo garante uma saída funcional mesmo se o
      // widget do Instagram vier quebrado, vazio ou não carregar a tempo.
      el.innerHTML =
        `<div class="ig-embed__media"><blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="margin:0;width:100%;"></blockquote></div>` +
        `<a class="ig-frame__link" href="${url}" target="_blank" rel="noopener">Ver no Instagram ↗</a>`;
    } else {
      el.classList.add("ig-embed--placeholder");
      el.innerHTML =
        '<div class="ig-embed__ph"><span class="ig-embed__icon">📸</span><p>Cole aqui o link do post ou reels<br><code>data-ig-url="https://www.instagram.com/p/..."</code></p></div>';
    }
  });

  if (!hasReal) return;

  if (window.instgrm) {
    window.instgrm.Embeds.process();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.onload = () => window.instgrm && window.instgrm.Embeds.process();
  document.body.appendChild(script);
}

/* =========================================================
   Promoções sincronizadas automaticamente do Instagram
   =========================================================
   Lê assets/data/instagram-posts.json — gerado pelo GitHub Action
   .github/workflows/instagram-sync.yml (veja docs/instagram-api-setup.md
   para configurar). Enquanto não estiver configurado, o arquivo existe
   com posts: [] e a seção mostra uma mensagem simpática no lugar. */
async function initPromoFeed() {
  const grid = document.querySelector("#promo-grid");
  if (!grid) return;

  try {
    const res = await fetch("assets/data/instagram-posts.json", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();

    const updatedEl = document.querySelector("[data-promo-updated]");
    if (updatedEl && data.updatedAt) {
      const d = new Date(data.updatedAt);
      updatedEl.textContent = `Atualizado em ${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (!data.posts || !data.posts.length) {
      grid.innerHTML = data.updatedAt
        ? `<p class="promo-empty">Nenhuma promoção marcada com "${escapeHtml(
            data.keyword || "promo"
          )}" no momento — siga @ocumpadree pra não perder a próxima.</p>`
        : '<p class="promo-empty">Em breve: promoções sincronizadas automaticamente do Instagram.</p>';
      return;
    }

    grid.innerHTML = data.posts
      .map((p) => {
        const caption = escapeHtml((p.caption || "").slice(0, 180));
        const link = escapeHtml(p.permalink || SITE.instagram);
        return `
          <article class="promo-card">
            <span class="ph-image promo-card__media" data-icon="📸" data-label="ver no Instagram">
              <img src="${escapeHtml(p.imageUrl || "")}" alt="Promoção Instagram" loading="lazy" />
            </span>
            ${p.isVideo ? '<span class="promo-card__play">▶</span>' : ""}
            <div class="promo-card__body">
              <p class="promo-card__caption">${caption}</p>
              <a class="promo-card__link" href="${link}" target="_blank" rel="noopener">Ver no Instagram ↗</a>
            </div>
          </article>`;
      })
      .join("");

    grid.querySelectorAll(".ph-image img").forEach(wireImagePlaceholder);
  } catch (err) {
    // Sem feed ainda (antes do primeiro run do Action) — mantém a mensagem padrão do HTML.
  }
}

/* =========================================================
   Efeito 3D (tilt) — cards inclinam sutilmente seguindo o mouse
   ========================================================= */
function initTilt3D() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduceMotion) return;

  const maxTilt = 8; // graus

  document.querySelectorAll(".tilt").forEach((card) => {
    const shine = card.querySelector(".tilt__shine");

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale(1.015)`;
      if (shine) shine.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.16), transparent 60%)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      if (shine) shine.style.background = "transparent";
    });
  });
}
