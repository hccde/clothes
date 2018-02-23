package Router

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "net/http"
    "src/SelfType"
)
//init router
func Init(r *gin.Engine){
    r.GET("/test",func(c *gin.Context){
        c.JSON(200,gin.H{
            "message": "ok",
        })
    });

    r.GET("/api/wxlogin",func(c *gin.Context) {
        wxlogin := SelfType.NewWXLogin("haha");
        fmt.Println(wxlogin.Appid+"\n");
        c.JSON(200,gin.H{
            "message": "ok",
        })
    })
}

//request for wxopenid 
func getWXOpenId() {
    res, err := http.Get("https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code")
    if(err == nil){
        fmt.Println("hello");
    }
    fmt.Printf("resp status %s,statusCode %d\n", res.Status, res.StatusCode)
}