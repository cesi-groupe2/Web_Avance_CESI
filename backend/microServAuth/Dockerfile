# step1: Compile app
FROM golang:1.24.1-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServAuth
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# step2: Build a small image
FROM scratch
COPY --from=builder /app/microServAuth/main /app/microServAuth/main
EXPOSE 8001
ENTRYPOINT ["/app/microServAuth/main"]