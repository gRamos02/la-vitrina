# Etapa de build
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa final
FROM node:20
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Crear carpeta uploads y establecer permisos
RUN mkdir -p uploads && chmod 755 uploads

RUN npm install --omit=dev
CMD ["node", "dist/index.js"]
