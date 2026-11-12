import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {join} from "node:path";

const root="automation/plugins/tamayuz-live-guardian";
const plugin=JSON.parse(readFileSync(join(root,"plugin.json"),"utf8"));
test("private plugin manifest and five skill files are valid",()=>{
 assert.equal(plugin.$schema,"https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
 assert.equal(plugin.name,"tamayuz-live-guardian");
 assert.match(plugin.version,/^\d+\.\d+\.\d+$/);
 assert.ok(plugin.extensions["com.openai"].interface.shortDescription.length<=30);
 for(const name of ["tamayuz-live-guardian","tamayuz-live-frontend","tamayuz-live-backend","tamayuz-live-security","tamayuz-live-testing"]){
  const file=join(root,"skills",name,"SKILL.md");
  assert.ok(existsSync(file),file);
  const text=readFileSync(file,"utf8");
  assert.ok(text.startsWith("---\n"));
  assert.match(text,new RegExp("\\nname: "+name+"\\n"));
  assert.match(text,/\ndescription: .+/);
 }
});
test("owner-facing maintenance guidance and security release gates exist",()=>{
 const instructions=readFileSync("live/AGENTS.md","utf8");
 assert.match(instructions,/Tamayuz Live Guardian/);
 assert.match(instructions,/explicit approval/);
 assert.match(instructions,/Supabase/);
 const guide=readFileSync("live/README.md","utf8");
 assert.match(guide,/website account/);
 assert.match(guide,/5,400 verified votes/);
 assert.match(guide,/600 continuously polling/);
 assert.match(guide,/Widescreen View/);
});
test("plugin contains a guarded release checklist and incident routing",()=>{
 const checks=readFileSync(join(root,"skills/tamayuz-live-guardian/references/release-gates.md"),"utf8");
 assert.match(checks,/explicit approval/);
 assert.match(checks,/GitHub Pages and Supabase/);
 const route=readFileSync(join(root,"skills/tamayuz-live-guardian/references/incident-playbook.md"),"utf8");
 assert.match(route,/Desktop Site/);
 assert.match(route,/Session not found/);
});
