FROM golang:1.24-alpine

WORKDIR /app

COPY ./microServNotifications /app/microServNotifications
COPY ./microServBase /app/microServBase
COPY ./apiGateway /app/apiGateway
COPY ./mongoDBMain /app/mongoDBMain

WORKDIR /app/microServNotifications

RUN go mod tidy && \
    go build -o notificationsapp .

EXPOSE 8006

CMD ["./notificationsapp"] 