# Usage: python3 publish_linkedin_document.py <pdf> <post-text.md> "<document title>"
# Publishes one LinkedIn document post for urn:li:person:Za1Xd1gMPU via the environment proxy (no token in code).
import json,re,sys,time,subprocess
pdf,caption_md,title=sys.argv[1],sys.argv[2],sys.argv[3]
V='202609'; OWNER='urn:li:person:Za1Xd1gMPU'
H=['-H',f'LinkedIn-Version: {V}','-H','X-Restli-Protocol-Version: 2.0.0']
def curl(args):
    r=subprocess.run(['curl','-sS','-w','\n%{http_code}']+args,capture_output=True,text=True)
    body,code=r.stdout.rsplit('\n',1); return int(code),body
code,b=curl(['-X','POST','https://api.linkedin.com/rest/documents?action=initializeUpload']+H+['-H','Content-Type: application/json','-d',json.dumps({"initializeUploadRequest":{"owner":OWNER}})])
assert code==200,(code,b[:300]); v=json.loads(b)['value']; doc=v['document']; up=v['uploadUrl']
code,b=curl(['-X','PUT',up,'-H','Content-Type: application/octet-stream','--data-binary','@'+pdf])
assert code in (200,201),(code,b[:300])
enc=doc.replace(':','%3A')
for i in range(20):
    code,b=curl([f'https://api.linkedin.com/rest/documents/{enc}','-H',f'LinkedIn-Version: {V}'])
    st=json.loads(b).get('status') if code==200 else None
    if st=='AVAILABLE': break
    time.sleep(5)
assert st=='AVAILABLE',(code,b[:300])
t=open(caption_md).read(); body=t.split('---',1)[1].strip(); lines=body.split('\n')
tags=[l for l in lines if l.startswith('#')]; body='\n'.join(l for l in lines if not l.startswith('#')).strip()
esc=lambda s: re.sub(r'([\\|{}@\[\]()<>#*_~])',r'\\\1',s)
text=esc(body)+'\n\n'+' '.join('{hashtag|\\#|'+esc(h[1:])+'}' for h in tags[0].split())
payload={"author":OWNER,"commentary":text,"visibility":"PUBLIC","distribution":{"feedDistribution":"MAIN_FEED","targetEntities":[],"thirdPartyDistributionChannels":[]},"content":{"media":{"title":title,"id":doc}},"lifecycleState":"PUBLISHED","isReshareDisabledByAuthor":False}
open('/tmp/linkedin_payload.json','w').write(json.dumps(payload,ensure_ascii=False))
r=subprocess.run(['curl','-sS','-D','-','-o','/dev/null','-X','POST','https://api.linkedin.com/rest/posts']+H+['-H','Content-Type: application/json','--data-binary','@/tmp/linkedin_payload.json'],capture_output=True,text=True)
st=r.stdout.split('\n')[0]; m=re.search(r'(?im)^x-restli-id:\s*(\S+)',r.stdout)
print('DOC',doc); print('STATUS',st.strip()); print('POST',m.group(1) if m else None)
