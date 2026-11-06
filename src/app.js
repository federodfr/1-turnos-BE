import http from "http";
import config from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";
import { readBody, sendJson } from "./utils/http.js";

const PORT = config.port;
const NODE_ENV = config.nodeEnv;


const serviceManager = new ServiceManager();
const REQUIRED_FIELDS = ["name", "description", "duration", "price", "category", "available"];

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method.toUpperCase();
    const isCollection = pathname === "/services" || pathname === "/services/";
    const byIdMatch = pathname.match(/^\/services\/([^/]+)\/?$/);
    const id = byIdMatch ? byIdMatch[1] : null;

    if (method === "GET" && isCollection) {
      sendJson(res, 200, serviceManager.getServices());
      return;
    }

    if (method === "GET" && id) {
      const service = serviceManager.getServicesById(id);
      if (!service) {
        sendJson(res, 404, { error: "Servicio no encontrado" });
        return;
      }
      sendJson(res, 200, service);
      return;
    }

    if (method === "DELETE" && id) {
      const deleted = serviceManager.deleteService(id);
      if (!deleted) {
        sendJson(res, 404, { error: "Servicio no encontrado" });
        return;
      }
      sendJson(res, 200, deleted);
      return;
    }

    if (method === "POST" && isCollection) {
      const body = await readBody(req);

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        sendJson(res, 400, { error: "El body debe ser un objeto JSON" });
        return;
      }

      const missingFields = REQUIRED_FIELDS.filter((field) => {
        const value = body[field];
        return value === undefined || value === null || value === "";
      });

      if (missingFields.length > 0) {
        sendJson(res, 400, {
          error: `Body inválido. Faltan campos requeridos: ${missingFields.join(", ")}`,
        });
        return;
      }

      const created = serviceManager.createService(
        body.name,
        body.description,
        body.duration,
        body.price,
        body.category,
        body.available
      );

      if (!created) {
        sendJson(res, 400, { error: "No se pudo crear el servicio. Todos los campos son requeridos." });
        return;
      }

      sendJson(res, 201, created);
      return;
    }

    if (method === "PUT" && id) {
      const body = await readBody(req);

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        sendJson(res, 400, { error: "El body debe ser un objeto JSON" });
        return;
      }

      if (body.id && body.id !== id) {
        sendJson(res, 400, { error: "No se permite modificar el id del servicio" });
        return;
      }

      const { id: _ignoredId, ...data } = body;
      const allowedFields = ["name", "description", "duration", "price", "category", "available"];
      const hasValidField = allowedFields.some((field) => data[field] !== undefined);

      if (!hasValidField) {
        sendJson(res, 400, {
          error: "Body inválido. Enviá al menos un campo para actualizar: name, description, duration, price, category, available",
        });
        return;
      }

      const updated = serviceManager.updateService(id, data);
      if (!updated) {
        sendJson(res, 404, { error: "Servicio no encontrado" });
        return;
      }

      sendJson(res, 200, updated);
      return;
    }

    sendJson(res, 404, { error: "Ruta no encontrada" });
  } catch (error) {
    const status = error.message.includes("JSON") ? 400 : 500;
    sendJson(res, status, { error: error.message || "Error interno del servidor" });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor HTTP en http://localhost:${PORT} (${NODE_ENV})`);
});
