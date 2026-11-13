// Minimal local stand-in for the Supabase API gateway, for the ISOLATED test stack only.
// supabase-js calls <SUPABASE_URL>/rest/v1/...; PostgREST serves the same API at "/".
// This forwards /rest/v1/* to the local PostgREST and nothing else. It binds to loopback.
// Optional GATEWAY_DELAY_MS adds a fixed delay per database round trip so the cost of
// each round trip (measured in production at hundreds of milliseconds from distant
// regions) can be reproduced when comparing the legacy and single-round-trip code paths.
import http from "node:http";
const target=new URL(process.env.POSTGREST_URL||"http://127.0.0.1:3000");
if(!["127.0.0.1","localhost"].includes(target.hostname))throw Error("REFUSING: gateway only forwards to a local PostgREST");
const port=Number(process.env.GATEWAY_PORT||54320),delay=Number(process.env.GATEWAY_DELAY_MS||0);
const agent=new http.Agent({keepAlive:true,maxSockets:256});
let forwarded=0;
http.createServer((req,res)=>{
 if(req.url==="/__stats"){res.setHeader("content-type","application/json");return res.end(JSON.stringify({forwarded}))}
 if(!req.url.startsWith("/rest/v1/")){res.statusCode=404;return res.end('{"message":"isolated stack: only /rest/v1 is available"}')}
 forwarded++;
 const go=()=>{
  const upstream=http.request({host:target.hostname,port:target.port,method:req.method,path:req.url.slice("/rest/v1".length),headers:{...req.headers,host:target.host},agent},up=>{res.writeHead(up.statusCode,up.headers);up.pipe(res)});
  upstream.on("error",()=>{if(!res.headersSent)res.statusCode=502;res.end('{"message":"upstream unavailable"}')});
  req.pipe(upstream);
 };
 if(delay>0){req.pause();setTimeout(go,delay)}else go();
}).listen(port,"127.0.0.1",()=>console.log("isolated gateway on 127.0.0.1:"+port+" -> "+target.host+" delay_ms="+delay));
