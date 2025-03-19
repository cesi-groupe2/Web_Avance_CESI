package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	mongoClient, err := mongo.Connect(
		ctx,
		options.Client().ApplyURI("mongodb://root:root@localhost:27017/"),
	)

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

	createMongoDb("localhost", "27017", "root", "root")	

}

func createMongoDb(url string, port string, user string, password string) {
    client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@%s:%s", user, password, url, port)))
    if err != nil {
        log.Fatal(err)
    }
    defer client.Disconnect(context.TODO())

    database := client.Database("easeat")

    ordersCollection := database.Collection("orders")
    orderHistoryCollection := database.Collection("order_history")
    deliveriesCollection := database.Collection("deliveries")

    order := bson.M{
        "id_user":       123,
        "id_restaurant": 45,
        "items": []bson.M{
            {"id_menu_item": 12, "quantity": 2, "price": 9.99},
            {"id_menu_item": 18, "quantity": 1, "price": 12.50},
        },
        "total_price":  32.48,
        "status":       "pending",
        "id_payment":   "TXN123456",
        "created_at":   time.Date(2025, 3, 11, 12, 0, 0, 0, time.UTC),
        "updated_at":   time.Date(2025, 3, 11, 12, 5, 0, 0, time.UTC),
    }
    _, err = ordersCollection.InsertOne(context.TODO(), order)
    if err != nil {
        log.Fatal(err)
    }

    orderHistory := bson.M{
        "id_user":       123,
        "id_restaurant": 45,
        "items": []bson.M{
            {"id_menu_item": 12, "quantity": 2, "price": 9.99},
        },
        "total_price":    19.98,
        "status":        "completed",
        "created_at":    time.Date(2025, 3, 10, 19, 0, 0, 0, time.UTC),
        "completed_at":  time.Date(2025, 3, 10, 19, 30, 0, 0, time.UTC),
        "delivery_time": 30,
        "payment_method": "Stripe",
        "feedback": bson.M{
            "rating":  5,
            "comment": "Livraison rapide, super burger !",
        },
    }
    _, err = orderHistoryCollection.InsertOne(context.TODO(), orderHistory)
    if err != nil {
        log.Fatal(err)
    }

    delivery := bson.M{
        "id_order":        primitive.NewObjectID(),
        "id_livreur":      87,
        "status":         "on the way",
        "current_location": bson.M{"lat": 48.8566, "lng": 2.3522},
        "estimated_arrival": time.Date(2025, 3, 11, 12, 30, 0, 0, time.UTC),
        "created_at":        time.Date(2025, 3, 11, 12, 10, 0, 0, time.UTC),
        "updated_at":        time.Date(2025, 3, 11, 12, 20, 0, 0, time.UTC),
    }
    _, err = deliveriesCollection.InsertOne(context.TODO(), delivery)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Données insérées avec succès dans MongoDB")
}

func createExampleCollection(mongoClient *mongo.Client, ctx context.Context) {
		// database and collection
	database := mongoClient.Database("demo")
	sampleCollection := database.Collection("sampleCollection")
	sampleCollection.Drop(ctx)
}

func insertExempleData(sampleCollection *mongo.Collection, ctx context.Context) {
	// insert one
	insertedDocument := bson.M{
		"name":       "axel",
		"content":    "test content",
		"bank_money": 1000,
		"create_at":  time.Now(),
	}
	insertedResult, err := sampleCollection.InsertOne(ctx, insertedDocument)

	if err != nil {
		log.Fatalf("inserted error : %v", err)
		return
	}
	fmt.Println("======= inserted id ================")
	log.Printf("inserted ID is : %v", insertedResult.InsertedID)

	// query all data
	fmt.Println("== query all data ==")
	cursor, err := sampleCollection.Find(ctx, options.Find())
	if err != nil {
		log.Fatalf("find collection err : %v", err)
		return
	}
	var queryResult []bson.M
	if err := cursor.All(ctx, &queryResult); err != nil {
		log.Fatalf("query mongodb result")
		return
	}

	for _, doc := range queryResult {
		fmt.Println(doc)
	}
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
