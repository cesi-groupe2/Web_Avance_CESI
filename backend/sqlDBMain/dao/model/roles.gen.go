// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package model

const TableNameRole = "roles"

// Role mapped from table <roles>
type Role struct {
	IDRole int32  `gorm:"column:id_role;primaryKey;autoIncrement:true" json:"id_role"`
	Name   string `gorm:"column:name;not null" json:"name"`
}

// TableName Role's table name
func (*Role) TableName() string {
	return TableNameRole
}
