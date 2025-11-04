# Todo App - React Native with Convex

A sophisticated Todo List application built with React Native (Expo), featuring real-time backend integration with Convex and smooth light/dark theme switching.

## Features

- **Real-time CRUD Operations**: Create, read, update, and delete todos with instant synchronization via Convex
- **Theme Switching**: Beautiful light and dark themes with smooth transitions and persistent preferences
- **Search & Filter**: Quickly find todos with search functionality and filter by status (all, active, completed)
- **Drag & Reorder**: Intuitive drag-and-drop to reorder your todos
- **Due Dates**: Set and track due dates for your tasks with visual indicators for overdue items
- **Responsive Design**: Pixel-perfect implementation that works across all screen sizes
- **Accessibility**: Full support for screen readers and high contrast ratios

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Watchman (for macOS users)
- Expo CLI
- A Convex account (sign up at https://convex.dev)

### For Android Development:
- Android Studio
- Android SDK

### For iOS Development (macOS only):
- Xcode
- CocoaPods

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd todo-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Convex

#### Step 1: Create a Convex Account
1. Visit https://convex.dev and sign up for a free account
2. Install Convex CLI globally (optional):
   ```bash
   npm install -g convex
   ```

#### Step 2: Initialize Convex
Run the following command and follow the prompts:

```bash
npx convex dev
```

This will:
- Prompt you to log in to your Convex account
- Create a new Convex project (or link to an existing one)
- Generate the necessary configuration files
- Start the Convex development server
- Provide you with a deployment URL

#### Step 3: Copy Your Convex URL
After running `npx convex dev`, you'll receive a deployment URL like:
```
https://your-project-name.convex.cloud
```

Copy this URL.

#### Step 4: Update Environment Variables
1. Open the `.env` file in the root directory
2. Add your Convex URL:
   ```
   EXPO_PUBLIC_CONVEX_URL=https://your-project-name.convex.cloud
   ```

### 4. Start the Development Server

In a **new terminal window** (keep `npx convex dev` running in the first terminal), start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools in your browser.

### 5. Run the App

#### On Android:
```bash
npm run android
```
Or press `a` in the Expo DevTools terminal.

#### On iOS (macOS only):
```bash
npm run ios
```
Or press `i` in the Expo DevTools terminal.

#### On Web:
```bash
npm run web
```
Or press `w` in the Expo DevTools terminal.

#### Using Expo Go App:
1. Install Expo Go on your mobile device from the App Store or Google Play
2. Scan the QR code shown in the terminal with:
   - iOS: Camera app
   - Android: Expo Go app

## Project Structure

```
todo-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── TodoItem.tsx
│   │   ├── ThemeSwitcher.tsx
│   │   └── AddTodoModal.tsx
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx # Theme management
│   ├── screens/             # App screens
│   │   └── HomeScreen.tsx   # Main todo list screen
│   ├── theme/               # Theme configuration
│   │   └── index.ts         # Light & dark theme definitions
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── hooks/               # Custom React hooks (if any)
├── convex/                  # Convex backend
│   ├── schema.ts            # Database schema
│   ├── todos.ts             # Todo queries and mutations
│   └── tsconfig.json
├── App.tsx                  # App entry point
├── package.json
├── .env                     # Environment variables
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
EXPO_PUBLIC_CONVEX_URL=https://your-project-name.convex.cloud
```

**Important**: Replace `your-project-name` with your actual Convex deployment URL.

## Build Commands

### Development Build

```bash
npm start
```

### Production Build (Android APK)

#### Option 1: Using EAS Build (Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure EAS:
   ```bash
   eas build:configure
   ```

4. Build APK:
   ```bash
   eas build --platform android --profile preview
   ```

5. Download the APK from the provided link

#### Option 2: Local Build

```bash
npm run android -- --variant=release
```

### Production Build (iOS)

```bash
eas build --platform ios
```

## Testing

### Manual Testing Checklist

- [ ] Create a new todo
- [ ] Edit an existing todo
- [ ] Mark todo as complete/incomplete
- [ ] Delete a todo
- [ ] Search for todos
- [ ] Filter todos (all, active, completed)
- [ ] Drag and reorder todos
- [ ] Set due dates
- [ ] Switch between light and dark themes
- [ ] Verify theme preference persists after app restart
- [ ] Clear completed todos
- [ ] Test on different screen sizes
- [ ] Test accessibility features

### Running Tests

```bash
npm test
```

## Convex Setup Steps (Detailed)

### First Time Setup

1. **Create Convex Account**
   - Go to https://dashboard.convex.dev/
   - Sign up with GitHub, Google, or email

2. **Initialize Convex in Your Project**
   ```bash
   npx convex dev
   ```

3. **Follow the Interactive Prompts**
   - Log in to your Convex account when prompted
   - Choose "Create a new project" or select an existing one
   - The CLI will automatically:
     - Create necessary configuration files
     - Deploy your schema and functions
     - Start watching for changes

4. **Get Your Deployment URL**
   - After setup, you'll see output like:
     ```
     Convex functions ready at https://happy-animal-123.convex.cloud
     ```
   - Copy this URL

5. **Update Your .env File**
   ```env
   EXPO_PUBLIC_CONVEX_URL=https://happy-animal-123.convex.cloud
   ```

### Subsequent Development

Always run these two commands in separate terminals:

**Terminal 1** (Convex backend):
```bash
npx convex dev
```

**Terminal 2** (React Native app):
```bash
npm start
```

## Troubleshooting

### Convex Connection Issues

**Problem**: "Failed to connect to Convex"

**Solutions**:
1. Ensure `npx convex dev` is running
2. Check that `EXPO_PUBLIC_CONVEX_URL` is correctly set in `.env`
3. Restart the Expo development server

### Build Errors

**Problem**: TypeScript errors about missing Convex types

**Solution**:
```bash
npx convex dev
```
This will regenerate the Convex type definitions in `convex/_generated/`.

### Theme Not Persisting

**Problem**: Theme resets to light mode on app restart

**Solution**:
1. Clear app data/cache
2. Reinstall the app

### Android Build Fails

**Problem**: Gradle build errors

**Solutions**:
1. Clean Gradle cache:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```
2. Update Android SDK tools
3. Check `android/build.gradle` for correct versions

## Accessibility Features

- High contrast ratios for better visibility
- Screen reader support
- Accessible touch targets (minimum 44x44 points)
- Semantic HTML and ARIA labels
- Keyboard navigation support

## Performance Optimizations

- React.memo for component optimization
- useCallback for function memoization
- Virtualized lists for large datasets
- Optimistic UI updates
- Real-time data synchronization with Convex

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Convex (real-time database and serverless functions)
- **State Management**: React Context API
- **UI Components**: Custom components with TypeScript
- **Styling**: StyleSheet API with theme system
- **Data Persistence**: AsyncStorage for theme, Convex for todos
- **Animations**: React Native Reanimated
- **Drag & Drop**: react-native-draggable-flatlist

## License

MIT License

## Author

Built for HNG Stage 3b

## Support

For issues and questions:
- Check the troubleshooting section above
- Review Convex documentation: https://docs.convex.dev/
- Review Expo documentation: https://docs.expo.dev/

## Screenshots

[Add screenshots of your app here showing light theme, dark theme, and main features]

---

**Note**: Make sure to keep both `npx convex dev` and `npm start` running during development for the best experience!
