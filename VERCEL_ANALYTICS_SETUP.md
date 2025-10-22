# 📊 Vercel Analytics - Configuração Completa

## ✅ O que foi implementado

### 1. Script do Vercel Analytics
- Adicionado o script oficial do Vercel Analytics no `index.html`
- Configurado para carregar automaticamente quando a página é acessada

### 2. Tracking Personalizado
- **Page Views**: Rastreamento automático de visualizações de página
- **Calculator Usage**: Tracking quando usuários alteram valores na calculadora
- **Lead Capture**: Tracking de submissões do formulário de captura de leads
- **WhatsApp Clicks**: Tracking de cliques no botão da comunidade WhatsApp

### 3. Eventos Configurados
- `Page View`: Visualização da página
- `Calculator Input Changed`: Mudança em qualquer campo da calculadora
- `Lead Form Submitted`: Submissão do formulário de captura
- `WhatsApp Community Click`: Clique no botão do WhatsApp

## 🚀 Como funciona

### Script Principal (index.html)
```html
<!-- Vercel Analytics -->
<script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

### Tracking Automático (script.js)
- Inicialização automática quando a página carrega
- Verificação se o Analytics está disponível
- Configuração de eventos personalizados

## 📈 Dados que serão coletados

1. **Visitas**: Quantas pessoas acessam a calculadora
2. **Interações**: Como os usuários usam a calculadora
3. **Conversões**: Quantos leads são capturados
4. **Engajamento**: Cliques em botões importantes

## 🔧 Próximos passos

1. **Deploy no Vercel**: Faça o deploy da aplicação
2. **Ativar Analytics**: No dashboard do Vercel, ative o Analytics
3. **Aguardar dados**: Os dados começam a aparecer em 30 segundos após o primeiro acesso
4. **Monitorar**: Acompanhe as métricas no dashboard do Vercel

## 📱 Testando localmente

Para testar se está funcionando:

1. Abra o console do navegador (F12)
2. Procure por: `✅ Vercel Analytics inicializado`
3. Se aparecer, está funcionando corretamente

## 🎯 Eventos personalizados disponíveis

Você pode usar a função `trackEvent()` para eventos customizados:

```javascript
// Exemplo de uso
trackEvent('Custom Event', {
    category: 'user-action',
    value: 'high-engagement'
});
```

## ⚠️ Importante

- O Analytics só funciona quando a aplicação está hospedada no Vercel
- Em desenvolvimento local, você verá apenas os logs no console
- Os dados aparecem no dashboard do Vercel após o deploy
