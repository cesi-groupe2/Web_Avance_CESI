FROM golang:1.24.1-alpine3.21 AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServUsers
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/microServUsers/main /app/microServUsers/main
EXPOSE 8005
ENTRYPOINT ["/app/microServUsers/main"]
