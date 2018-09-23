# Firebase Tools project

We use this to write firestore security rules, firestore indexes, and - most importantly - maintain our Cloud Functions.

### Cloud Functions
See the functions/src folder.

Inspiration [here](https://github.com/firebase/functions-samples).

### Install
```bash
 npm install -g firebase-tools
```

### Deploy

##### Everything

```bash
firebase deploy
```

##### Functions only

```bash
firebase deploy --only functions
```