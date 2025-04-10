// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package model

import (
	"time"
)

const TableNameUser = "users"

// User mapped from table <users>
type User struct {
	IDUser            int32     `gorm:"column:id_user;primaryKey;autoIncrement:true" json:"id_user"`
	Email             string    `gorm:"column:email;not null" json:"email"`
	PasswordHash      string    `gorm:"column:password_hash;not null" json:"password_hash"`
	ProfilPicture     []byte    `gorm:"column:profil_picture" json:"profil_picture"`
	FirstName         string    `gorm:"column:first_name" json:"first_name"`
	LastName          string    `gorm:"column:last_name" json:"last_name"`
	Phone             string    `gorm:"column:phone" json:"phone"`
	CreatedAt         time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	DeliveryAdress    string    `gorm:"column:delivery_adress" json:"delivery_adress"`
	FacturationAdress string    `gorm:"column:facturation_adress" json:"facturation_adress"`
	IDRole            int32     `gorm:"column:id_role" json:"id_role"`
	SponsorshipCode   string    `gorm:"column:sponsorship_code" json:"sponsorship_code"`
	AlreadySponsored  bool      `gorm:"column:already_sponsored" json:"already_sponsored"`
}

// TableName User's table name
func (*User) TableName() string {
	return TableNameUser
}
