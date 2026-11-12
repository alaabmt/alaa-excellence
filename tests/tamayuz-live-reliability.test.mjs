import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const html=readFileSync("live/index.html","utf8");
const backend=readFileSync("live/backend/index.ts","utf8");

test("every Live session list labels closed as Voting closed, not Waiting",()=>{
  const statusLines=html.split("\n").filter(x=>x.includes("const status=s.state==="));
  assert.equal(statusLines.length,3,"All three owner, management and presenter session list status renderers");
  for(const line of statusLines){
    assert.match(line,/s\.state==="closed"\?t\("Voting closed","التصويت مغلق"\)/);
    assert.match(line,/s\.state==="ended"\?t\("Ended","منتهية"\)/);
  }
});

test("owner presentation-list database errors cannot masquerade as an empty library",()=>{
  const start=backend.indexOf('if(action==="list"){');
  const end=backend.indexOf('if(action==="review_results"){',start);
  assert(start>=0&&end>start);
  const section=backend.slice(start,end);
  assert.match(section,/await owner\(req\)/);
  assert.match(section,/const \{data,error\}=await db\.from\("live_presentations"\)/);
  assert.match(section,/if\(error\)return reply\(\{error:"Could not list presentations"\},500\)/);
});
