package utils

import (
	"io"

	"github.com/gin-gonic/gin"
)

func PictureFromForm(ctx *gin.Context, formFileName string) ([]byte, error) {
	file, err := ctx.FormFile(formFileName)
	if err != nil {
		return nil, err
	}

	openedFile, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer openedFile.Close()
	picture, err := io.ReadAll(openedFile)
	if err != nil {
		return nil, err
	}

	return picture, nil
}
