package utils

import (
	"os"
	"testing"
)

func TestGetEnvValueOrDefaultStr(t *testing.T) {
	const envKey = "TEST_ENV_KEY"

	// Test when the environment variable is not set.
	os.Unsetenv(envKey)
	defaultValue := "default"
	got := GetEnvValueOrDefaultStr(envKey, defaultValue)
	if got != defaultValue {
		t.Errorf("Expected default %q, got %q", defaultValue, got)
	}

	// Test when the environment variable is set.
	expected := "value"
	os.Setenv(envKey, expected)
	got = GetEnvValueOrDefaultStr(envKey, defaultValue)
	if got != expected {
		t.Errorf("Expected %q, got %q", expected, got)
	}

	// test when the environment variable not exist
	got = GetEnvValueOrDefaultStr("fake", "")
	if got != "" {
		t.Errorf("Expected %q, got %q", "", got)
	}

	// Clean up the environment.
	os.Unsetenv(envKey)
}
