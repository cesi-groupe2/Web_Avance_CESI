FROM golang:1.24.1-alpine3.21 AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServRestaurant
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/microServRestaurant/main /app/microServRestaurant/main
EXPOSE 8004
ENTRYPOINT ["/app/microServRestaurant/main"]
