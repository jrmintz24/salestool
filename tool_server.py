#!/usr/bin/env python3
"""Simple HTTP entrypoint for the Sales Tool.

Runs on 0.0.0.0 by default so the tool is reachable from outside the container.
"""

from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, data: dict, status: int = 200) -> None:
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path in {"/", "/health"}:
            self._send_json(
                {
                    "status": "ok",
                    "message": "Sales Tool is reachable.",
                    "host": HOST,
                    "port": PORT,
                }
            )
        else:
            self._send_json({"error": "Not found"}, status=404)

    def log_message(self, format: str, *args):
        return


if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    print(f"Sales Tool listening on http://{HOST}:{PORT}")
    server.serve_forever()
