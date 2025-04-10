FROM golang:1.24.2-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServNotifications
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/microServNotifications/main /app/microServNotifications/main
EXPOSE 8007
ENTRYPOINT ["/app/microServNotifications/main"]
