# SDP-Analyzer

An analyzer to implement the SDP (Stable Dependencies Principle) theory.

![](https://narol-blog.oss-cn-beijing.aliyuncs.com/blog-img/202405182335650.png)

## Installation

```
npm i sdp-analyzer -g
```

## Usages

### CLI

#### To analyze local package

```bash
sdp-analyzer ./examples
```

#### To analyze NPM package

```bash
sdp-analyzer react,vue,svelte,audio-analyser-cli
```

### Npx

```bash
npx sdp-analyzer react,vue,svelte,audio-analyser-cli
```

### API

```javascript
const sdpAnalyer = require("sdp-analyzer");
try {
  const deps = await sdpAnalyer.analyze(targetPackage);
} catch (error) {
  //  handle error
}
```

The results are similar to the following:

```json
[
  {
    "name": "react",
    "in": 195657,
    "out": 1,
    "instable": 0.000005110958918112216,
    "label": "Stable"
  }
]
```
