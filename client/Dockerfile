FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn 
RUN yarn build
ENV NODE_ENV production
EXPOSE 3000
CMD [ "npx", "serve", "build" ]