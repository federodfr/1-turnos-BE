export const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
};

export function sendJson(res, status, data) {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(data));
}

export function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("El body debe ser un JSON válido"));
      }
    });

    req.on("error", reject);
  });
}
