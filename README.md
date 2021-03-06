# NativeScript-Vue Application

> A native application built with NativeScript-Vue, using Firebase!

## Disclaimer
This is a Dutch app, only available in the NL App stores.

Feel free to look at the code and copy anything you like.

## Configuration
I don't recommend trying to run the app, because the Firebase config files are missing in this repo.

If you still want to try and run the app you'll need your own Firebase backend configured properly,
and download your `google-services.json` and `GoogleService-Info.plist` from the Firebase console,
and add them to the appropriate `App_Resources` folders.

Ask me for a DB dump if you're really anxious to run it locally.

## Usage

Note that this project works best with NativeScript 5+, so: `npm i -g nativescript@latest`.

``` bash
# Install dependencies
npm install

# Watch for TS changes
npm run tsc

# Then in another window
npm run ios

#### Other commands

# Build for production
tns build <platform> --bundle

# Build, watch for changes and debug the application
tns debug <platform> --bundle

# Build, watch for changes and run the application
tns run <platform> --bundle

# Build, watch for changes and run the application on an emulator
tns run <platform> --bundle --emulator
```

### HMR support
You can also try this to save a little time (not available on NativeScript < 5):

```bash
tns run android --hmr
```

### Android build fix
Apply this change to node_modules: https://github.com/triniwiz/nativescript-youtubeplayer/pull/47.
But change the (<any>blabla) to: this._getFragmentManager()) as it's a .js file ;)