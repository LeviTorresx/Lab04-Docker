# syntax=docker/dockerfile:1

# ---------- Etapa 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Instalar todas las dependencias (incluye devDependencies para compilar)
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y compilar TypeScript -> dist/
COPY . .
RUN npm run build

# ---------- Etapa 2: runtime ----------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

# Solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Solo el código compilado
COPY --from=build /app/dist ./dist

# Ejecutar como usuario sin privilegios
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "dist/main"]
