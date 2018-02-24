package Router

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "net/http"
    "io/ioutil"
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
        wxlogin := SelfType.NewWXLogin(c.Query("code"))
        getWXOpenId(&wxlogin)
        c.JSON(200,gin.H{
            "message": "ok",
            "session": "self_session",
        })
    })
}

//request for wxopenid 
func getWXOpenId(jsondata *SelfType.WXLogin) {
    res, err := http.Get("https://api.weixin.qq.com/sns/jscode2session?appid="+jsondata.Appid+
        "&secret="+jsondata.Secret+"&js_code="+jsondata.Js_code+"&grant_type="+jsondata.Grant_type)
    if(err != nil){
        panic(err)
    }
    body, err := ioutil.ReadAll(res.Body)
    fmt.Printf("resp status %s,statusCode %d\n", res.Status, res.StatusCode)
    fmt.Println(string(body))
}