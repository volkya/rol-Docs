FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p src/public/uploads

EXPOSE 2000

CMD ["npm", "start"]
