FROM node:alpine
WORKDIR '/app'
COPY package.json .
COPY . .
RUN yarn
RUN yarn build
EXPOSE 8000
CMD ["node", "dist/index.js"]