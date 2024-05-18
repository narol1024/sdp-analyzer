# SDP-Analyzer

An analyzer to implement the SDP (Stable Dependencies Principle) theory.

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
const sdpAnalyer = require('sdp-analyzer');
```
