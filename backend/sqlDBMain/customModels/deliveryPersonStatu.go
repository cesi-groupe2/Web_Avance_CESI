package customModels

import (
	"math"
	"sort"
	"strconv"
)

type DeliveryPersonStatus struct {
	IDUser int    `json:"idUser" gorm:"primaryKey"`
	Status string `json:"status" gorm:"type:ENUM('available', 'busy', 'offline');default:'offline'"`
	Latitude float64 `json:"latitude" gorm:"type:float"`
	Longitude float64 `json:"longitude" gorm:"type:float"`
}

type Location struct {
	Latitude  float64 `json:"latitude" gorm:"type:float"`
	Longitude float64 `json:"longitude" gorm:"type:float"`
}

const StatusStart = "start"
const StatusAvailable = "available"
const StatusBusy = "busy"
const StatusOffline = "offline"

// TO DO : add on bdd
var currentUsersInWork = make(map[int]DeliveryPersonStatus)

func GetAllUsersInWork() map[int]DeliveryPersonStatus {
	return currentUsersInWork
}

func DeleteUserInWork(userId int) {
	// delete user in work
	delete(currentUsersInWork, userId)	
}

func AddUserInWork(deliveryPersonStatus DeliveryPersonStatus) {
	currentUsersInWork[deliveryPersonStatus.IDUser] = deliveryPersonStatus
}

func GetNearbyDeliveryPersons(latitude, longitude string) []DeliveryPersonStatus {
	// take all deliveryPerson by proximity
	currentUsersInWorkOrderArround := make([]DeliveryPersonStatus, 0)

	lat, err := strconv.ParseFloat(latitude, 64)
	if err != nil {
		return currentUsersInWorkOrderArround
	}
	lon, err := strconv.ParseFloat(longitude, 64)
	if err != nil {
		return currentUsersInWorkOrderArround
	}

	// Struct to hold a delivery person and its distance.
	type deliveryWithDistance struct {
		person   DeliveryPersonStatus
		distance float64
	}

	var personsWithDistance []deliveryWithDistance
	for _, person := range currentUsersInWork {
		diffLat := person.Latitude - lat
		diffLon := person.Longitude - lon
		// Using Euclidean distance (squared value is sufficient for comparison).
		distance := math.Sqrt(diffLat*diffLat + diffLon*diffLon)
		personsWithDistance = append(personsWithDistance, deliveryWithDistance{
			person:   person,
			distance: distance,
		})
	}

	// Sort persons by increasing distance.
	sort.Slice(personsWithDistance, func(i, j int) bool {
		return personsWithDistance[i].distance < personsWithDistance[j].distance
	})

	for _, entry := range personsWithDistance {
		currentUsersInWorkOrderArround = append(currentUsersInWorkOrderArround, entry.person)
	}

	return currentUsersInWorkOrderArround

}

