const http = require('http');
const fs = require('fs');
var requests=require('requests');

const homeFile = fs.readFileSync('home.html','utf-8');

const replaceval = (tempval,orgval) =>{
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp)
    temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min)
    temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max)
    temperature=temperature.replace("{%location%}",orgval.name)
    temperature=temperature.replace("{%country%}",orgval.sys.country)
    temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main)
    return temperature;
}

const server = http.createServer((req,res) => {
    if(req.url=='/'){
        requests("http://api.openweathermap.org/data/2.5/weather?q=pune&appid=286bdbadec18078fc1212d3dd9752f65")
        .on("data", (chunk) => {
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
         
           const realTimeData = arrData.map(val => replaceval(homeFile,val)).join("");
          res.write(realTimeData);
           console.log(realTimeData);
        })
        .on("end",(err) => {
            if(err) return console.log('Connection is closed due to error',err);
            res.end();
        });    
    }
});
server.listen(2000,'127.0.0.1');