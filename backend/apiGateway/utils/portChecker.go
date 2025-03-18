package utils

import (
	"fmt"
	"net"
	"strconv"
)

func isPortAvailable(port int) bool {
	// Try to listen on the port
	ln, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return false
	}
	ln.Close()
	return true
}

func GetAvailablePort(startPort string) (string, error) {
	// Convert startPort to int
	port, err := strconv.Atoi(startPort)
	if err != nil {
		return "", err
	}
	for {
		if isPortAvailable(port) {
			return strconv.Itoa(port), nil
		}
		port++
	}
}


