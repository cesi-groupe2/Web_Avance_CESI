FROM golang:1.24.1-alpine3.21 AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServPayment
RUN go mod tidy && go build -o payment-service
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/microServPayment/main /app/microServPayment/main
EXPOSE 8006
ENTRYPOINT ["/app/microServPayment/main"]
