FROM node:latest AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:latest AS runner

ENV HUSKY=0

WORKDIR /app

COPY --from=builder /app/package.json ./

COPY --from=builder /app/package-lock.json ./

RUN npm install --omit=dev --ignore-scripts

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
