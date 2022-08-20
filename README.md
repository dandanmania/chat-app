# chat-app

This project is from [CareerFoundry's Full Stack Web Development Program](https://careerfoundry.com/en/courses/become-a-web-developer/) Achievement 5. This is a chat app for mobile devices buit using ReactNative. The app will provide users with a chat interface and options to share images and their location.

## Created With / Uses

- React Native
- Expo
- GiftedChat
- Google Firestore Database

## Set Up Development Environment

1. Install [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
   `npm install expo-cli`

2. Insall [Android Studio](https://developer.android.com/studio)

- Be sure **Android Virtual Device** is installed during the installation process.

3. Once Android Studio is installed, launch and configure Android Studio.

   - Open Android Studio
   - In welcome screen, click **More Options**, select **SDK Manager**, and make sure "Android SDK Build-Tools" is installed. Be sure to install "Android Emulator Hypervisor Driver for AMD processors (installer)" or "Intel x86 Emulator Accelerator (HAXM installer)" depending on your device's CPU (AMD and Intel respectively)
   - For MacOS, Add Android SDK Location to your "~/.bash_profile", "~/.bashrc", or "/.zshrc" depending on if you're using bash or zsh terminal.
     <br>

   ```
   export ANDROID_SDK=/Users/[system user name here]/Library/Android/sdk
   export PATH=/Users/[system user name here]/Library/Android/sdk/platform-tools:$PATH
   ```

4. Create and Open a Android Virtual Device

   - In the welcome screen, click **More Options**, select **Virtual Device Manager**
   - Select **Create Virtual Device** along with whichever device you'd like to use.
   - Go through the setup process with the respective, compatible OS.
   - When the device is set up, click the play button to start the emulator.

5. Install [GiftedChat](https://github.com/FaridSafi/react-native-gifted-chat)
   `npm install react-native-gifted-chat` or `yarn add react-native-gifted-chat`

6. Install react-navigation, react-native-svg, asyncStorage, NetInfo, Permissions, ImagePicker, Location, react-native-maps
   `npm install @react-navigation/native @react-navigation/stack` <br>
   `expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view react-native-svg @react-native-async-storage/async-storage @react-native-community/netinfo expo-permissions expo-image-picker expo-locations react-native-maps` <br>

7. Install Cloud Firestore and Firebase
   `npm install firebase`

8. Connect Firebase
   - Under your Firebase's Project Settings > General, scroll down until you find "Your Apps" and copy and use
   ```
   const firebaseConfig = {
       [Your Config]
   };
   ```
   - Replace the firebaseConfig in Chat.js Lines 28-35
