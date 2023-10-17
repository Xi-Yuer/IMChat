package models

import "time"

type BaseModel struct {
	ID        string     `json:"id" gorm:"primaryKey;type:char(36)"`
	CreatedAt time.Time  `json:"createAt"`
	UpdatedAt time.Time  `json:"updateAt"`
	DeletedAt *time.Time `json:"deleteAt" gorm:"index"`
}
