# MNIST Handwritten digit classification in browser
MNIST Handwritten digit classification in browser using tensorflow.js

This repo is created while exercising "Tensorflow.js – Handwritten digit recognition with CNNs" tutorial
https://codelabs.developers.google.com/codelabs/tfjs-training-classfication

I have made few modifications to the original tutorial. Should be straightforward enough to follow.

### Modifications from the original tutorial -
- `data.js` has been renamed to `data.ts` and annotated with types using typescript
- `script.js` has been renamed to `training.ts` and annotated with types using typescript

## Install the local yarn packages
```
$ yarn 
```
OR
```
$ npm install
```

## Starting the project for development

```
$ yarn start
```
OR
```
$ npm start
```

## Building the project for production

```
$ yarn build
```
OR 
```
$ npm run build
```

## Requirements
```
$ node --version
v10.13.0

$ npm --version
6.4.0

$ yarn --version
1.12.3

```

To install NodeJS, I recommend using `nvm` script
in Linux/Mac machines
- `https://github.com/creationix/nvm#installation-and-update`

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```

For windows users -
https://github.com/coreybutler/nvm-windows (Haven't tried this though 😉, so I cannot recommend use it at your own risk)


To install `yarn`

```
npm install -g yarn@1.12.3
```

