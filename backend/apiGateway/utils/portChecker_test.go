package utils

import (
	"net"
	"strconv"
	"testing"
)

func TestIsPortAvailable_FreePort(t *testing.T) {
	// Listen on an ephemeral port and then close it to ensure it's free.
	ln, err := net.Listen("tcp", ":0")
	if err != nil {
		t.Fatalf("Failed to listen on an ephemeral port: %v", err)
	}
	addr := ln.Addr().(*net.TCPAddr)
	port := addr.Port
	ln.Close()

	// The port should be available now.
	if !isPortAvailable(port) {
		t.Errorf("Expected port %d to be available", port)
	}
}

func TestIsPortAvailable_BusyPort(t *testing.T) {
	// Listen on an ephemeral port and keep the listener open.
	ln, err := net.Listen("tcp", ":0")
	if err != nil {
		t.Fatalf("Failed to listen on an ephemeral port: %v", err)
	}
	defer ln.Close()
	addr := ln.Addr().(*net.TCPAddr)
	port := addr.Port

	// The port should be unavailable since it's currently in use.
	if isPortAvailable(port) {
		t.Errorf("Expected port %d to be unavailable", port)
	}
}
func TestGetAvailablePort_InvalidInput(t *testing.T) {
	_, err := GetAvailablePort("invalid")
	if err == nil {
		t.Error("expected error for non-numeric startPort, got nil")
	}
}

func TestGetAvailablePort_AvailableStart(t *testing.T) {
	// Use a port that is likely free.
	portStr, err := GetAvailablePort("5000")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	numPort, err := strconv.Atoi(portStr)
	if err != nil {
		t.Fatalf("returned port %q is not a valid number: %v", portStr, err)
	}
	if !isPortAvailable(numPort) {
		t.Errorf("returned port %d is not available", numPort)
	}
}

func TestGetAvailablePort_BusyStart(t *testing.T) {
	// Open a listener on an ephemeral port to ensure it's busy.
	ln, err := net.Listen("tcp", ":0")
	if err != nil {
		t.Fatalf("failed to listen on an ephemeral port: %v", err)
	}
	busyPort := ln.Addr().(*net.TCPAddr).Port
	defer ln.Close()

	// Start from the busy port, so GetAvailablePort should skip it.
	portStr, err := GetAvailablePort(strconv.Itoa(busyPort))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if portStr == strconv.Itoa(busyPort) {
		t.Errorf("GetAvailablePort returned the busy port %s", portStr)
	}

	numPort, err := strconv.Atoi(portStr)
	if err != nil {
		t.Fatalf("returned port %q is not a valid number: %v", portStr, err)
	}
	if !isPortAvailable(numPort) {
		t.Errorf("returned port %d is not available", numPort)
	}
}