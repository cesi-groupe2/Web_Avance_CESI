FROM golang:1.24.1-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServOrder
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# step2: Build a small image
FROM scratch
COPY --from=builder /app/microServOrder/main /app/microServOrder/main
EXPOSE 8002
ENTRYPOINT ["/app/microServOrder/main"]
