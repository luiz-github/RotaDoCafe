# Rotas do Café ☕

Aplicativo móvel de turismo para o **Vale do Café** (Sul Fluminense, RJ). Ajuda visitantes e moradores a descobrir fazendas históricas, mirantes, museus, cafés coloniais, eventos culturais e outros pontos de interesse — com mapa interativo, categorização inteligente e autenticação biométrica.

---

## Tecnologias

| Camada              | Stack                                                   |
| ------------------- | ------------------------------------------------------- |
| Framework           | React Native 0.81 + Expo SDK 54                         |
| Estilização         | NativeWind 4 (TailwindCSS 3.4)                          |
| Navegação           | React Navigation 7 (Native Stack + Material Top Tabs)   |
| Mapas               | react-native-maps + Google Maps API                     |
| Backend             | Firebase 12 (Authentication + Firestore)                |
| Armazenamento local | AsyncStorage, Expo SecureStore                          |
| Animações           | react-native-reanimated 4, react-native-gesture-handler |
| Localização         | expo-location                                           |
| Biometria           | expo-local-authentication                               |
| Testes unitários    | Jest 29 + jest-expo + @testing-library/react-native     |
| Testes E2E          | Maestro                                                 |

---

## Funcionalidades

### Autenticação

- Login com email e senha
- Cadastro com rollback automático caso o Firestore falhe
- Recuperação de senha via Firebase
- Autenticação biométrica (impressão digital / Face ID) com credenciais armazenadas no SecureStore
- Controle de papéis (`user`, `super-admin`)

### Exploração de Lugares

- Dados de pontos turísticos via Overpass API (OpenStreetMap)
- Categorização automática em 7 grupos: Histórico, Mirantes, Museus & Cultura, Natureza, Religioso, Fazendas, Turismo & Lazer
- Algoritmo de recomendação baseado em peso de categoria + proximidade
- Ordenação por distância (fórmula de Haversine)
- Cache em 3 camadas: memória → AsyncStorage (TTL 24h) → Firestore (fallback)
- Carrossel de rotas sugeridas integrado à tela de categorias

### Mapa Interativo

- Google Maps com marcadores de pontos turísticos
- Centralização na localização do usuário
- Abertura de lugar no mapa a partir de qualquer tela
- Rotas sugeridas com carrossel animado (fade + auto-play + swipe)
- RouteInfoCard com waypoints clicáveis e botão de fechar
- Traçado de rota real (polyline) do usuário ao destino via OSRM API
- Rota automática ao selecionar lugar de qualquer categoria
- Fallback sem localização: exibe card e polyline entre waypoints, sem ponto do usuário
- Marcador permanente de localização do usuário (pin azul)

### Eventos

- Listagem de eventos regionais com data, horário, preço e classificação etária
- CRUD completo (criar, editar, soft-delete) para administradores
- Seleção de local do evento no mapa com 3 métodos: busca por nome (geocoding), localização atual (GPS) ou seleção manual em mapa fullscreen
- Validação automática de cidade (somente cidades do Vale do Café)
- Reverse geocoding para preencher cidade/estado automaticamente
- Metadados automáticos: `createdBy`, `createdAt`, `updatedAt`

### Perfil

- Edição de nome
- Upload de foto via câmera ou galeria
- Logout com confirmação

### Home

- Rotas sugeridas com carrossel animado (dots indicadores, swipe, auto-play 15s)
- Atalhos rápidos para categorias
- Histórico dos últimos 3 lugares abertos (padrão pub/sub em memória)

---

## Estrutura do Projeto

```
RotasDoCafe/
├── App.js                        # Entry point, Stack Navigator
├── app.config.js                 # Configuração Expo (permissões, Google Maps, etc.)
├── babel.config.js               # Presets: expo + nativewind + reanimated
├── tailwind.config.js            # TailwindCSS customizado com paleta coffee
├── jest.config.js                # Testes apontando para src/tests/
├── jest.setup.js                 # Env vars de teste (biometria)
├── scripts/
│   ├── createSuperAdmin.js       # Cria usuário super-admin no Firebase
│   ├── seedPlaces.js             # Popula collection 'places' no Firestore
│   └── runMaestro.js             # Runner de testes E2E com merge de .env
├── .maestro/
│   └── flows/                    # 14 fluxos E2E independentes (registro, login, perfil, mapa, admin...)
├── src/
│   ├── cache/
│   │   └── cacheManager.js       # AsyncStorage cache com TTL de 24h
│   ├── components/
│   │   ├── BottomTabs/           # Tab Navigator principal (Material Top Tabs)
│   │   ├── Brand/                # AppLogo
│   │   ├── Button/               # Botão reutilizável (primary, secondary, danger)
│   │   ├── Card/                 # SuggestedRouteCard (carrossel animado), RouteInfoCard
│   │   ├── Loading/              # Overlay de carregamento
│   │   ├── Maps/                 # MapViewer
│   │   ├── Navigation/           # MainNavigator
│   │   ├── Profile/              # ProfileAvatar (câmera/galeria)
│   │   ├── SwipeableCard/        # Card com swipe
│   │   └── Toast/                # Hook useToast (success, error, info)
│   ├── hooks/
│   │   ├── AuthScreen/           # useLogin, useRegister, useForgotPassword,
│   │   │                         # useBiometricAuth, useLogout, useUserRole
│   │   ├── EventScreen/          # useEvents
│   │   ├── MapScreen/            # usePlaces, useLocation
│   │   └── ProfileScreen/        # useUserProfile, useChangePassword,
│   │                             # useCamera, useGallery
│   ├── screens/
│   │   ├── Auth/                 # Login, Register, ForgotPassword
│   │   ├── Home/                 # Dashboard com rotas sugeridas
│   │   ├── Explore/              # Exploração por categorias
│   │   ├── Map/                  # Mapa interativo
│   │   ├── Eventos/              # Listagem + CRUD de eventos
│   │   ├── Profile/              # Tela de perfil
│   │   └── admin/                # Painel administrativo (super-admin)
│   ├── services/
│   │   ├── firebaseCore/         # config.js, collections.js (modular init)
│   │   ├── firebase.js           # Exporta auth, db, COLLECTIONS
│   │   ├── auth/                 # registerUser, forgotPassword
│   │   ├── biometric/            # biometricStorage (SecureStore)
│   │   ├── events/               # eventRepository + eventService
│   │   ├── users/                # userService (perfil, papel, foto)
│   │   ├── validations/          # login, register, event, field, firebaseError
│   │   ├── getPlaces.js          # Fetch multi-source (cache/API/DB)
│   │   ├── queries.js            # Overpass QL query (Vale do Café)
│   │   ├── recentPlaces.js       # Pub/sub de lugares recentes
│   │   └── routesService.js      # getRoutePath via OSRM API
│   ├── styles/
│   │   ├── colors.js             # Paleta coffee, cream, latte, danger...
│   │   └── global.css            # Entry point NativeWind
│   ├── data/
│   │   └── suggestedRoutes.js    # Rotas sugeridas pré-definidas (10 rotas)
│   ├── tests/
│   │   ├── __mocks__/            # Mocks (@expo/vector-icons)
│   │   ├── components/           # AppLogo, Button, Loading, useToast, RouteInfoCard, SuggestedRouteCard
│   │   ├── hooks/                # useBiometricAuth, useLogin, useRegister, useChangePassword...
│   │   └── services/             # auth, biometric, events, users, validations, getRoutePath
│   └── utils/
│       ├── places.js             # Categorização, enriquecimento, Haversine
│       └── date.js               # Formatação de data/hora
└── assets/                       # Ícones e splash
```

---

## Instalação

### Pré-requisitos

- Node.js 20+
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (emulador) ou dispositivo com Expo Go
- Projeto Firebase configurado (Auth + Firestore)

### Setup

```bash
git clone <repo-url>
cd RotasDoCafe
npm install
```

### Variáveis de Ambiente

Copie o `.env.example` para `.env` e preencha:

```env
# Cache e APIs de dados geográficos
EXPO_PUBLIC_CACHE_KEY=
EXPO_PUBLIC_OVERPASS_API_URL=
EXPO_PUBLIC_OPENSTREETMAP_API_URL=

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Biometria (chaves para SecureStore)
EXPO_PUBLIC_BIOMETRIC_EMAIL_KEY=
EXPO_PUBLIC_BIOMETRIC_SECRET_PREFIX=

# Super-admin (usado pelo script de seed)
EXPO_PUBLIC_SUPER_ADMIN_EMAIL=
EXPO_PUBLIC_SUPER_ADMIN_PASSWORD=

# Google Maps (Android)
GoogleMapsApiKey=

# OSRM
EXPO_PUBLIC_OPENSTREETMAP_ROUTER_URL
```

### Seed Inicial

Cria o usuário super-admin e popula o Firestore com os pontos turísticos:

```bash
npm run first:setup
```

## Executar

### Iniciar o Projeto

```bash
npx expo start
```

| Comando                | Descrição                                   |
| ---------------------- | ------------------------------------------- |
| `npm start`            | Inicia o Expo (modo LAN)                    |
| `npm run start:tunnel` | Expo via tunnel (dispositivos fora da rede) |
| `npm run android`      | Build e executa no Android                  |
| `npm run ios`          | Build e executa no iOS                      |
| `npm run web`          | Abre no navegador                           |

---

## Testes

### Testes Unitários

Os testes ficam centralizados em `src/tests/` organizados por domínio:

```bash
npm run test
```

**Cobertura atual:** 19 test suites, 73 testes cobrindo:

- Componentes: AppLogo, Button, Loading, useToast, RouteInfoCard, SuggestedRouteCard
- Hooks: useLogin, useRegister, useForgotPassword, useBiometricAuth, useLogout, useChangePassword
- Services: registerUser, forgotPassword, biometricStorage, eventFlows, userService, validationFlows, getRoutePath

### Testes E2E (Maestro) - OBS: Para rodar o teste do maestro é necessario desabilitar a stylus do emulador desabilitar o corretor e ativar a localização

Requer o [Maestro CLI](https://maestro.mobile.dev/) instalado e um emulador/dispositivo rodando o app.

## Executar

### Android Nativo

Caso tenha alterado dependências nativas, permissões, plugins Expo ou configurações do Android, gere novamente a estrutura nativa:

```bash
npx expo prebuild --clean
```

Depois gere e instale o aplicativo no dispositivo ou emulador Android:

```bash
npx expo run:android
```

```bash
# Rodar todos os fluxos
npm run test:maestro:all

# Rodar um fluxo específico
node scripts/runMaestro.js 02-login
```

Configure `.maestro/.env` (baseado em `.maestro/.env.example`):

```env
APP_ID=
TEST_EMAIL=
TEST_PASSWORD=
TEST_NEW_PASSWORD=
SUPERADMIN_EMAIL=
SUPERADMIN_PASSWORD=
EVENT_TITLE=
EVENT_LOCATION=
EVENT_DESCRIPTION=
EVENT_ORGANIZER=
EVENT_PRICE=
```

**Fluxos disponíveis (todos independentes, exceto 01 que requer DB limpo):**

1. Registro de usuário
2. Login
3. Alteração de senha
4. Navegação entre abas
5. Edição de perfil
6. Alterar foto de perfil
7. Remover foto de perfil
8. Logout
9. Gerenciamento de eventos (admin — criar evento com busca de local no mapa)
10. Seleção de local no mapa fullscreen (admin — criar evento e selecionar no mapa)
11. Detalhes do evento (usuário — abrir evento e verificar localização)
12. Rota sugerida (tap card, navegar pelos pontos, fechar)
13. Rota por categoria (tap lugar destaque, verificar card no mapa, fechar)

---

## Navegação

```
Auth (Stack)
├── Login (tela inicial)
├── Register
└── ForgotPassword

App (Material Top Tabs - posição bottom, swipeable)
├── Home
├── Categoria (exploração por categorias)
├── Explorar (mapa interativo)
├── Eventos
├── Admin (apenas super-admin)
└── Perfil

Modais (Stack)
├── ManageEvents
├── CreateEvent
└── EditEvent
```

---

## Design System

Paleta inspirada em tons de café:

| Token         | Cor       | Uso                       |
| ------------- | --------- | ------------------------- |
| `coffee`      | `#6F4E37` | Background principal      |
| `coffeeDark`  | `#4E3526` | Navbar, elementos escuros |
| `coffeeLight` | `#8B6A52` | Destaques sutis           |
| `cream`       | `#F5F1E8` | Textos sobre fundo escuro |
| `latte`       | `#C8A27A` | Acentos secundários       |
| `amber-400`   | `#fbbf24` | Ícones ativos, CTAs       |
| `danger`      | `#FF6B6B` | Ações destrutivas         |
| `success`     | `#4CAF50` | Confirmações              |

Cards usam estilo glassmorphism (`bg-white/10`) com bordas arredondadas (`rounded-2xl`).

---

## Cidades Cobertas

O app consulta dados de pontos turísticos e históricos nestas cidades do Vale do Café:

- Vassouras
- Valença
- Barra do Piraí
- Rio das Flores
- Piraí
- Miguel Pereira
- Paty do Alferes
- Engenheiro Paulo de Frontin
- Volta Redonda

---

## Equipe

- Alysson André de Paula Silva
- Lucas Coutinho de Oliveira Bastos
- Luiz Gustavo Lima Drilard
