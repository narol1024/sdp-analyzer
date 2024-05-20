# SDP-Analyzer

An analyzer to implement the SDP (Stable Dependencies Principle) theory. You can quickly analyze your npm package here: https://narol.pro/sdp-analyzer

![](https://narol-blog.oss-cn-beijing.aliyuncs.com/blog-img/202405192118699.png)

Here's just a simple quote, the theory is as follows:


> Fan-in = Number of classes outside the component which depends on the component.
> Fan-out = Number of classes outside the component which the component depends on.
> 
> Instability = Fan-out / (Fan-in + Fan-out).

> Example: Component A has three classes from component B that depends on it (Fan-in = 3). Component A also depends on two classes from component C (Fan-out = 2). Therefore, the instability value for component A is 2/(3+2) = 2/5.

For more details, please read: [My blog](https://narol.pro/2022/02/09/techniques/ru-he-heng-liang-zu-jian-de-wen-ding-xing/).

## Installation

```
npm i sdp-analyzer -g
```

## Usages

### CLI
 
#### To analyze local package

```bash
sdp-analyzer analyze ./examples
```

#### To analyze NPM package

```bash
sdp-analyzer analyze react,vue,svelte,audio-analyser-cli
```

#### Npx

```bash
npx sdp-analyzer analyze react,vue,svelte,audio-analyser-cli
```

### API Reference

```javascript
const sdpAnalyer = require("sdp-analyzer");
try {
  const deps = await sdpAnalyer.analyze("react");
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

### Extension

The Analyzing rule above based on the number of dependencies or dependents is a simple assessment. 

I think the rules could be much more exact, such as using more data from GitHub stars or NPM downloads to assess again. 💡 In that case, it should be called the "Stability Analyzer".