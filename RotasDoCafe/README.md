# Rotas do Café ☕

## 📱 Descrição

**Rotas do Café** é um aplicativo híbrido desenvolvido com **React Native** e **Expo**, criado para ajudar usuários a explorar os principais **pontos turísticos do Vale do Café** de forma simples e interativa.

O app permite visualizar pontos turísticos no mapa em tempo real, descobrir eventos regionais e planejar visitas com praticidade — tudo isso com uma interface moderna, intuitiva e responsiva.

Ideal para turistas e moradores que desejam conhecer melhor a história, cultura e experiências da região diretamente pelo celular.

---

## 🚀 Tecnologias

- React Native
- Expo
- NativeWind (TailwindCSS)
- Expo Location
- React Native Maps
- Firebase Authentication
- Firebase Firestore
- Firebase Storage

---

## ✨ Principais Funcionalidades

- **🔐 Autenticação Segura**
  - Login com email e senha
  - Suporte à biometria (impressão digital / Face ID)

- **🗺️ Mapa Interativo**
  - Visualização de pontos turísticos em tempo real
  - Integração com localização do usuário

- **📍 Exploração de Pontos Turísticos**
  - Fazendas históricas
  - Museus
  - Cafeterias e experiências locais

- **🎉 Eventos Regionais**
  - Descubra eventos culturais e turísticos no Vale do Café

- **👤 Perfil Personalizado**
  - Upload de foto via câmera ou galeria
  - Gerenciamento de informações do usuário

- **📱 Navegação Intuitiva**
  - Abas principais: Home, Explorar, Eventos e Perfil

- **⚡ Performance e Experiência**
  - Cache de dados para melhor desempenho
  - Feedback visual com notificações (toasts)

- **🎨 Design Moderno**
  - Interface estilizada com NativeWind (TailwindCSS)
  - Tema inspirado no café (#6F4E37)

---

## 📂 Estrutura do Projeto

```
RotasDoCafe/
├── App.js
├── index.js
├── package.json
├── app.json
├── tailwind.config.js
├── scripts/
│   ├── createSuperAdmin.js   # cria usuário inicial (super-admin)
│   └── seedPlaces.js         # popula collection de places
├── src/
│   ├── screens/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   │   ├── firebaseCore/     # inicialização/config do Firebase
│   │   ├── events/
│   │   ├── users/
│   │   └── validations/
│   ├── styles/
│   └── cache/
└── assets/
```

---

## 🛠️ Instalação e Execução

> Para o app funcionar em um ambiente limpo, pode ser necessário rodar o seed (criar super-admin e popular as `places`). Veja o comando **first-setup** abaixo.

### Pré-requisitos

- Node.js 20+
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio ou Xcode (opcional)

### Passos

1. Clone o repositório:

```
git clone <repo-url>
cd RotasDoCafe
```

2. Instale as dependências:

```
npm install
```

ou

```
yarn install
```

3. Inicie o projeto:

```
npx expo start
```

### Comando de inicialização (seed)

Para criar o usuário `super-admin` e popular a collection `places` no Firestore:

```
npm run first-setup
```

> Isso executa:

- `npm run create:super-admin`
- `npm run seed:places`

---

### 🚀 Comando Alternativo (Mais Rápido para Testes)

Para facilitar o acesso e testes em dispositivos externos, você pode usar o modo **tunnel**:

```
npm run start:tunnel
```

> Esse comando utiliza:

```
"start:tunnel": "npx expo start --tunnel"
```

> Ideal para quando o dispositivo não está na mesma rede Wi‑Fi do computador.

- Android: `npx expo start --android`
- iOS: `npx expo start --ios`
- Web: `npx expo start --web`

4. Escaneie o QR Code com o **Expo Go**.

---

## 🔑 Variáveis de Ambiente (Firebase)

O app usa credenciais do Firebase via variáveis de ambiente **EXPO*PUBLIC*\*** (lidas em `src/services/firebaseCore/config.js`).

Crie um arquivo `.env` na raiz do projeto (`RotasDoCafe/.env`) com valores como:

```env
EXPO_PUBLIC_CACHE_KEY="..."
EXPO_PUBLIC_OVERPASS_API_URL="..."
EXPO_PUBLIC_OPENSTREETMAP_API_URL="..."

EXPO_PUBLIC_FIREBASE_API_KEY="..."
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
EXPO_PUBLIC_FIREBASE_PROJECT_ID="..."
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
EXPO_PUBLIC_FIREBASE_APP_ID="..."

EXPO_PUBLIC_BIOMETRIC_EMAIL_KEY="..."
EXPO_PUBLIC_BIOMETRIC_SECRET_PREFIX="..."
```

> Observação: os scripts de seed (como `first-setup`) também carregam `.env` via `dotenv/config`.

---

## 🎯 Objetivo do Projeto

O objetivo do **Rotas do Café** é valorizar o turismo regional, facilitando o acesso às informações sobre o **Vale do Café**, promovendo experiências culturais e incentivando a exploração dos patrimônios históricos da região.

---

## 👥 Integrantes

Alysson André de Paula Silva
Lucas Coutinho de Oliveira Bastos
Luiz Gustavo Lima Drilard
