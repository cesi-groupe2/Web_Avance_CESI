FROM golang:1.24.2-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServPayment
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/microServPayment/main /app/microServPayment/main
EXPOSE 8008
ENTRYPOINT ["/app/microServPayment/main"]
