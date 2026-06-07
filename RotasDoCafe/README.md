# Rotas do Café ☕

Aplicativo móvel de turismo para o **Vale do Café** (Sul Fluminense, RJ). Ajuda visitantes e moradores a descobrir fazendas históricas, mirantes, museus, cafés coloniais, eventos culturais e outros pontos de interesse — com mapa interativo, categorização inteligente e autenticação biométrica.

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Estilização | NativeWind 4 (TailwindCSS 3.4) |
| Navegação | React Navigation 7 (Native Stack + Material Top Tabs) |
| Mapas | react-native-maps + Google Maps API |
| Backend | Firebase 12 (Authentication + Firestore) |
| Armazenamento local | AsyncStorage, Expo SecureStore |
| Animações | react-native-reanimated 4, react-native-gesture-handler |
| Localização | expo-location |
| Biometria | expo-local-authentication |
| Testes unitários | Jest 29 + jest-expo + @testing-library/react-native |
| Testes E2E | Maestro |

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

### Mapa Interativo
- Google Maps com marcadores de pontos turísticos
- Centralização na localização do usuário
- Abertura de lugar no mapa a partir de qualquer tela

### Eventos
- Listagem de eventos regionais com data, horário, preço e classificação etária
- CRUD completo (criar, editar, soft-delete) para administradores
- Metadados automáticos: `createdBy`, `createdAt`, `updatedAt`

### Perfil
- Edição de nome
- Upload de foto via câmera ou galeria
- Logout com confirmação

### Home
- Rota sugerida do dia
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
│   └── flows/                    # 8 fluxos E2E (registro, login, perfil, admin...)
├── src/
│   ├── cache/
│   │   └── cacheManager.js       # AsyncStorage cache com TTL de 24h
│   ├── components/
│   │   ├── BottomTabs/           # Tab Navigator principal (Material Top Tabs)
│   │   ├── Brand/                # AppLogo
│   │   ├── Button/               # Botão reutilizável (primary, secondary, danger)
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
│   │   └── recentPlaces.js       # Pub/sub de lugares recentes
│   ├── styles/
│   │   ├── colors.js             # Paleta coffee, cream, latte, danger...
│   │   └── global.css            # Entry point NativeWind
│   ├── tests/
│   │   ├── components/           # AppLogo, Button, Loading, useToast
│   │   ├── hooks/                # useBiometricAuth, useLogin, useRegister...
│   │   └── services/             # auth, biometric, events, users, validations
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
```

### Seed Inicial

Cria o usuário super-admin e popula o Firestore com os pontos turísticos:

```bash
npm run first:setup
```

### Executar

```bash
npx expo start
```

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o Expo (modo LAN) |
| `npm run start:tunnel` | Expo via tunnel (dispositivos fora da rede) |
| `npm run android` | Build e executa no Android |
| `npm run ios` | Build e executa no iOS |
| `npm run web` | Abre no navegador |

---

## Testes

### Testes Unitários

Os testes ficam centralizados em `src/tests/` organizados por domínio:

```bash
npm test
```

**Cobertura atual:** 15 test suites, 51 testes cobrindo:
- Componentes: AppLogo, Button, Loading, useToast
- Hooks: useLogin, useRegister, useForgotPassword, useBiometricAuth, useLogout
- Services: registerUser, forgotPassword, biometricStorage, eventFlows, userService, validationFlows

### Testes E2E (Maestro)

Requer o [Maestro CLI](https://maestro.mobile.dev/) instalado e um emulador/dispositivo rodando o app.

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
SUPERADMIN_EMAIL=
SUPERADMIN_PASSWORD=
EVENT_TITLE=
EVENT_CITY=
EVENT_STATE=
EVENT_LOCATION=
EVENT_DESCRIPTION=
EVENT_ORGANIZER=
EVENT_PRICE=
```

**Fluxos disponíveis:**
1. Registro de usuário
2. Login
3. Navegação entre abas
4. Edição de perfil
5. Alterar foto de perfil
6. Remover foto de perfil
7. Logout
8. Gerenciamento de eventos (admin)

---

## Navegação

```
Auth (Stack)
├── Login (tela inicial)
├── Register
└── ForgotPassword

App (Material Top Tabs - posição bottom, swipeable)
├── Home
├── Explorar
├── Mapa
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

| Token | Cor | Uso |
|-------|-----|-----|
| `coffee` | `#6F4E37` | Background principal |
| `coffeeDark` | `#4E3526` | Navbar, elementos escuros |
| `coffeeLight` | `#8B6A52` | Destaques sutis |
| `cream` | `#F5F1E8` | Textos sobre fundo escuro |
| `latte` | `#C8A27A` | Acentos secundários |
| `amber-400` | `#fbbf24` | Ícones ativos, CTAs |
| `danger` | `#FF6B6B` | Ações destrutivas |
| `success` | `#4CAF50` | Confirmações |

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
