FROM node:22.14.0-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN yarn install --production

RUN yarn build

FROM node:22.14.0-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/.env ./.env

COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/tsconfig.build.json ./tsconfig.build.json

EXPOSE 3001

# Command to run the application
CMD yarn db-migration:run && node dist/main