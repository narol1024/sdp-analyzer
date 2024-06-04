# SDP-Analyzer-App

## Installation

```bash
npm install
```

## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Troubleshooting

1. npm run on a read-only filesystem does not work, like below:

```bash
npm ERR! code ENOENT
npm ERR! syscall mkdir
npm ERR! path /home/sbx_user1051
npm ERR! errno -2
npm ERR! enoent ENOENT: no such file or directory, mkdir '/home/sbx_user1051'
npm ERR! enoent This is related to npm not being able to find a file.
npm ERR! enoent 
npm verb exit -2
npm verb unfinished npm timer command:view 1717475825685
npm verb code -2

npm ERR! Log files were not written due to an error writing to the directory: /home/sbx_user1051/.npm/_logs
npm ERR! You can rerun the command with `--loglevel=verbose` to see the logs in your terminal
```

After setting the npm_config_cache env var to /tmp/npm/, it needs to re-deploy this project.