# ☁️ Configuração do Cloudinary - TeApoio Backend

## ✅ Credenciais Configuradas

As credenciais do Cloudinary já estão configuradas no arquivo `.env`:

```env
CLOUDINARY_CLOUD_NAME="dqz4a2lpy"
CLOUDINARY_API_KEY="287312844416764"
CLOUDINARY_API_SECRET="2HjPqAOkhau7JMDjg9Ph36FkVEg"
```

## 📁 Estrutura de Pastas no Cloudinary

O sistema organiza as imagens em pastas específicas:

- `teapoio/articles/` - Imagens de artigos (1200x630px)
- `teapoio/activities/` - Imagens de atividades (1200x630px)
- `teapoio/avatars/` - Avatares de usuários (400x400px)

## 🔌 Endpoints de Upload

### 1. Upload de Imagem de Artigo
```http
POST /api/upload/article
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  image: [arquivo]
```

**Resposta:**
```json
{
  "url": "https://res.cloudinary.com/dqz4a2lpy/image/upload/v123456/teapoio/articles/abc123.jpg",
  "publicId": "teapoio/articles/abc123",
  "message": "Imagem enviada com sucesso"
}
```

### 2. Upload de Imagem de Atividade
```http
POST /api/upload/activity
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  image: [arquivo]
```

### 3. Upload de Avatar
```http
POST /api/upload/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
  image: [arquivo]
```

## 🎨 Transformações Aplicadas

### Artigos e Atividades
- Largura máxima: 1200px
- Altura máxima: 630px
- Modo: `limit` (mantém proporção)
- Formatos aceitos: JPG, JPEG, PNG, GIF, WEBP

### Avatares
- Tamanho: 400x400px
- Modo: `fill` (preenche todo o espaço)
- Gravidade: `face` (centraliza no rosto)
- Formatos aceitos: JPG, JPEG, PNG

## 🔒 Validações

### Frontend
- Tamanho máximo: 5MB
- Tipos permitidos: image/jpeg, image/jpg, image/png, image/gif, image/webp
- Validação antes do upload

### Backend
- Autenticação obrigatória (JWT)
- Validação de tipo de arquivo
- Validação de tamanho pelo Cloudinary

## 🚀 Como Usar no Frontend

### Exemplo: Upload de Imagem de Artigo

```typescript
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post('/upload/article', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const imageUrl = response.data.url;
    console.log('Imagem enviada:', imageUrl);

    // Usar a URL no formulário
    setImageUrl(imageUrl);
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
  }
};
```

## 🗑️ Deletar Imagens

O sistema inclui funções para deletar imagens do Cloudinary:

```typescript
import { deleteImage, extractPublicId } from '../config/cloudinary';

// Extrair public_id da URL
const publicId = extractPublicId(imageUrl);

// Deletar imagem
if (publicId) {
  await deleteImage(publicId);
}
```

## 📊 Monitoramento

Acesse o dashboard do Cloudinary para monitorar:
- https://console.cloudinary.com/

**Informações disponíveis:**
- Total de imagens armazenadas
- Banda utilizada
- Transformações aplicadas
- Logs de upload

## 🔧 Troubleshooting

### Erro: "Nenhuma imagem foi enviada"
- Verifique se o campo do formulário está nomeado como `image`
- Confirme que o `Content-Type` é `multipart/form-data`

### Erro: "Invalid authentication"
- Verifique as credenciais no arquivo `.env`
- Certifique-se de que o servidor foi reiniciado após alterar o `.env`

### Erro: "File size too large"
- O Cloudinary tem limite de 10MB por arquivo (plano gratuito)
- O frontend valida 5MB antes do upload

### Imagem não aparece
- Verifique se a URL retornada está completa
- Teste a URL diretamente no navegador
- Verifique as permissões do Cloudinary (deve estar público)

## 📝 Limites do Plano Gratuito

- **Armazenamento:** 25 GB
- **Banda mensal:** 25 GB
- **Transformações:** 25.000/mês
- **Tamanho máximo:** 10 MB por arquivo

## 🎯 Boas Práticas

1. **Sempre deletar imagens antigas** quando atualizar/excluir conteúdo
2. **Otimizar imagens** antes do upload quando possível
3. **Usar formatos modernos** (WebP) para melhor compressão
4. **Nomear arquivos** de forma descritiva
5. **Monitorar uso** para não exceder limites

## 🔐 Segurança

- ✅ Credenciais armazenadas em variáveis de ambiente
- ✅ Autenticação JWT obrigatória em todos os uploads
- ✅ Validação de tipo de arquivo
- ✅ Organização por pastas
- ✅ URLs assinadas (quando necessário)

---

**Status:** ✅ Configurado e Funcionando

**Última atualização:** 05/11/2025
