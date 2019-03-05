FROM node:10.5-alpine as node
WORKDIR /home/node/app
COPY ./app/ /home/node/app/
RUN npm install && npm run build

FROM zephinzer/golang-dev:latest as development
COPY ./server /go/src/app
COPY --from=node /home/node/app/build /go/src/app
ENTRYPOINT [ "start" ]

FROM development as build
RUN build
ENTRYPOINT [ "/go/src/app/app" ]

FROM scratch as production
ENV PORT=4000
COPY --from=build /go/src/app/app /
COPY --from=build /go/src/app/static /static
COPY --from=build /go/src/app/index.html /index.html
COPY --from=build /go/src/app/asset-manifest.json /asset-manifest.json
COPY --from=build /go/src/app/manifest.json /manifest.json
COPY --from=build /go/src/app/service-worker.js /service-worker.js
EXPOSE 4000
ENTRYPOINT [ "/app" ]
