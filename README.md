# 1-turnos-BE - Sistema de Gestión de Turnos (Servidor HTTP Nativo)

Primera iteración del backend para el sistema de gestión de turnos y servicios. Esta versión está construida sobre **Node.js nativo**, utilizando exclusivamente el módulo `http` de la plataforma para comprender el funcionamiento bajo nivel del protocolo HTTP, la manipulación de streams de datos y la gestión de memoria sin frameworks adicionales.

---

## 📋 Descripción

El proyecto expone una API REST para gestionar el recurso **Servicios** (`services`). En esta etapa inicial:
- Se utiliza el módulo nativo `http` de Node.js para crear el servidor y resolver las rutas manualmente mediante expresiones regulares y objetos `URL`.
- La lectura y deserialización del cuerpo de las peticiones (`body`) se realiza procesando streams de datos (`data` y `end`).
- Los datos se almacenan temporalmente en memoria mediante la clase `ServiceManager`.
- La configuración se centraliza con `dotenv` y se valida de forma estricta al iniciar el servidor.

---

## 🛠️ Requisitos Previos

- **Node.js** (versión 18 o superior recomendada)
- **npm** (gestor de paquetes de Node.js)

---

## ⚙️ Variables de Entorno

El proyecto requiere un archivo `.env` en la raíz del directorio `1-turnos-BE`. Se incluye un archivo `.env.example` como plantilla de referencia:

```env
PORT=8080
NODE_ENV=development
```

### Detalle de variables:

| Variable | Tipo | Obligatoria | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | Number | Sí | Puerto donde correrá el servidor HTTP | `8080` |
| `NODE_ENV` | String | Sí | Entorno de ejecución (`development` / `production`) | `development` |

> [!IMPORTANT]
> Si alguna de las variables requeridas no está definida en el `.env`, el archivo `src/config/env.config.js` detendrá la ejecución del proceso con un mensaje de error explicativo.

---

## 📦 Cómo Instalar

1. Abre una terminal y navega hasta el directorio del proyecto:
   ```bash
   cd 1-turnos-BE
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Crea y configura tu archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
   *(En Windows PowerShell: `Copy-Item .env.example .env`)*

---

## 🚀 Cómo Ejecutar

- **Modo Desarrollo** (recarga automática con `nodemon`):
  ```bash
  npm run dev
  ```

- **Modo Inicio Estándar**:
  ```bash
  npm start
  ```

El servidor quedará disponible en: `http://localhost:8080` (o el puerto configurado).

---

## 📁 Estructura del Proyecto

```text
1-turnos-BE/
├── .env.example              # Plantilla de variables de entorno
├── package.json              # Configuración y scripts del proyecto
├── src/
│   ├── app.js                # Servidor HTTP nativo y enrutador principal
│   ├── config/
│   │   └── env.config.js     # Carga y validación de variables de entorno
│   ├── data/
│   │   └── services.json     # Archivo JSON de almacenamiento (base)
│   ├── managers/
│   │   └── ServiceManager.js # Lógica de gestión en memoria de servicios
│   └── utils/
│       └── http.js           # Helpers para parseo de body y envío de JSON
```

---

## 🏷️ Descripción del Recurso `services`

El recurso `services` representa cada prestación o atención que puede ser reservada dentro del sistema.

### Estructura de un Servicio:

| Propiedad | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `String` (UUID) | Autogenerado | Identificador único generado con `crypto.randomUUID()` |
| `name` | `String` | Sí | Nombre comercial del servicio |
| `description` | `String` | Sí | Descripción detallada de qué incluye |
| `duration` | `Number` | Sí | Duración estimada del servicio en minutos |
| `price` | `Number` | Sí | Costo monetario del servicio |
| `category` | `String` | Sí | Categoría a la que pertenece (ej: Peluquería, Spa) |
| `available` | `Boolean` | Sí | Estado de disponibilidad (`true` o `false`) |

---

## 🔌 Endpoints y Ejemplos de Uso

### 1. Obtener todos los servicios
- **Método**: `GET`
- **Ruta**: `/services`
- **Código de éxito**: `200 OK`

**Ejemplo de Petición cURL:**
```bash
curl -X GET http://localhost:8080/services
```

**Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "e30c4e10-9118-4720-94d3-4a11f8b89410",
    "name": "Corte de Cabello",
    "description": "Corte y peinado clásico",
    "duration": 45,
    "price": 8500,
    "category": "Peluquería",
    "available": true
  }
]
```

---

### 2. Obtener un servicio por ID
- **Método**: `GET`
- **Ruta**: `/services/:id`
- **Códigos de respuesta**:
  - `200 OK`: Servicio encontrado.
  - `404 Not Found`: Si el ID no existe.

**Ejemplo de Petición cURL:**
```bash
curl -X GET http://localhost:8080/services/e30c4e10-9118-4720-94d3-4a11f8b89410
```

**Respuesta de Error (404 Not Found):**
```json
{
  "error": "Servicio no encontrado"
}
```

---

### 3. Crear un nuevo servicio
- **Método**: `POST`
- **Ruta**: `/services`
- **Headers**: `Content-Type: application/json`
- **Códigos de respuesta**:
  - `201 Created`: Servicio creado exitosamente.
  - `400 Bad Request`: Faltan campos requeridos o body mal formado.

**Ejemplo de Petición cURL:**
```bash
curl -X POST http://localhost:8080/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manicura Rusa",
    "description": "Limpieza y esmaltado semipermanente",
    "duration": 60,
    "price": 12000,
    "category": "Estética",
    "available": true
  }'
```

**Respuesta Exitosa (201 Created):**
```json
{
  "id": "7b8e1f0e-3fa5-450a-9d92-1fb0dbca5a8a",
  "name": "Manicura Rusa",
  "description": "Limpieza y esmaltado semipermanente",
  "duration": 60,
  "price": 12000,
  "category": "Estética",
  "available": true
}
```

---

### 4. Actualizar un servicio
- **Método**: `PUT`
- **Ruta**: `/services/:id`
- **Headers**: `Content-Type: application/json`
- **Códigos de respuesta**:
  - `200 OK`: Servicio actualizado.
  - `400 Bad Request`: Body inválido, sin campos para actualizar o intento de modificar el `id`.
  - `404 Not Found`: Servicio no encontrado.

**Ejemplo de Petición cURL:**
```bash
curl -X PUT http://localhost:8080/services/7b8e1f0e-3fa5-450a-9d92-1fb0dbca5a8a \
  -H "Content-Type: application/json" \
  -d '{
    "price": 13500,
    "available": true
  }'
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "7b8e1f0e-3fa5-450a-9d92-1fb0dbca5a8a",
  "name": "Manicura Rusa",
  "description": "Limpieza y esmaltado semipermanente",
  "duration": 60,
  "price": 13500,
  "category": "Estética",
  "available": true
}
```

---

### 5. Eliminar un servicio
- **Método**: `DELETE`
- **Ruta**: `/services/:id`
- **Códigos de respuesta**:
  - `200 OK`: Servicio eliminado (retorna el objeto eliminado).
  - `404 Not Found`: Servicio no encontrado.

**Ejemplo de Petición cURL:**
```bash
curl -X DELETE http://localhost:8080/services/7b8e1f0e-3fa5-450a-9d92-1fb0dbca5a8a
```

**Respuesta Exitosa (200 OK):**
```json
{
  "id": "7b8e1f0e-3fa5-450a-9d92-1fb0dbca5a8a",
  "name": "Manicura Rusa",
  "description": "Limpieza y esmaltado semipermanente",
  "duration": 60,
  "price": 13500,
  "category": "Estética",
  "available": true
}
```

