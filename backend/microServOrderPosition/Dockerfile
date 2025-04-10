FROM golang:1.24.1-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/microServOrderPosition
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch
COPY --from=builder /app/microServOrderPosition/main /app/microServOrderPosition/main
EXPOSE 8004
ENTRYPOINT ["/app/microServOrderPosition/main"]
