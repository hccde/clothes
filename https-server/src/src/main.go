package main

import (
    "github.com/gin-gonic/gin"
    "src/Router"
)

func main() {
    r := gin.Default()
    Router.Init(r);
    r.Run(":4000")
}