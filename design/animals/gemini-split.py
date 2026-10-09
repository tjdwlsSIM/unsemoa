import numpy as np, glob, os
from PIL import Image
from scipy import ndimage as ndi
NAME={'chiken':'rooster','cow':'ox','sheep':'goat'}
MOODS=['normal','happy','worried']
res={}
for f in sorted(glob.glob('/mnt/user-data/uploads/animal-image/*.png')):
    base=os.path.basename(f)[:-4]; aid=NAME.get(base,base)
    rgb=np.asarray(Image.open(f).convert('RGB')).astype(np.float32)
    H,W,_=rgb.shape
    mn=rgb.min(axis=2)
    cand = mn>215                      # near-white
    lab,n=ndi.label(cand)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(border))
    # soft alpha in background region based on whiteness; fully transparent for very white
    a=np.ones((H,W),np.float32)
    band=bg
    a[band]=np.clip((255-mn[band])/140.0,0,1)
    # also soften fringe just outside bg (1px) by grow
    alpha=a
    # unpremultiply colors
    out=rgb.copy()
    m=(alpha>0)&(alpha<1)
    out[m]=np.clip((rgb[m]-(1-alpha[m])[:,None]*255)/alpha[m][:,None],0,255)
    rgba=np.dstack([out,alpha*255]).astype(np.uint8)
    # components of foreground
    fg=alpha>0.1
    fgd=ndi.binary_dilation(fg,iterations=3)
    lab2,n2=ndi.label(fgd)
    sizes=ndi.sum(fgd,lab2,range(1,n2+1))
    order=np.argsort(sizes)[::-1]
    big=[i+1 for i in order[:3]]
    sl={i:ndi.find_objects(lab2)[i-1] for i in range(1,n2+1)}
    big=sorted(big,key=lambda i:(sl[i][1].start+sl[i][1].stop))
    boxes=[[sl[i][0].start,sl[i][0].stop,sl[i][1].start,sl[i][1].stop] for i in big]
    groups={i:[i] for i in big}
    for i in range(1,n2+1):
        if i in big or sizes[i-1]<30: continue
        cx=(sl[i][1].start+sl[i][1].stop)/2
        # assign to nearest big by horizontal overlap/distance
        d=[min(abs(cx-b[2]),abs(cx-b[3])) if not (b[2]<=cx<=b[3]) else 0 for b in boxes]
        j=int(np.argmin(d))
        if d[j]>0:
            pix=rgb[lab2==i]; pix=pix[pix.min(axis=1)<215]
            if len(pix):
                r,g,b_=pix.mean(axis=0)
                if r>200 and g>170 and b_<150: j=1   # yellow sparkle -> happy
                elif b_>r+20: j=2                    # blue sweat -> worried
        groups[big[j]].append(i)
    for k,i in enumerate(big):
        mask=np.isin(lab2,groups[i])
        ys,xs=np.where(mask&fg)
        y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        crop=rgba[y0:y1,x0:x1].copy()
        crop[...,3]=np.where(mask[y0:y1,x0:x1],crop[...,3],0)
        res[f'{aid}-{MOODS[k]}']=crop
    print(aid, n2, [int(sizes[i-1]) for i in big], [ (b[2],b[3]) for b in boxes])
np.save('crops.npy',res,allow_pickle=True)
