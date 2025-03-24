package database

import (
	"database/sql"
	"fmt"

	_ "github.com/denisenkom/go-mssqldb"
)

var DB *sql.DB

func InitDB() {
	var err error
	connectionString := "server=localhost;user id=your_user;password=your_password;database=your_db"

	DB, err = sql.Open("sqlserver", connectionString)
	if err != nil {
		panic(fmt.Sprintf("Cannot connect to DB: %v", err))
	}

	if err = DB.Ping(); err != nil {
		panic(fmt.Sprintf("Cannot ping DB: %v", err))
	}

	fmt.Println("Connected to SQL Server successfully!")
}
