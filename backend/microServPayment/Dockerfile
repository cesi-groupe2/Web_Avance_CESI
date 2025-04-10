FROM golang:1.24.1-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServPayment
RUN go mod tidy && go build -o payment-service
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/microServPayment/main /app/microServPayment/main
EXPOSE 8008
ENTRYPOINT ["/app/microServPayment/main"]