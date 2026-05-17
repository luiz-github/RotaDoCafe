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

---

## ✨ Principais Funcionalidades

* **🔐 Autenticação Segura**

  * Login com usuário e senha
  * Suporte à biometria (impressão digital / Face ID)

* **🗺️ Mapa Interativo**

  * Visualização de pontos turísticos em tempo real
  * Integração com localização do usuário

* **📍 Exploração de Pontos Turísticos**

  * Fazendas históricas
  * Museus
  * Cafeterias e experiências locais

* **🎉 Eventos Regionais**

  * Descubra eventos culturais e turísticos no Vale do Café

* **👤 Perfil Personalizado**

  * Upload de foto via câmera ou galeria
  * Gerenciamento de informações do usuário

* **📱 Navegação Intuitiva**

  * Abas principais: Home, Explorar, Eventos e Perfil

* **⚡ Performance e Experiência**

  * Cache de dados para melhor desempenho
  * Feedback visual com notificações (toasts)

* **🎨 Design Moderno**

  * Interface estilizada com NativeWind (TailwindCSS)
  * Tema inspirado no café (#6F4E37)

---

## 📂 Estrutura do Projeto

```
RotasDoCafe/
├── App.js
├── index.js
├── package.json
├── app.json
├── tailwind.config.js
├── src/
│   ├── screens/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   └── cache/
└── assets/
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos

* Node.js 20+
* Expo CLI (`npm install -g @expo/cli`)
* Android Studio ou Xcode (opcional)

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

### 🚀 Comando Alternativo (Mais Rápido para Testes)

Para facilitar o acesso e testes em dispositivos externos, você pode usar o modo **tunnel**:

```
npm run start:tunnel
```

> Esse comando utiliza:

```
"start:tunnel": "npx expo start --tunnel"
```

> Ideal para quando o dispositivo não está na mesma rede Wi-Fi do computador.

* Android: `npx expo start --android`
* iOS: `npx expo start --ios`
* Web: `npx expo start --web`

4. Escaneie o QR Code com o **Expo Go**.

---

## 🎯 Objetivo do Projeto

O objetivo do **Rotas do Café** é valorizar o turismo regional, facilitando o acesso às informações sobre o **Vale do Café**, promovendo experiências culturais e incentivando a exploração dos patrimônios históricos da região.

---

## 👥 Integrantes
Alysson André de Paula Silva
Lucas Coutinho de Oliveira Bastos
Luiz Gustavo Lima Drilard