# Laboratorio 4 — Contenedores y Despliegue con Docker

**Computación en la Nube — Universidad de Antioquia (UdeA) 2026**

Aplicación web sencilla construida con **NestJS + TypeScript** que expone endpoints HTTP
(un saludo, un health check y operaciones matemáticas básicas). Se empaqueta en una
imagen Docker personalizada mediante un `Dockerfile` multi-etapa basado en `node:20-alpine`,
se ejecuta localmente exponiendo el puerto **3000** y se publica en **Docker Hub**.

## Estructura

```
Lab04/
├── src/
│   ├── main.ts               # Punto de entrada (escucha en 0.0.0.0:$PORT, por defecto 3000)
│   ├── app.module.ts
│   ├── app.controller.ts     # GET /  y  GET /health
│   ├── app.service.ts
│   └── math/                 # GET /math/{sum,subtract,multiply,divide}
├── test/                     # Pruebas e2e
├── Dockerfile                # Build multi-etapa (build + runtime)
├── .dockerignore
├── docker-compose.yml
└── package.json
```

## Endpoints

| Método | Ruta                          | Descripción                                    |
|--------|-------------------------------|------------------------------------------------|
| GET    | `/`                           | Saludo `¡Hola desde Docker!` + hostname del contenedor + timestamp |
| GET    | `/health`                     | Estado de la aplicación (`status`, `uptime`)   |
| GET    | `/math/sum?a=2&b=3`           | Suma `a + b`                                   |
| GET    | `/math/subtract?a=10&b=4`     | Resta `a - b`                                  |
| GET    | `/math/multiply?a=2&b=4`      | Multiplicación `a * b`                         |
| GET    | `/math/divide?a=10&b=4`       | División `a / b`                               |

Si `a` o `b` faltan o no son números, o si se divide por cero, la API responde **400 Bad Request**.

Ejemplos de respuesta:

```json
// GET /
{ "message": "¡Hola desde Docker!", "hostname": "1ba86c51def3", "timestamp": "2026-10-11T20:46:21.720Z" }

// GET /math/sum?a=2&b=3
{ "operation": "sum", "a": 2, "b": 3, "result": 5 }

// GET /math/divide?a=1&b=0
{ "message": "No se puede dividir por cero", "error": "Bad Request", "statusCode": 400 }
```

> El `hostname` dentro de un contenedor corresponde al ID corto del contenedor, lo que permite
> comprobar que la respuesta viene desde Docker.

## Ejecución local (sin Docker)

Requisitos: Node.js 20 o superior y npm.

```bash
npm install          # instalar dependencias
npm run start:dev    # modo desarrollo (recarga automática)
# o bien
npm run build        # compilar a dist/
npm run start:prod   # ejecutar node dist/main
```

Abrir http://localhost:3000. El puerto se puede cambiar con la variable `PORT` (`PORT=4000 npm run start:prod`).

Pruebas:

```bash
npm test             # pruebas unitarias
npm run test:e2e     # pruebas end-to-end
```

## Docker

### El Dockerfile

- **Etapa `build`** (`node:20-alpine`): `npm ci` + `npm run build` para compilar TypeScript.
- **Etapa `runtime`** (`node:20-alpine`): solo dependencias de producción (`npm ci --omit=dev`)
  y la carpeta `dist/`; corre con el usuario sin privilegios `node`, `EXPOSE 3000`,
  incluye un `HEALTHCHECK` contra `/health` y arranca con `node dist/main`.

### 1. Construir la imagen

```bash
docker build -t miapp-docker:v1 .
```

### 2. Ejecutar el contenedor

```bash
docker run -d -p 3000:3000 --name lab04 miapp-docker:v1
```

Abrir http://localhost:3000 o probar con curl:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl "http://localhost:3000/math/sum?a=2&b=3"
curl "http://localhost:3000/math/divide?a=1&b=0"
```

### 3. Comandos básicos de Docker

```bash
docker ps                 # contenedores en ejecución
docker ps -a              # todos los contenedores (incluye detenidos)
docker images             # imágenes locales
docker logs lab04         # logs del contenedor
docker logs -f lab04      # seguir los logs en tiempo real
docker exec -it lab04 sh  # abrir una shell dentro del contenedor
docker stop lab04         # detener el contenedor
docker start lab04        # volver a iniciarlo
docker rm lab04           # eliminar el contenedor (debe estar detenido)
docker rm -f lab04        # detener y eliminar en un solo paso
docker rmi miapp-docker:v1  # eliminar la imagen
```

### 4. Publicar en Docker Hub

Reemplazar `<tu-usuario>` por tu usuario de Docker Hub.

```bash
# Etiquetar la imagen con tu usuario
docker tag miapp-docker:v1 <tu-usuario>/miapp-docker:v1

# Iniciar sesión en Docker Hub
docker login

# Subir la imagen
docker push <tu-usuario>/miapp-docker:v1
```

### 5. Descargar y ejecutar desde Docker Hub

```bash
docker pull <tu-usuario>/miapp-docker:v1
docker run -d -p 3000:3000 --name lab04-hub <tu-usuario>/miapp-docker:v1
```

### Alternativa: Docker Compose

```bash
docker compose up -d --build   # construye y levanta el contenedor en el puerto 3000
docker compose logs -f
docker compose down
```

> Nota: `docker-compose.yml` usa el mismo nombre de contenedor (`lab04`); si ya hay uno
> corriendo con `docker run`, eliminarlo antes con `docker rm -f lab04`.
