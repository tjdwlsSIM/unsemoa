import numpy as np, os
from PIL import Image
res=np.load('crops.npy',allow_pickle=True).item()
mh=max(c.shape[0] for c in res.values()); mw=max(c.shape[1] for c in res.values())
S=int(max(mh,mw)*1.08); print('max',mh,mw,'S',S)
os.makedirs('master',exist_ok=True)
for k,c in res.items():
    h,w=c.shape[:2]
    can=Image.new('RGBA',(S,S),(0,0,0,0))
    x=(S-w)//2; y=S-int(S*0.04)-h
    can.alpha_composite(Image.fromarray(c,'RGBA'),(x,y))
    can.resize((1024,1024),Image.LANCZOS).save(f'master/{k}.png')
# preview on cream + on dark
ids=['rat','ox','tiger','rabbit','dragon','snake','horse','goat','monkey','rooster','dog','pig']
W=200
for bgname,bg in [('cream',(250,247,242,255)),('dark',(30,36,60,255))]:
    s=Image.new('RGBA',(W*6,W*6),bg)
    for i,a in enumerate(ids):
        for j,m in enumerate(['happy','normal','worried']):
            im=Image.open(f'master/{a}-{m}.png').resize((W,W),Image.LANCZOS)
            s.alpha_composite(im,(((i%2)*3+j)*W,(i//2)*W))
    s.convert('RGB').save(f'preview-{bgname}.png')
