/**
 * Busca os posts recentes do Instagram (via Graph API — Instagram API with
 * Instagram Login) da conta profissional configurada, filtra os que trazem
 * a palavra-chave de promoção na legenda, e grava o resultado em
 * assets/data/instagram-posts.json — arquivo que o site lê para montar os
 * cards de "Promoções da semana" sem precisar de nenhum token no navegador.
 *
 * Variáveis de ambiente esperadas:
 *   TOKEN          - access token (de longa duração) da conta do Instagram
 *   IG_USER_ID      - ID numérico da conta profissional do Instagram
 *   PROMO_KEYWORD  - palavra-chave que marca uma promoção (padrão: "promo")
 *
 * Uso: node scripts/fetch-instagram.js
 */

const fs = require("fs");
const path = require("path");

const TOKEN = process.env.TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const KEYWORD = (process.env.PROMO_KEYWORD || "promo").toLowerCase();
const MAX_POSTS = 8;

const OUT_PATH = path.join(__dirname, "..", "assets", "data", "instagram-posts.json");

function writeOutput(posts, extra = {}) {
  const output = {
    updatedAt: new Date().toISOString(),
    keyword: KEYWORD,
    posts,
    ...extra,
  };
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n");
}

async function main() {
  if (!TOKEN || !IG_USER_ID) {
    console.error(
      "Faltam as variáveis TOKEN e/ou IG_USER_ID. Configure os secrets " +
        "IG_ACCESS_TOKEN e IG_USER_ID no repositório (Settings → Secrets and " +
        "variables → Actions) — veja docs/instagram-api-setup.md."
    );
    // Não derruba o workflow — só mantém o JSON como está (ex: vazio, no
    // primeiro run) para o site continuar funcionando normalmente.
    process.exit(0);
  }

  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url = `https://graph.instagram.com/${IG_USER_ID}/media?fields=${encodeURIComponent(
    fields
  )}&limit=25&access_token=${TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error("Erro retornado pela API do Instagram:", JSON.stringify(data.error));
    process.exit(0); // mantém o JSON anterior em vez de quebrar o site
  }

  const posts = (data.data || [])
    .filter((p) => (p.caption || "").toLowerCase().includes(KEYWORD))
    .slice(0, MAX_POSTS)
    .map((p) => ({
      id: p.id,
      caption: p.caption || "",
      isVideo: p.media_type === "VIDEO",
      // Vídeos não têm media_url de imagem direta — usa a thumbnail.
      imageUrl: p.media_type === "VIDEO" ? p.thumbnail_url || p.media_url : p.media_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
    }));

  writeOutput(posts);
  console.log(`OK: ${posts.length} post(s) com "${KEYWORD}" salvos em ${OUT_PATH}`);
}

main().catch((err) => {
  console.error("Falha ao buscar posts do Instagram:", err);
  process.exit(0); // preserva o JSON existente
});
