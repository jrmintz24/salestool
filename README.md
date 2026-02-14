# Sales Tool Access

The repo now includes a minimal web server that binds to `0.0.0.0` so the tool is accessible externally.

## Run

```bash
python3 tool_server.py
```

Optional environment variables:

- `HOST` (default: `0.0.0.0`)
- `PORT` (default: `8080`)

Example:

```bash
HOST=0.0.0.0 PORT=3000 python3 tool_server.py
```

## Verify

```bash
curl http://localhost:8080/health
```

Expected response:

```json
{"status":"ok","message":"Sales Tool is reachable.","host":"0.0.0.0","port":8080}
```
