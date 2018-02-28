package Model

import (
    "time"
    "github.com/jinzhu/gorm"
    _ "github.com/go-sql-driver/mysql"
)

var db *gorm.DB
//model
type Mains struct {
    Id string `gorm:"type:varchar(255);primary_key"`
    Href string `gorm:"type:text"`
    Name string `gorm:"type:text"`
    Img string `gorm:"type:text"`
    Price float32 `gorm:"type:float"`
    Sale int32 `gorm:"type:int(11)"`
    Desc string `gorm:"type:text"`
    History string `gorm:"type:text"`
    Yestdayprice float32 `gorm:"type:float"`
    Pricechange float32 `gorm:"type:float"`
    updateAt int32 `gorm:"type:bigint(20)"`
    CreatedAt time.Time
    UpdatedAt time.Time
}

type Pricechanges struct {
    Id string `gorm:"type:varchar(255);primary_key"`
    Href string `gorm:"type:text"`
    Name string `gorm:"type:text"`
    Img string `gorm:"type:text"`
    Price float32 `gorm:"type:float"`
    Sale int32 `gorm:"type:int(11)"`
    Desc string `gorm:"type:text"`
    History string `gorm:"type:text"`
    Yestdayprice float32 `gorm:"type:float"`
    Pricechange float32 `gorm:"type:float"`
    Isvaild int32 `gorm:"type:int(11)"`
    updateAt int32 `gorm:"type:bigint(20)"`
    CreatedAt time.Time
    UpdatedAt time.Time
}

func init(){
    db = connect()
}

func connect() *gorm.DB {
    db, err := gorm.Open("mysql", "root:123456@/clothes?charset=utf8&parseTime=True&loc=Local")
    if(err != nil){
        panic(err);
    }
    return db
}

func GetList(page int, limit int) *[]Pricechanges {
    var pricechanges []Pricechanges
    db.Not("pricechange",0).Offset(page*limit).Limit(limit).Find(&pricechanges)
    return &pricechanges
}

