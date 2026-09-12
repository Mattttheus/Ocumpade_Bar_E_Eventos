# Configurar a sincronização automática de promoções do Instagram

Este guia liga o GitHub Action [`instagram-sync.yml`](../.github/workflows/instagram-sync.yml),
que busca seus posts do Instagram 1x por dia (e sob demanda) e atualiza a
seção **"Promoções da semana"** do site sozinho — sem servidor, sem custo.

Como envolve login na sua conta Meta/Instagram, essa parte só você consegue
fazer. Leva uns 15-20 minutos na primeira vez.

## 1. Transforme o Instagram em conta profissional

No app do Instagram: **Configurações → Contas → Mudar para conta
profissional** → escolha **Criador de conteúdo** ou **Empresa**. Se já for
profissional, pule este passo.

## 2. Crie um app no Meta for Developers

1. Acesse [developers.facebook.com](https://developers.facebook.com/) e
   entre com a conta que administra o Instagram.
2. **Meus Apps → Criar app** → tipo **"Outro"** → objetivo **"Consumidor"**
   (ou "Business", tanto faz para este uso).
3. Dentro do app, em **Adicionar produto**, procure **Instagram** → **API do
   Instagram com login do Instagram** → Configurar.
4. Em **Instagram → Configuração da API com login do Instagram → Testadores
   do Instagram**, clique em **Adicionar testadores do Instagram** e coloque
   o @ da sua própria conta.
5. Abra o Instagram (app do celular) → **Configurações → Apps e sites →
   Convites de testador** → aceite o convite que chegou do seu app.

## 3. Gere o token de acesso

Ainda na página do produto Instagram do seu app, em **Gerar token de
acesso** (ou usando o **Graph API Explorer**), gere um **token de usuário do
Instagram** de curta duração para a sua conta.

Depois, troque por um **token de longa duração** (~60 dias) rodando isto no
terminal (troque `SEU_APP_SECRET` e `TOKEN_CURTO` pelos valores reais —
o App Secret fica em **Configurações do app → Básico**):

```bash
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=SEU_APP_SECRET&access_token=TOKEN_CURTO"
```

A resposta traz um `access_token` — é esse que vai para o secret
`IG_ACCESS_TOKEN` (passo 5).

## 4. Pegue o ID da sua conta

```bash
curl -i -X GET "https://graph.instagram.com/me?fields=id,username&access_token=SEU_TOKEN_LONGO"
```

O `id` retornado vai para o secret `IG_USER_ID`.

## 5. Configure os secrets no GitHub

No repositório: **Settings → Secrets and variables → Actions**.

**Secrets** (New repository secret):

| Nome | Valor |
|---|---|
| `IG_ACCESS_TOKEN` | o token de longa duração do passo 3 |
| `IG_USER_ID` | o ID do passo 4 |
| `GH_PAT` | *(opcional, recomendado)* um [Personal Access Token](https://github.com/settings/tokens) com permissão de **Secrets** (fine-grained) no repositório — deixa o Action renovar o `IG_ACCESS_TOKEN` sozinho a cada execução, então você nunca mais precisa mexer nisso |

**Variables** (aba ao lado de Secrets, opcional):

| Nome | Valor |
|---|---|
| `PROMO_KEYWORD` | palavra que marca uma promoção na legenda do post (padrão: `promo`, então legendas com "Promoção", "promo", etc. já entram) |

## 6. Teste

Vá em **Actions → Sincronizar promoções do Instagram → Run workflow**. Se
tudo estiver certo, ele atualiza `assets/data/instagram-posts.json` e o
site já mostra os posts na próxima visita (o commit do Action reaparece na
aba **Actions** e no histórico do repositório).

## Solução de problemas

- **"Faltam as variáveis TOKEN e/ou IG_USER_ID"** nos logs → os secrets
  `IG_ACCESS_TOKEN`/`IG_USER_ID` não estão configurados ou o nome está
  diferente do esperado.
- **Erro da API do Instagram** nos logs → geralmente token expirado/inválido
  (repita o passo 3) ou a conta perdeu o vínculo de testador (repita o
  passo 2.4/2.5).
- **Nenhum post aparece mesmo com o Action rodando OK** → nenhuma legenda
  recente contém a palavra de `PROMO_KEYWORD`. Ajuste a variável ou a
  legenda do post.
- Sem o `GH_PAT`, o token ainda funciona — só não se renova sozinho. Marque
  no calendário para gerar um novo a cada ~50 dias (repita os passos 3 e 5).
