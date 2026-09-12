# Imagens do site — lista de arquivos esperados

O site já funciona sem nenhuma foto real: cada espaço de imagem mostra um
**placeholder estilizado** (fundo listrado + ícone + nome do arquivo) até você
colocar o arquivo de verdade nesta pasta, **com exatamente o mesmo nome**.
Assim que o arquivo existir aqui, ele aparece no site sozinho — não precisa
mexer em nenhum HTML/CSS.

Coloque os arquivos direto dentro de `assets/img/` (não crie subpastas):

| Arquivo | Onde aparece | Tamanho sugerido |
|---|---|---|
| `logo.png` ✅ | Logo no menu e no rodapé — **já preenchido** com a arte "O Cumpadre", recortada de uma captura de tela que você enviou (≈163×163 px). Se tiver o arquivo original em alta resolução (o design de origem, não uma captura de tela), troque por esse arquivo com o mesmo nome — fica nítido em telas maiores | 500×500 px ou mais |
| `favicon.png` ✅ | Ícone da aba do navegador — **já preenchido**, gerado a partir do mesmo logo | 192×192 px |
| `og-image.jpg` | Prévia ao compartilhar o link (WhatsApp, Instagram, etc.) | 1200×630 px |
| `hero-bar.jpg` | Foto de fundo do topo da página (fachada ou ambiente do bar) | 1920×1080 px, bem iluminada |
| `hero-eventos.jpg` | Foto da seção "Eventos Compadre" | 1200×1500 px (vertical) |
| `prato-franguinho-mandioca.jpg` | Card "Franguinho c/ mandioca" | 1200×900 px |
| `prato-franguinho-polenta.jpg` | Card "Franguinho c/ polenta" | 1200×900 px |
| `drink-caipirinha.jpg` | Card "Caipirinha tradicional" | 1200×900 px |
| `drink-cerveja.jpg` | Card "Cerveja gelada" | 1200×900 px |
| `molho-branco.jpg` | Card do Molho Branco (Semana dos Molhos) | 1000×1000 px |
| `molho-rose.jpg` | Card do Molho Rosé | 1000×1000 px |
| `molho-barbecue.jpg` | Card do Molho Barbecue | 1000×1000 px |

Dicas rápidas:

- Formatos aceitos: `.jpg`, `.jpeg`, `.png` ou `.webp` — só ajuste a extensão
  no `src=` da tag `<img>` em [index.html](../../index.html) se usar uma
  extensão diferente da tabela acima.
- Para o site carregar rápido, exporte as fotos em qualidade alta mas já
  comprimidas (ex: [squoosh.app](https://squoosh.app)) — o ideal é cada foto
  ficar abaixo de ~400 KB.
- Se alguma imagem não existir ainda, não tem problema: o placeholder some
  sozinho assim que o arquivo for adicionado, e volta a aparecer se o arquivo
  for removido — é só visual, não quebra o site.
