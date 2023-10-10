package main

import (
	db "ImChat/src/DB"
	_ "ImChat/src/config"
	"fmt"
)

func main() {
	fmt.Println(db.DB)
}
