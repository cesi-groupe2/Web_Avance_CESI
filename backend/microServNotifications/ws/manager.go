package ws

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/constants"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/apiGateway/utils"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/microServBase/middlewares/jwtActions"
	"github.com/cesi-groupe2/Web_Avance_CESI/backend/sqlDB/dao/model"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type UserConn struct {
	User model.User
	Conn  *websocket.Conn
}

var (
	users = make(map[int]*UserConn)
	mu sync.Mutex
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var (
	apiGtwAdd = utils.GetEnvValueOrDefaultStr(constants.API_GATEWAY_ADDR_ENV, "localhost")
	apiGtwPort = utils.GetEnvValueOrDefaultStr(constants.API_GATEWAY_PORT_ENV, "8080")
)

// HandleWsForRestaurant godoc
//	@Summary		Handle WebSocket connection for restaurant notifications
//	@Description	Handle WebSocket connection for restaurant notifications
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string	true	"User ID"
//	@Success		200	{object}	model.User
//	@Failure		400	{object}	string
//	@Failure		500	{object}	string
//	@Router			/notifications/restaurant/connectWs [get]
func HandleWsForRestaurant(c *gin.Context) {
	userId, err := jwtActions.GetUserIdFromToken(c)
	if err != nil {
		log.Println("Error getting user ID from token:", err)
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	// Upgrade the connection to a WebSocket connection
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		c.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}

	// Create a new UserConn instance
	user, err := GetUserFromMicroServ(userId, c.Request.Header.Get("Authorization"))
	if err != nil {
		log.Println("Error getting user from microservice:", err)
		c.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}
	userConn := &UserConn{
		User: *user,
		Conn: conn,
	}
	// Store the user connection in the map
	mu.Lock()
	users[userId] = userConn
	mu.Unlock()
	log.Printf("User %d connected to WebSocket for restaurant notifications\n", userId)
	
	defer func() {
		conn.Close()
		mu.Lock()
		delete(users, userId)
		mu.Unlock()
		log.Printf("User %d disconnected from WebSocket for restaurant notifications\n", userId)
	}()
	
	// Listen for messages from the WebSocket connection
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}
		log.Printf("Received message from user %d: %s\n", userId, msg)
	}
}

// NotifyRestaurant godoc
//	@Summary		Notify restaurant owner
//	@Description	Notify restaurant owner
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			idRestaurant	path		string	true	"Restaurant ID"
//	@Success		200				{object}	string
//	@Failure		400				{object}	string
//	@Failure		500				{object}	string
//	@Router			/notifications/restaurant/{idRestaurant}/notify [post]
func NotifyRestaurant(ctx *gin.Context) {
	restaurantId := ctx.Param("idRestaurant")

	proprio, err := GetProprioByRestaurantId(restaurantId, ctx.Request.Header.Get("Authorization"))
	if err != nil {
		log.Println("Error getting restaurant owner:", err)
		ctx.JSON(404, gin.H{"error": "Restaurant owner not found"})
		return
	}

	// Check if the user is connected
	mu.Lock()
	userConn, ok := users[int(proprio.IDUser)]
	mu.Unlock()
	if !ok {
		log.Printf("User %d is not connected\n", proprio.IDUser)
		ctx.JSON(404, gin.H{"error": "User not connected"})
		return
	}
	// Send a notification message to the user
	err = userConn.Conn.WriteMessage(websocket.TextMessage, []byte("Notification for restaurant "+restaurantId))
	if err != nil {
		log.Println("Error sending message:", err)
		ctx.JSON(500, gin.H{"error": "Internal Server Error"})
		return
	}
	log.Printf("Notification sent to user %d for restaurant %s\n", proprio.IDUser, restaurantId)
	ctx.JSON(200, gin.H{"message": "Notification sent"})
}

// HandleWsForDeliveryPerson godoc
//	@Summary		Handle WebSocket connection for delivery person notifications
//	@Description	Handle WebSocket connection for delivery person notifications
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string	true	"User ID"
//	@Success		200	{object}	model.User
//	@Failure		400	{object}	string
//	@Failure		500	{object}	string
//	@Router			/notifications/deliveryPerson/connectWs [get]
func HandleWsForDeliveryPerson(c *gin.Context) {
	userId, err := jwtActions.GetUserIdFromToken(c)
	if err != nil {
		log.Println("Error getting user ID from token:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	user, err := GetUserFromMicroServ(userId, c.Request.Header.Get("Authorization"))
	if err != nil {
		log.Println("Error getting user from microservice:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	userConn := &UserConn{
		User: *user,
		Conn: conn,
	}
	mu.Lock()
	users[userId] = userConn
	mu.Unlock()
	log.Printf("User %d connected to WebSocket for delivery person notifications\n", userId)

	defer func() {
		conn.Close()
		mu.Lock()
		delete(users, userId)
		mu.Unlock()
		log.Printf("User %d disconnected from WebSocket for delivery person notifications\n", userId)
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}
		log.Printf("Received message from user %d: %s\n", userId, msg)
	}
}

// NotifyDeliveryPerson godoc
//	@Summary		Notify delivery person
//	@Description	Notify delivery person
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			idDeliveryPerson	path		string	true	"Delivery Person ID"
//	@Success		200					{object}	string
//	@Failure		400					{object}	string
//	@Failure		500					{object}	string
//	@Router			/notifications/deliveryPerson/{idDeliveryPerson}/notify [get]
func NotifyDeliveryPerson(ctx *gin.Context) {
	idStr := ctx.Param("idDeliveryPerson")
	deliveryPersonID, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("Invalid delivery person ID:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid delivery person ID"})
		return
	}

	mu.Lock()
	userConn, ok := users[deliveryPersonID]
	mu.Unlock()
	if !ok {
		log.Printf("Delivery person %d is not connected\n", deliveryPersonID)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Delivery person not connected"})
		return
	}

	err = userConn.Conn.WriteMessage(websocket.TextMessage, []byte("Notification for delivery person "+idStr))
	if err != nil {
		log.Println("Error sending message:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	log.Printf("Notification sent to delivery person %d\n", deliveryPersonID)
	ctx.JSON(http.StatusOK, gin.H{"message": "Notification sent"})
}

// HandleWsForClient godoc
//	@Summary		Handle WebSocket connection for client notifications
//	@Description	Handle WebSocket connection for client notifications
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			id	path		string	true	"User ID"
//	@Success		200	{object}	model.User
//	@Failure		400	{object}	string
//	@Failure		500	{object}	string
//	@Router			/notifications/client/connectWs [get]
func HandleWsForClient(c *gin.Context) {
	userId, err := jwtActions.GetUserIdFromToken(c)
	if err != nil {
		log.Println("Error getting user ID from token:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	user, err := GetUserFromMicroServ(userId, c.Request.Header.Get("Authorization"))
	if err != nil {
		log.Println("Error getting user from microservice:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	userConn := &UserConn{
		User: *user,
		Conn: conn,
	}
	mu.Lock()
	users[userId] = userConn
	mu.Unlock()
	log.Printf("User %d connected to WebSocket for client notifications\n", userId)

	defer func() {
		conn.Close()
		mu.Lock()
		delete(users, userId)
		mu.Unlock()
		log.Printf("User %d disconnected from WebSocket for client notifications\n", userId)
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}
		log.Printf("Received message from user %d: %s\n", userId, msg)
	}
}

// NotifyClient godoc
//	@Summary		Notify client
//	@Description	Notify client
//	@Tags			notifications
//	@Accept			json
//	@Produce		json
//	@Security		BearerAuth
//	@Param			idClient	path		string	true	"Client ID"
//	@Success		200			{object}	string
//	@Failure		400			{object}	string
//	@Failure		500			{object}	string
//	@Router			/notifications/client/{idClient}/notify [get]
func NotifyClient(ctx *gin.Context) {
	idStr := ctx.Param("idClient")
	clientID, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("Invalid client ID:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	mu.Lock()
	userConn, ok := users[clientID]
	mu.Unlock()
	if !ok {
		log.Printf("Client %d is not connected\n", clientID)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Client not connected"})
		return
	}

	err = userConn.Conn.WriteMessage(websocket.TextMessage, []byte("Notification for client "+idStr))
	if err != nil {
		log.Println("Error sending message:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	log.Printf("Notification sent to client %d\n", clientID)
	ctx.JSON(http.StatusOK, gin.H{"message": "Notification sent"})
}

func GetProprioByRestaurantId(restaurantId string, token string) (*model.User, error) {
		// Call microservice restaurant to get restaurant
	addr := fmt.Sprintf("%s:%s/restaurant/%s/proprio", apiGtwAdd, apiGtwPort, restaurantId)
	req, err := http.NewRequest("GET", addr, nil)
	if err != nil {
		log.Println("Error creating request:", err)
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer " + token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error making request to restaurant service:", err)
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		log.Println("Error getting restaurant from restaurant service:", resp.Status)
		return nil, err
	}
	var user model.User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		log.Println("Error decoding restaurant response:", err)
		return nil, err
	}
	return &user, nil
}


func GetUserFromMicroServ(userId int, token string) (*model.User, error) {
	// request user service to get user (add token in header)
	addr := fmt.Sprintf("%s:%s/users/%s", apiGtwAdd, apiGtwPort, userId)
	req, err := http.NewRequest("GET", addr, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer " + token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error making request to user service:", err)
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		log.Println("Error getting user from user service:", resp.Status)
		return nil, fmt.Errorf("error getting user from user service: %s", resp.Status)
	}
	var user model.User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		log.Println("Error decoding user response:", err)
		return nil, err
	}
	return &user, nil
}