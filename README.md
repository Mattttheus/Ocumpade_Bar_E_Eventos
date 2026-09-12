# Bar do Compadre & Eventos Compadre — site

Site institucional em uma página só (one-page), estático, sem build e sem
backend — feito para rodar direto no **GitHub Pages**. Traz cardápio,
"Semana dos Molhos", seção de eventos e um formulário de contato/orçamento
que abre pronto no WhatsApp `(11) 99114-7454`.

## Estrutura

```text
index.html              → página única (todas as seções, por âncora)
404.html                → página de erro
assets/
  css/style.css         → todo o visual do site
  js/main.js            → configurações (WhatsApp, endereço, horário) + comportamento
  img/                  → fotos do site (veja assets/img/README.md)
  data/instagram-posts.json → feed de promoções (gerado pelo Action, veja abaixo)
.github/workflows/instagram-sync.yml → busca posts do Instagram automaticamente
docs/instagram-api-setup.md → como ligar a sincronização do Instagram
robots.txt / sitemap.xml
.nojekyll               → evita o GitHub processar o site com Jekyll
```

## O que editar

Praticamente tudo que muda com frequência está centralizado no topo do
arquivo [`assets/js/main.js`](assets/js/main.js), no objeto `SITE`:

- `whatsapp` — número que recebe os cliques de "Falar no WhatsApp" e do
  formulário de orçamento (já configurado como `5511991147454`).
- `whatsappMessages` — textos que já vêm prontos em cada botão.
- `address` / `mapsQuery` — endereço mostrado no site e usado no mapa embutido.
- `instagram` / `facebook` — links das redes sociais no rodapé e no botão
  "Seguir no Instagram" (troque pelo link real do perfil).
- `hours` — horário de funcionamento exibido na seção de contato.

Textos, preços e itens do cardápio ficam direto no [`index.html`](index.html)
— procure a seção `<!-- ===================== CARDÁPIO ===================== -->`.

## Promoções automáticas do Instagram

A seção "Promoções da semana" (dentro de Instagram, no site) é alimentada
por `assets/data/instagram-posts.json`, atualizado automaticamente 1x por
dia por um GitHub Action que busca os posts na API oficial do Instagram e
filtra os que têm a palavra-chave de promoção na legenda. Configuração
(precisa do seu login no Meta/Instagram): **[docs/instagram-api-setup.md](docs/instagram-api-setup.md)**.

Antes de configurar, a seção mostra uma mensagem simpática no lugar — não
quebra nada.

## Fotos

O site já funciona sem nenhuma foto real (aparece um placeholder estilizado
no lugar). Assim que você tiver as fotos definitivas, é só soltar os
arquivos dentro de `assets/img/` **com o nome exato** pedido em
[`assets/img/README.md`](assets/img/README.md) — o site passa a exibi-las
automaticamente, sem editar nada.

## Publicação no GitHub Pages

Já está tudo configurado e publicado em:
**[Mattttheus.github.io/Ocumpade_Bar_E_Eventos](https://Mattttheus.github.io/Ocumpade_Bar_E_Eventos/)**

O deploy usa GitHub Actions com o workflow padrão do Jekyll
(`.github/workflows/jekyll-gh-pages.yml`) — qualquer `git push` para `main`
já builda e publica o site automaticamente (acompanhe em **Actions** no
GitHub). Não precisa rodar nada manualmente.

Se um dia precisar recriar isso do zero em outro repositório:

```bash
git init
git add .
git commit -m "Site inicial Bar do Compadre"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

E em **Settings → Pages → Build and deployment → Source**, escolha
**GitHub Actions** (recomendado, já usado aqui) e aceite o workflow
sugerido "Jekyll" — ou **Deploy from a branch** (`main` / `/ (root)`) para
o método mais simples, sem build.

## Testar localmente antes de publicar

Não precisa de nenhuma instalação — basta abrir `index.html` direto no
navegador. Para testar com um servidor local (recomendado, evita problemas de
cache/caminho):

```bash
# Python já vem instalado na maioria dos sistemas
python -m http.server 8000
# depois acesse http://localhost:8000
```
