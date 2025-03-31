package mongoDBMain

import (
	"context"
	"demo/mongoModels"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	mongoClient, err := mongo.Connect(options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@%s:%s",
		"root",
		"root",
		"localhost",
		"27017")))
	if err != nil {
		log.Fatalf("new client error : %v", err)
		return
	}

	defer func() {
		cancel()
		if err := mongoClient.Disconnect(ctx); err != nil {
			log.Fatalf("mongodb disconnect error : %v", err)
		}
	}()

	if err != nil {
		log.Fatalf("connection error :%v", err)
		return
	}

	err = mongoClient.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatalf("ping mongodb error :%v", err)
		return
	}
	fmt.Println("ping success")

	createMongoDb(ctx, "localhost", "27017", "root", "root")

}

func createMongoDb(ctx context.Context, url string, port string, user string, password string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@%s:%s",
		user,
		password,
		url,
		port)))
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	fmt.Println("Connected to MongoDB successfully!")

	db := client.Database("easeat")
	ordersCollection := db.Collection("order")
	orderHistoryCollection := db.Collection("order_position_history")

	// Insertion d'un document exemple dans "Commande"
	order := bson.D{
		{"delivery_person_id", 101},
		{"customer_id", 202},
		{"restaurant_id", 303},
		{"items", bson.A{"Pizza", "Salade"}},
		{"created_at", time.Now()},
		{"delivery_at", time.Now().Add(30 * time.Minute)},
		{"status", mongoModels.OrderStatusAwaitingValidation},
	}
	_, err = ordersCollection.InsertOne(context.TODO(), order)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Commande insérée avec succès")

	// Insertion d'un document exemple dans "order_position_history"
	orderPosition := bson.D{
		{"order_id", 1},
		{"datetime", time.Now()},
		{"position", "Restaurant"},
	}
	_, err = orderHistoryCollection.InsertOne(context.TODO(), orderPosition)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Historique de position inséré avec succès")
}

func deleteOnMongoDb(sampleCollection *mongo.Collection, ctx context.Context) {
	// delete Many

	deleteManyResult, err := sampleCollection.DeleteMany(
		ctx,
		bson.D{
			bson.E{
				Key: "bank_money",
				Value: bson.D{
					bson.E{
						Key:   "$lt",
						Value: 1000,
					},
				},
			},
		},
	)
	if err != nil {
		log.Fatalf("delete many data error : %v", err)
		return
	}
	fmt.Println("===== delete many data modified count =====")
	fmt.Println(deleteManyResult.DeletedCount)
}

func updateOnMongoDb(sampleCollection *mongo.Collection, ctx context.Context) {
	updateManyFilter := bson.D{
		bson.E{
			Key:   "name",
			Value: "axel",
		},
	}

	updateSet := bson.D{
		bson.E{
			Key: "$set",
			Value: bson.D{
				bson.E{
					Key:   "bank_money",
					Value: 2000,
				},
			},
		},
	}
	// update
	updateManyResult, err := sampleCollection.UpdateMany(
		ctx,
		updateManyFilter,
		updateSet,
	)
	if err != nil {
		log.Fatalf("update error : %v", err)
		return
	}

	fmt.Println("========= updated modified count ===========")
	fmt.Println(updateManyResult.ModifiedCount)

	// check if updated with find solution
	checkedCursor, err := sampleCollection.Find(
		ctx,
		bson.D{
			bson.E{
				Key:   "name",
				Value: "axel",
			},
		},
	)
	if err != nil {
		log.Fatalf("check result error : %v", err)
		return
	}
	var checkedResult []bson.M
	err = checkedCursor.All(ctx, &checkedResult)
	if err != nil {
		log.Fatalf("get check information error : %v", err)
		return
	}
	fmt.Println("=========== checked updated result ==============")
	for _, checkedDoc := range checkedResult {
		fmt.Println(checkedDoc)
	}
	fmt.Println("===============================")
}

func querySpecificData(sampleCollection *mongo.Collection, ctx context.Context) {
	fmt.Println("=========== query specific data =====================")
	// query specific data
	filter := bson.D{
		bson.E{
			Key: "bank_money",
			Value: bson.D{
				bson.E{
					Key:   "$gt",
					Value: 900,
				},
			},
		},
	}

	filterCursor, err := sampleCollection.Find(
		ctx,
		filter,
	)
	if err != nil {
		log.Fatalf("filter query data error : %v", err)
		return
	}
	var filterResult []bson.M
	err = filterCursor.All(ctx, &filterResult)
	if err != nil {
		log.Fatalf("filter result %v", err)
		return
	}

	for _, filterDoc := range filterResult {
		fmt.Println(filterDoc)
	}
}

func insertData(sampleCollection *mongo.Collection, ctx context.Context) {
	// insert many data
	fmt.Println("=========== inserted many data ===============")
	insertedManyDocument := []interface{}{
		bson.M{
			"name":       "Andy",
			"content":    "new test content",
			"bank_money": 1500,
			"create_at":  time.Now().Add(36 * time.Hour),
		},
		bson.M{
			"name":       "Jack",
			"content":    "jack content",
			"bank_money": 800,
			"create_at":  time.Now().Add(12 * time.Hour),
		},
	}

	insertedManyResult, err := sampleCollection.InsertMany(ctx, insertedManyDocument)
	if err != nil {
		log.Fatalf("inserted many error : %v", err)
		return
	}

	for _, doc := range insertedManyResult.InsertedIDs {
		fmt.Println(doc)
	}
}
