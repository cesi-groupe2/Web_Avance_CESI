// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package model

import (
	"time"
)

const TableNameMenuitem = "menuitems"

// Menuitem mapped from table <menuitems>
type Menuitem struct {
	IDMenuItem   int32     `gorm:"column:id_menu_item;primaryKey;autoIncrement:true" json:"id_menu_item"`
	Name         string    `gorm:"column:name;not null" json:"name"`
	Description  string    `gorm:"column:description" json:"description"`
	Price        float64   `gorm:"column:price;not null" json:"price"`
	Image        string    `gorm:"column:image" json:"image"`
	CreatedAt    time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP" json:"created_at"`
	IDRestaurant int32     `gorm:"column:id_restaurant;not null" json:"id_restaurant"`
}

func (*Menuitem) TableName() string {
	return TableNameMenuitem
}
