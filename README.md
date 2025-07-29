# OfflineAI

OfflineAI is a pocket-sized AI assistant powered by small language models (SLMs) that run directly on your phone. Designed for both iOS and Android, OfflineAI  lets you interact with various SLMs without the need for an internet connection. Your privacy is fully protected as all processing happens entirely on-device — your conversations, prompts, and data never leave your phone or get stored on external servers.

> **Note on Privacy**: The only data that may leave your device is what you explicitly choose to share: benchmark results (if you opt to contribute to the leaderboard) and any feedback you voluntarily submit through the app.

## Features

- **Offline AI Assistance**: Run language models directly on your device without internet connectivity.
- **Model Flexibility**: Download and swap between multiple SLMs, including Danube 2 and 3, Phi, Gemma 2, and Qwen.
- **Auto Offload/Load**: Automatically manage memory by offloading models when the app is in the background.
- **Inference Settings**: Customize model parameters like system prompt, temperature, BOS token, and chat templates.
- **Real-Time Performance Metrics**: View tokens per second and milliseconds per token during AI response generation.
- **Message Editing**: Edit your messages and retry AI generation.
- **Personalized Pals**: Create different AI personalities with customized settings.
- **Background Downloads**: Continue downloading models while using other apps (iOS).
- **Screen Awake During Inference**: Keep your screen on while the AI is generating responses.
- **Multi-device Support**: Optimized for both phones and tablets, including iPad.
- **Localization**: Use the app in your preferred language.
- **Hugging Face Integration**: Access both public and gated models with authentication.

## Installation
From the app store or developement setup.
### Send Feedback

Share your thoughts directly from the app:

1. Navigate to the App Info page
2. Tap on "Sharing your thoughts" 
3. Type in whatever you'd like to share, from feature requests to suggestions
4. Hit "Submit Feedback"

<img src="assets/images and logos/Send_Feedback.png" alt="Send Feedback Screenshot" width="50%">

## Development Setup

Interested in contributing or running the app locally? Follow the steps below.

### Prerequisites

- **Node.js** (version 18 or higher)
- **Yarn**
- **React Native CLI**
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)

### Getting Started

1. **Fork and Clone the Repository**

   ```bash
   git clone https://github.com/accylin-labs/offline-ai
   cd offline-ai
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Install Pod Dependencies (iOS Only)**

   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run the App**

   - **iOS Simulator**

     ```bash
     yarn ios
     ```

   - **Android Emulator**

     ```bash
     yarn android
     ```

### Scripts

- **Start Metro Bundler**

  ```bash
  yarn start
  ```

- **Clean Build Artifacts**

  ```bash
  yarn clean
  ```

- **Lint and Type Check**

  ```bash
  yarn lint
  yarn typecheck
  ```

- **Run Tests**

  ```bash
  yarn test
  ```

### Quick Start for Contributors

1. **Fork the Repository**
2. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
4. **Test Your Changes**

   - **Run on iOS**

     ```bash
     yarn ios
     ```

   - **Run on Android**

     ```bash
     yarn android
     ```

5. **Lint and Type Check**

   ```bash
   yarn lint
   yarn typecheck
   ```

6. **Commit Your Changes**

   - Follow the Conventional Commits format:

     ```bash
     git commit -m "feat: add new model support"
     ```

7. **Push and Open a Pull Request**

   ```bash
   git push origin feature/your-feature-name
   ```

## Roadmap

- **New Models**: Add support for more tiny LLMs.
- **UI/UX Enhancements**: Continue improving the overall user interface and user experience.
- **Improved Documentation**: Enhance the documentation of the project.
- **Performance Optimization**: Further optimize performance across different device types.
- **More Languages**: Add support for additional languages through localization.
- **Enhanced Error Handling**: Improve error handling and recovery mechanisms.

Feel free to open issues to suggest features or report bugs.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please open an issue.

## Acknowledgements

OfflineAI is built using the amazing work from:
- **"@pocketpalai/llama.rn@^0.6.1-1"**
- **[llama.cpp](https://github.com/ggerganov/llama.cpp)**: Enables efficient inference of LLMs on local devices.
- **[llama.cpp](https://github.com/ggerganov/llama.cpp)**: Enables efficient inference of LLMs on local devices.
- **[llama.rn](https://github.com/mybigday/llama.rn)**: Implements llama.cpp bindings into React Native.
- **[React Native](https://reactnative.dev/)**: The framework powering the cross-platform mobile experience.
- **[MobX](https://mobx.js.org/)**: State management library that keeps the app reactive and performant.
- **[React Native Paper](https://callstack.github.io/react-native-paper/)**: Material Design components for the UI.
- **[React Navigation](https://reactnavigation.org/)**: Routing and navigation for the app's screens.
- **[Gorhom Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet)**: Powers the smooth bottom sheet interactions throughout the app.
- **[@dr.pogodin/react-native-fs](https://github.com/birdofpreyru/react-native-fs)**: File system access that enables model download and management.

And many other open source libraries that make this project possible!
