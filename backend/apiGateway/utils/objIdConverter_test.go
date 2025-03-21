package utils_test

import (
	"testing"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
)

func TestOrderIdParamToObjId_Valid(t *testing.T) {
	// A sample valid ObjectID hex string.
	validHex := "507f1f77bcf86cd799439011"

	objID, err := utils.OrderIdParamToObjId(validHex)
	if err != nil {
		t.Fatalf("Expected no error for valid hex; got: %v", err)
	}

	// Verify that the returned ObjectID's hex representation matches the input.
	if objID.Hex() != validHex {
		t.Errorf("Expected ObjectID hex %q, got %q", validHex, objID.Hex())
	}
}

func TestOrderIdParamToObjId_Invalid(t *testing.T) {
	// Pass an invalid hex string.
	invalidHex := "invalidHex"

	_, err := utils.OrderIdParamToObjId(invalidHex)
	if err == nil {
		t.Fatal("Expected an error for invalid hex, but got none")
	}
}
