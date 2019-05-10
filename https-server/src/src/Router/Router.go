package Router

import (
    "fmt"
    "github.com/gin-gonic/gin"
    "net/http"
    "io/ioutil"
    "src/SelfType"
    "src/Model"
    "strconv"
)
func init() {
}
//init router
func Init(r *gin.Engine){

    r.GET("/api/test",func(c *gin.Context){
        c.JSON(200,gin.H{
            "message": "ok",
        })
    })

    r.GET("/api/wxlogin",func(c *gin.Context) {
        wxlogin := SelfType.NewWXLogin(c.Query("code"))
        getWXOpenId(&wxlogin)
        c.JSON(200,gin.H{
            "message": "ok",
            "session": "self_session",
        })
    })

    r.GET("/api/list",func(c *gin.Context) {
        page,_:= strconv.Atoi(c.DefaultQuery("currentPage","1"))
        limit,_ := strconv.Atoi(c.DefaultQuery("pageSize","20"))
        res := Model.GetList(page,limit) 
        c.JSON(200,gin.H{
            "data":*res,
        })
    })

    r.GET("/api/search",func(c *gin.Context) {
        key:= c.DefaultQuery("key","衣")
        page,_:= strconv.Atoi(c.DefaultQuery("currentPage","1"))
        limit,_ := strconv.Atoi(c.DefaultQuery("pageSize","20"))
        res := Model.GetListByWord(key,page,limit) 
        c.JSON(200,gin.H{
            "data":*res,
        })
    })

    r.GET("/api/getshop",func(c *gin.Context) {
        key:= c.DefaultQuery("shop","hm")
        page,_:= strconv.Atoi(c.DefaultQuery("currentPage","1"))
        limit,_ := strconv.Atoi(c.DefaultQuery("pageSize","20"))
        res := Model.GetListByShop(key,page,limit) 
        c.JSON(200,gin.H{
            "data":*res,
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
