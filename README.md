# Bar do Compadre & Eventos Compadre — site

Site institucional em uma página só (one-page), estático, sem build e sem
backend — feito para rodar direto no **GitHub Pages**. Traz cardápio,
"Semana dos Molhos", seção de eventos e um formulário de contato/orçamento
que abre pronto no WhatsApp `(11) 99114-7454`.

## Estrutura

```
index.html              → página única (todas as seções, por âncora)
404.html                → página de erro
assets/
  css/style.css         → todo o visual do site
  js/main.js            → configurações (WhatsApp, endereço, horário) + comportamento
  img/                  → fotos do site (veja assets/img/README.md)
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

## Fotos

O site já funciona sem nenhuma foto real (aparece um placeholder estilizado
no lugar). Assim que você tiver as fotos definitivas, é só soltar os
arquivos dentro de `assets/img/` **com o nome exato** pedido em
[`assets/img/README.md`](assets/img/README.md) — o site passa a exibi-las
automaticamente, sem editar nada.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser público ou privado, mas o
   Pages gratuito exige repositório público, exceto em contas com GitHub Pro/Team/Enterprise).
2. Neste diretório, rode:
   ```bash
   git init
   git add .
   git commit -m "Site inicial Bar do Compadre"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch → Branch: `main` / pasta `/ (root)` → Save**.
4. Em alguns minutos o site fica disponível em
   `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`.
5. Atualize `robots.txt` e `sitemap.xml` trocando `SEU-USUARIO` /
   `SEU-REPOSITORIO` pela URL final.

Qualquer novo `git push` para `main` atualiza o site automaticamente.

## Testar localmente antes de publicar

Não precisa de nenhuma instalação — basta abrir `index.html` direto no
navegador. Para testar com um servidor local (recomendado, evita problemas de
cache/caminho):

```bash
# Python já vem instalado na maioria dos sistemas
python -m http.server 8000
# depois acesse http://localhost:8000
```
