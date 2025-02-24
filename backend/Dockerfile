# Usar Node.js como base
FROM node:18

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos del backend
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Exponer el puerto del backend
EXPOSE 5000

# Iniciar la aplicación
CMD ["node", "index.js"]
