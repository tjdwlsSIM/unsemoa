import json, os
OL = "#4a3b36"; SW = 7
def lighten(h, t):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16) for i in (0,2,4)]
    f=lambda c: int(c+(255-c)*t) if t>0 else int(c*(1+t))
    return '#%02x%02x%02x'%(f(r),f(g),f(b))
def E(cx,cy,rx,ry,fill,rot=0,stroke=True,extra=''):
    s=f' stroke="{OL}" stroke-width="{SW}"' if stroke else ''
    tr=f' transform="rotate({rot} {cx} {cy})"' if rot else ''
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}"{s}{tr} {extra}/>'
def C(cx,cy,r,fill,stroke=True): return E(cx,cy,r,r,fill,0,stroke)
def P(d,fill="none",stroke=OL,w=SW,extra=''): return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def TUBE(d,color,w): return P(d,"none",OL,w+14)+P(d,"none",color,w)
def mirror(fn):  # fn(sign) -> svg, sign=-1 left, +1 right
    return fn(-1)+fn(1)

A = {
 "rat":    dict(name="쥐",    body="#bcc6d9", accent="#8fa3c7"),
 "ox":     dict(name="소",    body="#ead3b0", accent="#d9a86c"),
 "tiger":  dict(name="호랑이", body="#f7b56a", accent="#f08a4b"),
 "rabbit": dict(name="토끼",  body="#fbf0f3", accent="#f4a3b9"),
 "dragon": dict(name="용",    body="#a9dcc3", accent="#4fb58f"),
 "snake":  dict(name="뱀",    body="#cdb9e6", accent="#9b7fd1"),
 "horse":  dict(name="말",    body="#dba46b", accent="#b8743f"),
 "goat":   dict(name="양",    body="#fff3d4", accent="#f2cf66"),
 "monkey": dict(name="원숭이", body="#be8458", accent="#f4a582"),
 "rooster":dict(name="닭",    body="#fffaf1", accent="#f26d5b"),
 "dog":    dict(name="개",    body="#f3c56d", accent="#e0a23a"),
 "pig":    dict(name="돼지",  body="#f9c6d1", accent="#f28aa4"),
}

def parts(k, a):
    b=a["body"]; ac=a["accent"]; d=lighten(b,-0.18); li=lighten(b,0.55)
    tail=back=front=belly=""; mouth_y=252; eye_y=212; nose=True; mouth=True
    if k=="rat":
        back=mirror(lambda s: C(256+s*118,105,58,b)+C(256+s*118,108,33,"#f7b6c2",False))
        tail=TUBE("M330,440 C420,455 450,385 405,360",'#f7b6c2',9)
        front=E(256,236,11,8,"#f28aa4")+mirror(lambda s: P(f"M{256+s*52},246 L{256+s*105},236",w=4)+P(f"M{256+s*52},254 L{256+s*104},262",w=4))
        mouth_y=258
    elif k=="ox":
        back=mirror(lambda s: P(f"M{256+s*95},120 C{256+s*125},100 {256+s*140},70 {256+s*130},38 C{256+s*160},62 {256+s*160},110 {256+s*120},140 Z","#fff3d6")+E(256+s*150,195,42,22,b,rot=s*20))
        front=E(318,128,34,20,d,stroke=False)+E(256,262,72,46,"#f8e8d2")+E(234,256,7,10,OL,stroke=False)+E(278,256,7,10,OL,stroke=False)
        mouth_y=286; eye_y=200
        tail=TUBE("M335,435 C400,445 430,420 425,390",b,10)+C(425,385,14,d)
    elif k=="tiger":
        back=mirror(lambda s: C(256+s*105,95,42,b)+C(256+s*105,98,22,"#fff4e6",False))
        stripe="#7a4a32"
        front=(P("M256,80 L256,118",w=10,stroke=stripe)+P("M222,88 L230,118",w=9,stroke=stripe)+P("M290,88 L282,118",w=9,stroke=stripe)
               +mirror(lambda s: P(f"M{256+s*146},200 L{256+s*118},208",w=8,stroke=stripe)+P(f"M{256+s*146},226 L{256+s*120},228",w=8,stroke=stripe))
               +E(256,258,58,36,"#fff6ea")+P("M246,238 L266,238 L256,250 Z","#f28aa4",w=4))
        mouth_y=262
        tail=TUBE("M335,440 C420,450 445,390 410,360",b,14)+P("M420,420 L440,428",w=7,stroke=stripe)+P("M425,385 L446,382",w=7,stroke=stripe)
        belly=E(256,405,55,50,"#fff4e6",stroke=False)
    elif k=="rabbit":
        back=mirror(lambda s: E(256+s*52,50,32,82,b,rot=s*8)+E(256+s*52,58,15,58,"#f7b6c2",rot=s*8,stroke=False))
        front=E(256,236,10,7,"#f28aa4")
        mouth_y=254
        tail=C(350,440,24,"#ffffff")
    elif k=="dragon":
        gold="#f3c44f"
        back=mirror(lambda s: P(f"M{256+s*62},92 L{256+s*95},28 M{256+s*82},55 L{256+s*118},48",w=26,stroke=OL)+P(f"M{256+s*62},92 L{256+s*95},28 M{256+s*82},55 L{256+s*118},48",w=13,stroke=gold))
        front=("".join(P(f"M{x-16},{y+14} L{x},{y-14} L{x+16},{y+14}",ac,w=5) for x,y in [(226,84),(256,74),(286,84)])
               +E(256,258,60,37,"#f4f1d8")+E(238,250,6,8,OL,stroke=False)+E(274,250,6,8,OL,stroke=False)
               +mirror(lambda s: P(f"M{256+s*62},262 C{256+s*100},262 {256+s*110},295 {256+s*132},280",w=5,stroke=gold)))
        mouth_y=280
        belly=E(256,408,52,55,"#f4f1d8",stroke=False)+"".join(P(f"M{216+i*0},{385+i*20} Q256,{395+i*20} 296,{385+i*20}",w=4,stroke=lighten("#f4f1d8",-0.2)) for i in range(3))
        tail=TUBE("M335,440 C420,455 450,395 420,350",b,20)+P("M420,350 L440,322 L446,356 Z",ac,w=5)
    elif k=="snake":
        front=E(256,268,92,52,"#f5eefc",stroke=False)+P("M256,92 L284,122 L256,152 L228,122 Z",d,w=0)
        front+=P("M256,274 L256,298 M256,298 L247,310 M256,298 L265,310",w=5,stroke="#e0556a"); mouth_y=262
        belly=E(256,408,50,55,"#f5eefc",stroke=False)+"".join(P(f"M218,{388+i*20} Q256,{398+i*20} 294,{388+i*20}",w=4,stroke="#d9c9ee") for i in range(3))
        tail=TUBE("M330,452 C440,475 470,380 410,350 C370,330 345,370 380,385",b,34)
    elif k=="horse":
        mane="#7c4a2d"
        back=mirror(lambda s: P(f"M{256+s*70},92 L{256+s*98},22 L{256+s*125},100 Z",b)+P(f"M{256+s*84},84 L{256+s*98},48 L{256+s*112},90 Z","#f3b6a0",w=0))
        back+=P("M300,80 C360,70 400,110 405,170 C385,150 360,140 340,150 Z",mane)
        front=(P("M200,95 C215,60 280,55 305,85 C300,120 270,140 240,150 C250,125 245,110 230,110 C220,112 210,118 200,125 Z",mane)
               +E(256,268,78,48,"#f3cfa0")
               +E(226,264,6,9,OL,stroke=False)+E(286,264,6,9,OL,stroke=False))
        mouth_y=292; eye_y=206
        tail=TUBE("M335,440 C400,440 430,420 430,380",mane,22)
    elif k=="goat":
        horn="#d9b98a"
        back=mirror(lambda s: E(256+s*150,205,40,19,"#f6d9bf",rot=-s*15))
        front=(mirror(lambda s: P(f"M{256+s*108},112 C{256+s*150},88 {256+s*175},135 {256+s*145},152 C{256+s*125},162 {256+s*118},138 {256+s*135},134",w=26,stroke=OL)
                       +P(f"M{256+s*108},112 C{256+s*150},88 {256+s*175},135 {256+s*145},152 C{256+s*125},162 {256+s*118},138 {256+s*135},134",w=13,stroke=horn))
               +"".join(C(x,y,r,"#ffffff") for x,y,r in [(196,108,32),(232,88,36),(276,86,36),(316,106,32)])
               +E(256,236,10,7,"#f28aa4"))
        mouth_y=256; eye_y=214
        belly="".join(C(x,y,22,"#ffffff",False) for x,y in [(215,400),(256,415),(297,400),(236,440),(278,440)])
        tail=C(352,430,22,"#ffffff")
    elif k=="monkey":
        face="#f7d6b8"
        back=mirror(lambda s: C(256+s*148,215,42,b)+C(256+s*148,215,24,face,False))
        front=C(216,212,58,face,False)+C(296,212,58,face,False)+E(256,262,86,56,face,stroke=False)+E(256,240,9,6,lighten(b,-0.3),stroke=False)
        mouth_y=262
        belly=E(256,405,55,52,face,stroke=False)
        tail=TUBE("M335,440 C420,450 440,380 400,370 C375,365 372,392 392,395",b,13)
    elif k=="rooster":
        back=C(222,74,26,ac)+C(256,60,30,ac)+C(290,74,26,ac)
        front=P("M236,236 L276,236 L256,262 Z","#f7c14a",w=5)+E(256,276,11,15,ac)
        mouth=False
        tail=(P("M330,420 C390,370 420,330 400,300","none",OL,34)+P("M330,420 C390,370 420,330 400,300","none",ac,20)
              +P("M335,430 C410,410 440,370 440,340","none",OL,30)+P("M335,430 C410,410 440,370 440,340","none","#f7c14a",16))
    elif k=="dog":
        ear="#c98a3c"
        front=(E(335,212,34,30,lighten(b,0.35),stroke=False)
               +mirror(lambda s: E(256+s*140,205,34,68,ear,rot=-s*18))
               +E(256,260,60,40,"#fff6e3")+E(256,244,16,11,OL,stroke=False))
        mouth_y=268
        tail=TUBE("M335,430 C390,430 420,400 415,365",b,15)
    elif k=="pig":
        back=mirror(lambda s: P(f"M{256+s*78},104 Q{256+s*96},40 {256+s*140},42 Q{256+s*150},90 {256+s*138},122 Z",b)+P(f"M{256+s*96},98 Q{256+s*108},60 {256+s*132},58 Q{256+s*138},88 {256+s*128},108 Z","#f28aa4",w=0))
        front=E(256,250,38,27,"#f5a6b8")+E(244,250,6,10,"#b85a70",stroke=False)+E(268,250,6,10,"#b85a70",stroke=False)
        mouth_y=292; eye_y=204; nose=False
        tail=TUBE("M350,420 C385,400 408,428 392,444 C378,456 366,436 384,428 C400,420 418,430 424,418","#f5a6b8",9)
    return dict(tail=tail,back=back,front=front,belly=belly,mouth_y=mouth_y,eye_y=eye_y,mouth=mouth)

def face(mood, ey, my, mouth):
    s=""
    if mood=="happy":
        s+=mirror(lambda d: P(f"M{256+d*51-15},{ey+6} Q{256+d*51},{ey-14} {256+d*51+15},{ey+6}",w=8))
    else:
        s+=mirror(lambda d: C(256+d*51,ey,14,OL,False)+C(256+d*51-4,ey-5,5,"#ffffff",False))
    s+=mirror(lambda d: E(256+d*84,ey+38,22,13,"#ff8fa3",stroke=False,extra='opacity="0.55"'))
    if mood=="worried":
        s+=mirror(lambda d: P(f"M{256+d*72},{ey-30} L{256+d*34},{ey-40}",w=6))
    if mouth:
        if mood=="happy":
            s+=P(f"M{238},{my-4} Q256,{my+28} {274},{my-4} Z","#e2687a",w=6)
        elif mood=="normal":
            s+=P(f"M{242},{my-2} Q{249},{my+8} 256,{my} Q{263},{my+8} {270},{my-2}",w=6)
        else:
            s+=P(f"M{242},{my+4} Q{249},{my-4} 256,{my+4} Q{263},{my+12} {270},{my+4}",w=6)
    return s

def star(x,y,r,c="#f5c542"):
    return f'<path d="M{x},{y-r} Q{x},{y} {x+r},{y} Q{x},{y} {x},{y+r} Q{x},{y} {x-r},{y} Q{x},{y} {x},{y-r} Z" fill="{c}"/>'

def svg(k, mood):
    a=A[k]; b=a["body"]; ac=a["accent"]; p=parts(k,a)
    g=f'''<defs><radialGradient id="g" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="{lighten(b,0.35)}"/><stop offset="0.6" stop-color="{b}"/><stop offset="1" stop-color="{lighten(b,-0.12)}"/></radialGradient></defs>'''
    body = E(256,392,108,90,"url(#g)")
    feet = mirror(lambda s: E(256+s*48,470,36,20,lighten(b,-0.06)))
    arms = mirror(lambda s: E(256+s*100,385,26,38,"url(#g)",rot=-s*28))
    collar = P("M196,330 L256,396 L316,330","none",OL,28)+P("M196,330 L256,396 L316,330","none","#ffffff",15)
    ribbon = P("M262,392 L296,452",w=26)+P("M262,392 L296,452",stroke=ac,w=13)+P("M262,392 L276,458",w=26)+P("M262,392 L276,458",stroke=ac,w=13)+E(270,390,20,12,ac,rot=-15)
    head = E(256,205,150,128,"url(#g)")
    extras=""
    if mood=="happy": extras=star(96,110,20)+star(420,92,16)+star(440,190,12)
    if mood=="worried": extras=P("M402,132 Q390,158 402,164 Q416,158 402,132 Z","#9fd3f2",w=5)
    inner = p["tail"]+body+p["belly"]+feet+arms+collar+ribbon+p["back"]+head+p["front"]+face(mood,p["eye_y"],p["mouth_y"],p["mouth"])+extras
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">{g}<g transform="translate(256 262) scale(0.86) translate(-256 -262)">{inner}</g></svg>'

os.makedirs("svg",exist_ok=True)
meta=[]
for k in A:
    for m in ("happy","normal","worried"):
        open(f"svg/{k}-{m}.svg","w").write(svg(k,m)); meta.append(f"{k}-{m}")
json.dump(meta,open("list.json","w"))
