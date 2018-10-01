# Firebase Tools project

We use this to write firestore security rules, firestore indexes, and - most importantly - maintain our Cloud Functions.

### Cloud Functions
See the functions/src folder.

Inspiration [here](https://github.com/firebase/functions-samples).

### Install

```bash
npm install -g firebase-tools
```

### Login to the Firebase CLI

```bash
firebase logout # if needed
firebase login # pick info@combidesk.com in the OAuth flow
```

### Run

```bash
cd functions
npm run 
```

### Deploy Functions

```bash
cd functions
npm run deploy
```