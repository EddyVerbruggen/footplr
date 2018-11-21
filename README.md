# NativeScript-Vue Application

> A native application built with NativeScript-Vue, using Firebase!

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