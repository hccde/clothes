package SelfType

import(
    // "encoding/json"
    "io/ioutil"
    "fmt"
)

var wetchatinfo wetchatInfo

// func init(){
//     jsonbuf := readJson("../_wetchat.json")
//     //release ptr
//     err := json.Unmarshal(jsonbuf, &wetchatinfo)
//     if(err != nil){
//         panic(err)
//     }

// }

type wetchatInfo struct {
    Appid string `json:"appid"`
    Secret string `json:"secret"`
}

func readJson(name string) []byte {
    data, err := ioutil.ReadFile(name)
    if(err != nil){
        panic(err)
    }
    return data
}


type WXLogin struct {
    Appid string
    Secret string
    Js_code string
    Grant_type string
}

func NewWXLogin(code string) WXLogin {
    fmt.Println(wetchatinfo.Appid)
    return WXLogin{
        Appid:wetchatinfo.Appid,
        Secret:wetchatinfo.Secret,
        Js_code:code,
        Grant_type:"authorization_code",
    }
}
