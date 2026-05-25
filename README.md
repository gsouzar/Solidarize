# 🤝 Solidarize

> ⚠️ **Status do Projeto:** 🛠️ Em desenvolvimento / Projeto Acadêmico

O **Solidarize** é um aplicativo móvel desenvolvido em React Native e Expo que visa conectar pessoas, simplificar processos e promover a solidariedade de forma prática e intuitiva.

O projeto foi desenhado seguindo as melhores práticas de mercado, estruturado com um fluxo profissional de ramificações (*branches*) para suportar testes tanto em ambientes atualizados quanto em dispositivos específicos.

---

## 🚀 Funcionalidades & Status do Projeto

O app é focado na experiência do usuário e no uso avançado de recursos nativos do celular. Confira o andamento das etapas:

### 🌟 Já Funciona (Funcionalidades Nativas):
* **Câmera Integrada (`fix`):** Correção completa do escopo e tipagem do `cameraRef` utilizando o novo componente `<CameraView>`.
* **Persistência de Imagens (`feat`):** Integração com o `AsyncStorage`. A foto tirada pelo usuário é gravada no armazenamento interno do celular e não some ao fechar o app.
* **Geração de QR Code (`feat`):** Emissão de passes e identificação dinâmica utilizando a biblioteca `react-native-qrcode-svg`.
* **Mapas e Geolocalização:** Visualização de mapas interativos integrada para localização de ações ou pontos de interesse.
* **Interface e Navegação:** Fluxo completo de telas estruturado e fluido utilizando o *React Navigation*.

### ⏳ Em Desenvolvimento (Próximas Etapas):
* **Conexão com Banco de Dados:** Migração das persistências locais (como fotos e localizações) para um serviço em tempo real na nuvem.
* **Autenticação:** Sistema de login e cadastro de usuários seguro.
* **Regras de Negócio:** Finalização das lógicas internas e dinâmicas de pontos de recompensa.

---

## 🛠️ Tecnologias & Bibliotecas Utilizadas

Este projeto foi construído utilizando as seguintes ferramentas e tecnologias de ponta:

* **[React Native](https://reactnative.dev/):** Framework para construção de aplicativos nativos usando React.
* **[Expo](https://expo.dev/):** Plataforma moderna de desenvolvimento e testes de apps nativos.
* **[TypeScript](https://www.typescriptlang.org/):** Supersset do JavaScript que adiciona tipagem estática e segurança ao código.
* **[React Navigation](https://reactnavigation.org/):** Roteamento e navegação entre telas de forma nativa.
* **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/):** Armazenamento local de chave-valor para persistência de dados no dispositivo.
* **[React Native SVG / QR Code](https://github.com/awesomejerry/react-native-qrcode-svg):** Biblioteca para renderização e geração de códigos QR funcionais em formato vetorizado.

---

## 🔀 Sistema de Branches & Instalação de Dependências

Para evitar conflitos de versão do ecossistema Expo e garantir compatibilidade entre o Emulador (PC) e o Celular Físico, o projeto foi dividido em ramificações dedicadas.

⚠️ **IMPORTANTE:** Sempre que você mudar de branch (`git checkout`), **você é obrigado a instalar/sincronizar as bibliotecas correspondentes daquela versão** rodando o comando de instalação específico listado abaixo. Sem isso, o projeto dará erro de incompatibilidade de pacotes (`package.json`).

### 💻📱 Guia de Execução (Escolha o seu Ambiente)

```cmd
:: =========================================================================
:: OPÇÃO 1: Para quem vai rodar na SDK 55 (Computador / Emulador / Android Studio)
:: =========================================================================
git checkout sdk55-pc
npm install expo@^55.0.0 react-native@0.78.0 --legacy-peer-deps && npx expo install --fix -- --legacy-peer-deps
npx expo start --clear

:: =========================================================================
:: OPÇÃO 2: Para quem vai rodar na SDK 54 (Celular Físico com Expo Go Antigo)
:: =========================================================================
git checkout sdk54-celular
npm install expo@^54.0.0 react-native@0.76.0 --legacy-peer-deps && npx expo install --fix -- --legacy-peer-deps
npx expo start --clear

```

```

```
