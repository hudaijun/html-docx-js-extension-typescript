# html-docx-js-extension-typescript

[![NPM version][npm-image]][npm-url]

> Modify [html-docx-js-typescript](https://www.npmjs.com/package/html-docx-js-typescript) with Typescript.

For previous code, I have added the setting of paper width and height. by default is A4

Convert HTML documents to docx format.

## Installing

```
npm install html-docx-js-extension-typescript --save-dev
```

## Usage

Support node.js and browser enviroment, including vue/react/angular.

#### Vue.js usage demo:

```js
import { asBlob } from 'html-docx-js-extension-typescript'
// if you want to save the docx file, you need import 'file-saver'
import { saveAs } from 'file-saver'

const htmlString = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <h1>Welcome</h1>
</body>
</html>`

export default {
  methods: {
    saveDocx() {
      asBlob(htmlString).then(data => {
        saveAs(data, 'file.docx') // save as docx file
      }) // asBlob() return Promise<Blob|Buffer>
    },
  },
}
```

And you can set options including margins and orientation and paper height and width , A4 is default.

```js
const data = await asBlob(htmlString, { orientation: 'landscape', margins: { top: 100 } })
```

#### literal type widen issue

If you use this package in a Typescript file and declare the options to an independent `Object` like:

```js
import { asBlob } from 'html-docx-js-extension-typescript'
const opt = {
  width: 11946, //A4 paper is default
  height: 16838,
  margin: {
    top: 100,
  },
  orientation: 'landscape', // type error: because typescript automatically widen this type to 'string' but not 'Orient' - 'string literal type'
}
await asBlob(html, opt)
```

You can use `as const` to avoid type widening.

```js
const opt = {
  margin: {
    top: 100
  },
  orientation: 'landscape' as const
}
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/html-docx-js-typescript
[npm-url]: https://npmjs.com/package/html-docx-js-typescript
