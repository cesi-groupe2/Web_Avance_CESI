package utils

import "os"

func GetEnvValueOrDefaultStr(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}




