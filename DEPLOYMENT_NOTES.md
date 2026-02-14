# Deployment notes

I attempted to publish this app using Cloudflare Tunnel (`cloudflared tunnel --url http://127.0.0.1:4173`) so it would have a public URL.

The environment cannot open outbound connections to Cloudflare (`connect: network is unreachable`), so a public internet URL could not be created from this container.

## Run locally

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Then open: <http://localhost:4173>
