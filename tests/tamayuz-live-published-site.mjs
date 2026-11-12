// Production-site browser smoke: public pages only, with an impossible join code.
// Never authenticates as the owner, registers a real participant, casts votes, or mutates data.
import {chromium} from "playwright";
import assert from "node:assert/strict";

const base="https://tamayuz10x.com/live/";
const errors=[];
const browser=await chromium.launch({headless:true});
try{
  for(const [name,width,height] of [["desktop",1366,768],["small-mobile",320,700]]){
    const ctx=await browser.newContext({viewport:{width,height},locale:"en-US",ignoreHTTPSErrors:false});
    const page=await ctx.newPage();
    page.on("pageerror",e=>errors.push(name+": "+e.message));
    const resp=await page.goto(base,{waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(resp.status(),200,name+": public HTTPS page must return 200");
    await page.locator("#tl-hero-title").waitFor({timeout:20000});
    assert.equal(await page.locator("#join").count(),1,name+": join form missing");
    assert.equal(await page.locator("#presenter-mode").count(),1,name+": presenter entry missing");
    assert.equal(await page.locator("#home-link").count(),1,name+": home navigation missing");
    assert.equal(await page.locator("html").getAttribute("lang"),"en");

    await page.locator("#language").click();
    assert.equal(await page.locator("html").getAttribute("lang"),"ar");
    assert.equal(await page.locator("html").getAttribute("dir"),"rtl");
    assert.equal(await page.locator("#tl-hero-title").count(),1);
    await page.locator("#language").click();
    assert.equal(await page.locator("html").getAttribute("dir"),"ltr");

    // Run theme toggle in the actual production browser, without a backend action.
    const before=await page.locator("html").getAttribute("data-live-theme");
    await page.locator("#theme-toggle").click();
    const after=await page.locator("html").getAttribute("data-live-theme");
    assert.notEqual(before,after,name+": theme did not toggle");

    await page.locator("#presenter-mode").click();
    await page.locator("#presenter-link").waitFor({timeout:5000});
    assert.equal(await page.locator("#session-list").count(),0,name+": private session list leaked");
    await page.locator("#home-link").click();
    await page.locator("#tl-hero-title").waitFor();

    if(width===320){
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+": horizontal overflow");
    }
    await ctx.close();
  }

  const ctx=await browser.newContext({viewport:{width:390,height:844}});
  const page=await ctx.newPage();
  page.on("pageerror",e=>errors.push("invalid-code: "+e.message));
  // '_' and 19 characters make this impossible for the app's actual 10-hex-character code generator.
  await page.goto(base+"?code=NOT_A_REAL_CODE_26",{waitUntil:"domcontentloaded",timeout:30000});
  await page.getByRole("heading",{name:"Session not found."}).waitFor({timeout:15000});
  assert.equal(await page.locator("#poll .option").count(),0);
  await ctx.close();

  assert.deepEqual(errors,[],"Live JavaScript errors on published site");
  console.log("Tamayuz Live PRODUCTION public UI smoke: desktop/mobile, RTL, theme, presenter privacy, invalid code PASS");
}finally{await browser.close()}
