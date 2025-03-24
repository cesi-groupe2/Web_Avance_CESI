package userService

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func GetUser(c *gin.Context, dbclient *mongo.Client) {
	// get all users
	users, err := dbclient.Database("demo").Collection("sampleCollection").Find(c, bson.M{})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, users)

}
