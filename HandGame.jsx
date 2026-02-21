import { useState, useRef, useCallback, useEffect } from "react";

const COLORS=["#E63946","#457B9D","#2A9D8F","#E9C46A","#F4A261","#264653","#6A4C93","#1982C4"];
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ─── Voice ─── */
let _el={apiKey:"",voiceId:"onwK4e9ZLuTAKqWW03F9",model:"eleven_multilingual_v2",on:false};
const getEl=()=>_el;const setEl=c=>{_el={..._el,...c};};
const VOICES=[{id:"onwK4e9ZLuTAKqWW03F9",n:"Daniel",d:"رجالي واضح"},{id:"IKne3meq5aSn9XLyUdCD",n:"Charlie",d:"رجالي هادي"},{id:"JBFqnCBsd6RMkjVDRZzb",n:"George",d:"رجالي عميق"},{id:"pFZP5JQG7iQjIQuC4Bku",n:"Lily",d:"نسائي"},{id:"EXAVITQu4vr4xnSDxMaL",n:"Sarah",d:"نسائي هادي"}];
const speakB=t=>{if("speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="ar-SA";u.rate=1;u.pitch=1.1;window.speechSynthesis.speak(u);}};
let _au=null;
const speakEL=async t=>{const c=getEl();if(!c.on||!c.apiKey){speakB(t);return;}try{if(_au){_au.pause();_au=null;}const r=await fetch("https://api.elevenlabs.io/v1/text-to-speech/"+c.voiceId,{method:"POST",headers:{"Content-Type":"application/json","xi-api-key":c.apiKey},body:JSON.stringify({text:t,model_id:c.model,language_code:"ar",voice_settings:{stability:.5,similarity_boost:.75,style:.4,use_speaker_boost:true}})});if(!r.ok){speakB(t);return;}const b=await r.blob(),u=URL.createObjectURL(b);_au=new Audio(u);_au.play();_au.onended=()=>{URL.revokeObjectURL(u);_au=null;};}catch(e){speakB(t);}};
const speak=t=>speakEL(t);
const stopVoice=()=>{if(_au){_au.pause();_au=null;}if("speechSynthesis" in window)window.speechSynthesis.cancel();};
let _voiceMuted=false;
const isVoiceMuted=()=>_voiceMuted;
const setVoiceMuted=v=>{_voiceMuted=v;if(v)stopVoice();};
const speakSafe=t=>{if(!_voiceMuted)speak(t);};
const sfx=type=>{try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);if(type==="win"){o.frequency.setValueAtTime(523,c.currentTime);o.frequency.setValueAtTime(784,c.currentTime+.2);g.gain.setValueAtTime(.3,c.currentTime);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+.5);o.start();o.stop(c.currentTime+.5);}else{o.frequency.setValueAtTime(440,c.currentTime);g.gain.setValueAtTime(.2,c.currentTime);g.gain.exponentialRampToValueAtTime(.01,c.currentTime+.3);o.start();o.stop(c.currentTime+.3);}}catch(e){}};


/* ─── Voice Settings ─── */
function VoiceSettings({onClose}){
  const[cfg,setCfg]=useState(getEl());const[testing,setTesting]=useState(false);
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:250,padding:16}}>
    <div style={{width:"100%",maxWidth:380,maxHeight:"85vh",overflowY:"auto",background:"linear-gradient(135deg,#1a1a3e,#24243e)",borderRadius:18,padding:18,border:"1px solid rgba(255,255,255,0.1)",direction:"rtl",color:"#fff"}}>
      <h3 style={{margin:"0 0 10px",fontSize:16,fontWeight:700,color:"#E9C46A"}}>🔊 الصوت</h3>
      <div style={{marginBottom:8}}><label style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.45)",display:"block",marginBottom:3}}>مفتاح ElevenLabs</label>
        <input type="password" value={cfg.apiKey} onChange={e=>setCfg({...cfg,apiKey:e.target.value,on:!!e.target.value})} placeholder="sk_..." style={{width:"100%",padding:"7px 9px",borderRadius:7,border:"1px solid rgba(255,255,255,0.09)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:13,outline:"none",direction:"ltr",boxSizing:"border-box"}}/>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",margin:"2px 0 0"}}>مجاني 10K حرف/شهر من elevenlabs.io</p></div>
      <div style={{marginBottom:8}}><label style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.45)",display:"block",marginBottom:3}}>الصوت</label>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>{VOICES.map(v=><button key={v.id} onClick={()=>setCfg({...cfg,voiceId:v.id})} style={{padding:"5px 8px",borderRadius:6,border:"1px solid "+(cfg.voiceId===v.id?"#E9C46A":"rgba(255,255,255,0.06)"),background:cfg.voiceId===v.id?"rgba(233,196,106,0.08)":"transparent",color:cfg.voiceId===v.id?"#E9C46A":"rgba(255,255,255,0.5)",fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"right"}}>{v.n} - {v.d}</button>)}</div></div>
      <div style={{display:"flex",gap:4}}>
        <button onClick={()=>{setEl(cfg);onClose();}} style={{flex:1,padding:8,borderRadius:8,border:"none",background:"linear-gradient(135deg,#2A9D8F,#264653)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>حفظ ✅</button>
        <button onClick={async()=>{setTesting(true);setEl(cfg);await speakEL("يا هلا باللعيبة!");setTesting(false);}} disabled={!cfg.apiKey||testing} style={{padding:"8px 10px",borderRadius:8,border:"1px solid rgba(233,196,106,0.2)",background:"rgba(233,196,106,0.04)",color:"#E9C46A",fontSize:12,cursor:"pointer",opacity:!cfg.apiKey||testing?.4:1}}>{testing?"...":"🔊 تجربة"}</button>
        <button onClick={onClose} style={{padding:"8px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)",background:"transparent",color:"#fff",fontSize:12,cursor:"pointer"}}>إلغاء</button>
      </div></div></div>);
}

/* ─── Scoring Modal ─── */
function ScoringModal({players,rules,curRound,totals,onSubmit,onCancel}){
  const free=rules.scoringMode==="free";const[type,setType]=useState("normal");
  const[khalasP,setKhalasP]=useState(null); // مين خلّص (واحد، -30)
  const[stolenP,setStolenP]=useState(null); // من عليه الفرش (واحد، +130)
  const[extraFarsh,setExtraFarsh]=useState(false); // فيه أحد فرش بعد؟
  const[extraPs,setExtraPs]=useState([]); // اللي فرشوا بعد (متعدد + نقاط يدوي)
  const[handP,setHandP]=useState(null);const[penP,setPenP]=useState(null);
  const[handMode,setHandMode]=useState("normal");
  const[handExtra,setHandExtra]=useState(false);const[handExtraPs,setHandExtraPs]=useState([]);
  const toggleHandExtraP=i=>{setHandExtraPs(prev=>prev.find(f=>f.i===i)?prev.filter(f=>f.i!==i):[...prev,{i,score:""}]);};
  const setHandExtraPScore=(i,v)=>{setHandExtraPs(prev=>prev.map(f=>f.i===i?{...f,score:v}:f));};
  const isHandExtraP=i=>!!handExtraPs.find(f=>f.i===i); // normal, super, superJoker
  const[man,setMan]=useState({});const[neg,setNeg]=useState({}); // neg[i]=true means negative
  const isLast=curRound>=rules.totalRounds;const canFarsh=!free&&rules.farshAllowed&&!(rules.noFarshLastRound&&isLast);
  const toggleExtraP=i=>{setExtraPs(prev=>prev.find(f=>f.i===i)?prev.filter(f=>f.i!==i):[...prev,{i,score:""}]);};
  const setExtraPScore=(i,v)=>{setExtraPs(prev=>prev.map(f=>f.i===i?{...f,score:v}:f));};
  const isExtraP=i=>!!extraPs.find(f=>f.i===i);

  const calc=()=>{const r={};
    if(type==="farsh"&&khalasP!==null){
      const m=handMode==="super"?2:1;
      const extraIdxs=extraPs.map(f=>f.i);
      players.forEach((_,i)=>{
        if(i===khalasP) r[i]=rules.farshScore*m;
        else if(i===stolenP) r[i]=rules.farshStolenScore*m;
        else if(extraIdxs.includes(i)){
          const ep=extraPs.find(f=>f.i===i);
          const v=parseInt(ep.score);
          r[i]=(!isNaN(v)?v:rules.farshOthersScore)*m;
        }
        else r[i]=rules.farshOthersScore*m;
      });
    }else if(type==="hand"&&handP!==null){
      const heIdxs=handExtraPs.map(f=>f.i);
      // Multiplier for farsh scores: normal=x2, super=x4, superJoker=x8
      const farshMul=handMode==="superJoker"?8:handMode==="super"?4:2;
      if(handMode==="superJoker"){
        players.forEach((_,i)=>{
          if(i===handP){r[i]=rules.superJokerHandScore;}
          else if(heIdxs.includes(i)){const ep=handExtraPs.find(f=>f.i===i);const v=parseInt(ep.score);r[i]=!isNaN(v)?v*farshMul:rules.superJokerOthersScore;}
          else{r[i]=rules.superJokerOthersScore;}
          if(i===penP&&i!==handP) r[i]=(r[i]||0)+rules.superJokerPenalty;
        });
      }else{
        const m=handMode==="super"?2:1;
        players.forEach((_,i)=>{
          if(i===handP){r[i]=rules.handScore*m;}
          else if(heIdxs.includes(i)){const ep=handExtraPs.find(f=>f.i===i);const v=parseInt(ep.score);r[i]=!isNaN(v)?v*farshMul:(rules.handOthersScore*m);}
          else{r[i]=rules.handOthersScore*m;}
          if(i===penP&&i!==handP) r[i]=(r[i]||0)+rules.handPenaltyExtra*m;
        });
      }
    }else{
      players.forEach((_,i)=>{let v=parseInt(man[i])||0;if(neg[i])v=-Math.abs(v);r[i]=v;});
    }return r;};
  const pv=calc();
  const submit=()=>{const s=calc();if(Object.values(s).every(v=>v===0)&&type==="normal")return;onSubmit({type,scores:s,isSuper:handMode==="super",isSuperJoker:handMode==="superJoker"});};
  const PB=({i,sel,fn})=><button onClick={()=>fn(i)} style={{padding:"5px 10px",borderRadius:7,border:"1px solid "+(sel===i?players[i].color:"rgba(255,255,255,0.09)"),background:sel===i?players[i].color:"rgba(255,255,255,0.02)",color:sel===i?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:600,cursor:"pointer"}}>{players[i].name}</button>;
  const L=({children})=><label style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.45)",display:"block",margin:"8px 0 4px"}}>{children}</label>;

  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
    <div style={{width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto",background:"linear-gradient(135deg,#1a1a3e,#24243e)",borderRadius:18,padding:18,border:"1px solid rgba(255,255,255,0.1)",direction:"rtl",color:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><h3 style={{margin:0,fontSize:17,fontWeight:700}}>الجولة {curRound}</h3>{isLast&&<span style={{background:"rgba(230,57,70,0.18)",color:"#E63946",padding:"2px 8px",borderRadius:7,fontSize:12,fontWeight:700}}>⚡ الأخيرة</span>}</div>

      {/* Round Type */}
      {!free&&<><L>نوع الجولة</L><div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
        <button onClick={()=>{setType("normal");setHandMode("normal");}} style={{padding:"5px 11px",borderRadius:8,border:"1px solid "+(type==="normal"?"#457B9D":"rgba(255,255,255,0.08)"),background:type==="normal"?"rgba(69,123,157,0.18)":"transparent",color:type==="normal"?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:600,cursor:"pointer"}}>عادية</button>
        {canFarsh&&<button onClick={()=>{setType("farsh");setHandMode("normal");}} style={{padding:"5px 11px",borderRadius:8,border:"1px solid "+(type==="farsh"?"#E9C46A":"rgba(255,255,255,0.08)"),background:type==="farsh"?"rgba(233,196,106,0.13)":"transparent",color:type==="farsh"?"#E9C46A":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:600,cursor:"pointer"}}>فرش 🃏</button>}
        {!free&&<button onClick={()=>setType("hand")} style={{padding:"5px 11px",borderRadius:8,border:"1px solid "+(type==="hand"?"#E63946":"rgba(255,255,255,0.08)"),background:type==="hand"?"rgba(230,57,70,0.13)":"transparent",color:type==="hand"?"#E63946":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:600,cursor:"pointer"}}>هند ✋</button>}
      </div></>}

      {/* Hand Mode: normal / super / superJoker */}
      {type==="hand"&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
        <button onClick={()=>setHandMode("normal")} style={{padding:"5px 10px",borderRadius:7,border:"1px solid "+(handMode==="normal"?"#2A9D8F":"rgba(255,255,255,0.07)"),background:handMode==="normal"?"rgba(42,157,143,0.12)":"transparent",color:handMode==="normal"?"#2A9D8F":"rgba(255,255,255,0.45)",fontSize:12,fontWeight:600,cursor:"pointer"}}>هند عادي</button>
        <button onClick={()=>setHandMode("super")} style={{padding:"5px 10px",borderRadius:7,border:"1px solid "+(handMode==="super"?"#E9C46A":"rgba(255,255,255,0.07)"),background:handMode==="super"?"rgba(233,196,106,0.12)":"transparent",color:handMode==="super"?"#E9C46A":"rgba(255,255,255,0.45)",fontSize:12,fontWeight:600,cursor:"pointer"}}>🔥 سوبر دبل</button>
        <button onClick={()=>setHandMode("superJoker")} style={{padding:"5px 10px",borderRadius:7,border:"1px solid "+(handMode==="superJoker"?"#E63946":"rgba(255,255,255,0.07)"),background:handMode==="superJoker"?"rgba(230,57,70,0.12)":"transparent",color:handMode==="superJoker"?"#E63946":"rgba(255,255,255,0.45)",fontSize:12,fontWeight:600,cursor:"pointer"}}>🃏 سوبر جوكر</button>
      </div>}

      {/* Farsh super toggle */}
      {type==="farsh"&&<div style={{marginBottom:6}}><button onClick={()=>setHandMode(handMode==="super"?"normal":"super")} style={{width:"100%",padding:6,borderRadius:7,border:"1px solid "+(handMode==="super"?"rgba(233,196,106,0.25)":"rgba(255,255,255,0.06)"),background:handMode==="super"?"linear-gradient(135deg,rgba(230,57,70,0.08),rgba(233,196,106,0.08))":"transparent",color:handMode==="super"?"#E9C46A":"rgba(255,255,255,0.4)",fontSize:12,fontWeight:600,cursor:"pointer"}}>{handMode==="super"?"🔥 سوبر دبل مفعّل":"سوبر دبل"}</button></div>}

      {/* FARSH details */}
      {type==="farsh"&&<>
        {/* 1. مين خلّص */}
        <L>مين خلّص؟ ({rules.farshScore})</L>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{players.map((_,i)=><PB key={i} i={i} sel={khalasP} fn={setKhalasP}/>)}</div>

        {/* 2. من عليه الفرش */}
        <L>من عليه الفرش؟ (+{rules.farshStolenScore})</L>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {players.map((_,i)=>i!==khalasP&&<PB key={i} i={i} sel={stolenP} fn={setStolenP}/>)}
          <button onClick={()=>setStolenP(null)} style={{padding:"5px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,0.08)",background:stolenP===null&&khalasP!==null?"rgba(255,255,255,0.08)":"transparent",color:"rgba(255,255,255,0.5)",fontSize:12,cursor:"pointer"}}>ما أحد</button>
        </div>

        {/* 3. مين فرش بعد */}
        <L>مين فرش بعد؟</L>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
          <button onClick={()=>{setExtraFarsh(!extraFarsh);if(extraFarsh)setExtraPs([]);}} style={{padding:"5px 12px",borderRadius:7,border:"1px solid "+(extraFarsh?"#F4A261":"rgba(255,255,255,0.08)"),background:extraFarsh?"rgba(244,162,97,0.12)":"transparent",color:extraFarsh?"#F4A261":"rgba(255,255,255,0.45)",fontSize:12,fontWeight:600,cursor:"pointer"}}>{extraFarsh?"نعم ✅":"لا"}</button>
        </div>
        {extraFarsh&&<div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:8,border:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
            {players.map((_,i)=>i!==khalasP&&i!==stolenP&&<button key={i} onClick={()=>toggleExtraP(i)} style={{padding:"5px 10px",borderRadius:7,border:"1px solid "+(isExtraP(i)?players[i].color:"rgba(255,255,255,0.09)"),background:isExtraP(i)?players[i].color:"rgba(255,255,255,0.02)",color:isExtraP(i)?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:600,cursor:"pointer"}}>{players[i].name}{isExtraP(i)?" ✓":""}</button>)}
          </div>
          {extraPs.length>0&&<div style={{display:"flex",flexDirection:"column",gap:4}}>
            {extraPs.map(ep=><div key={ep.i} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.025)",borderRadius:7,padding:"6px 8px",border:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:3,minWidth:65}}><div style={{width:6,height:6,borderRadius:"50%",background:players[ep.i].color}}/><span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>{players[ep.i].name}</span></div>
              <input type="number" inputMode="numeric" placeholder="100" value={ep.score} onChange={e=>setExtraPScore(ep.i,e.target.value)} style={{flex:1,padding:"5px 4px",borderRadius:5,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",color:"#F4A261",fontSize:16,fontWeight:700,textAlign:"center",outline:"none",minWidth:0}}/>
            </div>)}
          </div>}
        </div>}
      </>}

      {/* HAND details */}
      {type==="hand"&&<>
        <L>مين هنّد؟</L>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{players.map((_,i)=><PB key={i} i={i} sel={handP} fn={setHandP}/>)}</div>
        <L>مين الجزاء الزيادة؟</L>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{players.map((_,i)=>i!==handP&&<PB key={i} i={i} sel={penP} fn={setPenP}/>)}</div>
        {handMode==="superJoker"&&<div style={{background:"rgba(230,57,70,0.06)",borderRadius:7,padding:7,marginTop:6,border:"1px solid rgba(230,57,70,0.12)",fontSize:12,color:"rgba(255,255,255,0.5)"}}>🃏 سوبر جوكر: الهاند {rules.superJokerHandScore} | الباقي {rules.superJokerOthersScore} | الجزاء +{rules.superJokerPenalty}</div>}
        <L>فيه أحد فرش بعد؟</L>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
          <button onClick={()=>{setHandExtra(!handExtra);if(handExtra)setHandExtraPs([]);}} style={{padding:"5px 12px",borderRadius:7,border:"1px solid "+(handExtra?"#F4A261":"rgba(255,255,255,0.08)"),background:handExtra?"rgba(244,162,97,0.12)":"transparent",color:handExtra?"#F4A261":"rgba(255,255,255,0.45)",fontSize:12,fontWeight:600,cursor:"pointer"}}>{handExtra?"نعم ✅":"لا"}</button>
        </div>
        {handExtra&&<div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:8,border:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
            {players.map((_,i)=>i!==handP&&<button key={i} onClick={()=>toggleHandExtraP(i)} style={{padding:"5px 10px",borderRadius:7,border:"1px solid "+(isHandExtraP(i)?players[i].color:"rgba(255,255,255,0.09)"),background:isHandExtraP(i)?players[i].color:"rgba(255,255,255,0.02)",color:isHandExtraP(i)?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:600,cursor:"pointer"}}>{players[i].name}{isHandExtraP(i)?" ✓":""}</button>)}
          </div>
          {handExtraPs.length>0&&<div style={{display:"flex",flexDirection:"column",gap:4}}>
            {handExtraPs.map(ep=><div key={ep.i} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.025)",borderRadius:7,padding:"6px 8px",border:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:3,minWidth:65}}><div style={{width:6,height:6,borderRadius:"50%",background:players[ep.i].color}}/><span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>{players[ep.i].name}</span></div>
              <input type="number" inputMode="numeric" placeholder="نقاطه" value={ep.score} onChange={e=>setHandExtraPScore(ep.i,e.target.value)} style={{flex:1,padding:"5px 4px",borderRadius:5,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",color:"#F4A261",fontSize:16,fontWeight:700,textAlign:"center",outline:"none",minWidth:0}}/>
            </div>)}
          </div>}
        </div>}
      </>}

      {/* NORMAL - manual with +/- toggle */}
      {(type==="normal"||free)&&<><L>نقاط كل لاعب</L><div style={{display:"flex",flexDirection:"column",gap:6}}>{players.map((p,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:"8px 10px",border:"1px solid rgba(255,255,255,0.03)",display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:4,minWidth:70}}><div style={{width:6,height:6,borderRadius:"50%",background:p.color,flexShrink:0}}/><span style={{fontSize:13,color:"rgba(255,255,255,0.6)",fontWeight:600}}>{p.name}</span></div>
        <div style={{display:"flex",gap:4,alignItems:"center",flex:1}}>
          <button onClick={()=>setNeg({...neg,[i]:!neg[i]})} style={{width:28,height:28,borderRadius:6,border:"1px solid "+(neg[i]?"rgba(42,157,143,0.4)":"rgba(230,57,70,0.3)"),background:neg[i]?"rgba(42,157,143,0.12)":"rgba(230,57,70,0.08)",color:neg[i]?"#2A9D8F":"#E63946",fontSize:16,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{neg[i]?"−":"+"}</button>
          <input type="number" inputMode="numeric" placeholder="0" value={man[i]||""} onChange={e=>setMan({...man,[i]:e.target.value})} style={{flex:1,padding:"6px 4px",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",color:neg[i]?"#2A9D8F":"#fff",fontSize:17,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box",minWidth:0}}/>
        </div>
      </div>)}</div></>}

      {/* Preview - sorted 1st to last with diff */}
      {(type!=="normal"||Object.values(man).some(v=>v))&&(()=>{
        const pvSorted=players.map((p,i)=>({name:p.name,color:p.color,i,score:pv[i]||0,newTotal:(totals?.[i]||0)+(pv[i]||0)})).sort((a,b)=>a.newTotal-b.newTotal);
        const best=pvSorted[0]?.newTotal||0;
        return <div style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:8,margin:"8px 0",border:"1px solid rgba(255,255,255,0.03)"}}>
          <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:5}}>معاينة {handMode==="super"?"🔥":handMode==="superJoker"?"🃏🔥":""}</div>
          {pvSorted.map((p,rank)=>{const diff=p.newTotal-best;return <div key={p.i} style={{display:"flex",alignItems:"center",padding:"3px 0",gap:6}}>
            <span style={{fontSize:12,fontWeight:700,minWidth:14,textAlign:"center",color:rank===0?"#E9C46A":"rgba(255,255,255,0.4)"}}>{rank+1}</span>
            <div style={{width:5,height:5,borderRadius:"50%",background:p.color,flexShrink:0}}/>
            <span style={{fontSize:13,flex:1}}>{p.name}</span>
            <span style={{fontSize:14,fontWeight:700,color:p.score<0?"#2A9D8F":p.score>=200?"#E63946":"#fff",minWidth:40,textAlign:"center"}}>{p.score>0?"+":""}{p.score}</span>
            <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)",minWidth:35,textAlign:"center"}}>{p.newTotal}</span>
            {rank>0&&<span style={{fontSize:11,color:"rgba(230,57,70,0.7)",minWidth:30,textAlign:"left"}}>+{diff}</span>}
            {rank===0&&<span style={{fontSize:11,color:"#2A9D8F",minWidth:30,textAlign:"left"}}>👑</span>}
          </div>;})}
        </div>;
      })()}

      <div style={{display:"flex",gap:5,marginTop:5}}>
        <button onClick={submit} style={{flex:1,padding:10,borderRadius:10,border:"none",background:"linear-gradient(135deg,#E9C46A,#F4A261)",color:"#1a1a2e",fontSize:15,fontWeight:700,cursor:"pointer"}}>تسجيل ✅</button>
        <button onClick={onCancel} style={{padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"#fff",fontSize:13,cursor:"pointer"}}>إلغاء</button></div>
    </div></div>);
}

/* ─── UI Helpers ─── */
const Opt=({label,active,onClick,color="#E9C46A"})=>{const[r,g,b]=[parseInt(color.slice(1,3),16),parseInt(color.slice(3,5),16),parseInt(color.slice(5,7),16)];return<button onClick={onClick} style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(active?color:"rgba(255,255,255,0.08)"),background:active?`rgba(${r},${g},${b},0.12)`:"rgba(255,255,255,0.02)",color:active?color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:600,cursor:"pointer"}}>{label}</button>;};
const Sec=({title,sub,children})=><div style={{marginBottom:14}}><label style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.65)"}}>{title}</label>{sub&&<p style={{fontSize:11,color:"rgba(255,255,255,0.28)",margin:"2px 0 5px"}}>{sub}</p>}{!sub&&<div style={{height:5}}/>}{children}</div>;
const Tog=({label,value,onChange})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.55)"}}>{label}</span><button onClick={()=>onChange(!value)} style={{padding:"4px 12px",borderRadius:6,border:"1px solid "+(value?"rgba(42,157,143,0.3)":"rgba(255,255,255,0.08)"),background:value?"rgba(42,157,143,0.1)":"transparent",color:value?"#2A9D8F":"rgba(255,255,255,0.4)",fontSize:12,fontWeight:600,cursor:"pointer"}}>{value?"مفعّل ✅":"معطّل"}</button></div>;
const NumIn=({label,value,onChange})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",fontSize:12,color:"rgba(255,255,255,0.55)"}}><span>{label}</span><input type="number" value={value} onChange={e=>onChange(parseInt(e.target.value)||0)} style={{width:55,padding:3,borderRadius:5,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.03)",color:"#fff",fontSize:13,fontWeight:700,textAlign:"center",outline:"none"}}/></div>;
const Box=({children})=><div style={{background:"rgba(255,255,255,0.015)",borderRadius:8,padding:8,marginBottom:8,border:"1px solid rgba(255,255,255,0.03)"}}>{children}</div>;

const DEF={gameMode:"individual",scoringMode:"rules",totalRounds:10,dangerLimit:2000,farshAllowed:true,noFarshLastRound:true,farshScore:-30,farshOthersScore:100,farshStolenScore:130,handScore:-60,handOthersScore:200,handPenaltyExtra:50,superJokerHandScore:-240,superJokerOthersScore:800,superJokerPenalty:200,teams:[]};

/* ─── Needs Analysis ─── */
function analyzeNeeds(pT,ldrT,R){
  const d=pT-ldrT; if(d<=0) return {diff:0,text:"متصدر 👑",type:"leader"};
  const aF={p:pT+R.farshScore,l:ldrT+R.farshOthersScore};
  const aH={p:pT+R.handScore,l:ldrT+R.handOthersScore+R.handPenaltyExtra};
  const aFD={p:pT+R.farshScore*2,l:ldrT+R.farshOthersScore*2};
  const aS={p:pT+R.handScore*2,l:ldrT+(R.handOthersScore+R.handPenaltyExtra)*2};
  const aSJ={p:pT+R.superJokerHandScore,l:ldrT+R.superJokerOthersScore+R.superJokerPenalty};
  if(aF.p<aF.l) return {diff:d,text:"فرش عادي ✅",type:"easy"};
  if(aH.p<aH.l) return {diff:d,text:"هند عادي ✅",type:"easy"};
  if(aFD.p<aFD.l) return {diff:d,text:"فرش دبل ✅",type:"medium"};
  if(aS.p<aS.l) return {diff:d,text:"هند سوبر 🔥",type:"medium"};
  if(aSJ.p<aSJ.l) return {diff:d,text:"سوبر جوكر 🃏",type:"hard"};
  return {diff:d,text:"صعب يلحق ❌",type:"impossible"};
}

/* ─── Summary Modal ─── */
function SummaryModal({players,totals,rules,rounds,onClose}){
  const s=players.map((p,i)=>({...p,idx:i,tot:totals[i]||0})).sort((a,b)=>a.tot-b.tot);
  const leader=s[0];const DL=rules.dangerLimit||0;
  const typeC={leader:"#2A9D8F",easy:"#2A9D8F",medium:"#E9C46A",hard:"#E63946",impossible:"rgba(255,255,255,0.3)"};
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
    <div style={{width:"100%",maxWidth:460,maxHeight:"90vh",overflowY:"auto",background:"linear-gradient(135deg,#1a1a3e,#24243e)",borderRadius:18,padding:20,border:"1px solid rgba(255,255,255,0.1)",direction:"rtl",color:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h3 style={{margin:0,fontSize:18,fontWeight:800,color:"#E9C46A"}}>📊 ملخص اللعبة</h3>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.35)"}}>جولة {rounds.length}/{rules.totalRounds}</span>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
      </div>

      {/* Table Header */}
      <div style={{display:"flex",alignItems:"center",padding:"6px 8px",marginBottom:2,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <span style={{width:22,fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>#</span>
        <span style={{flex:1,fontSize:11,color:"rgba(255,255,255,0.3)",marginRight:4}}>اللاعب</span>
        <span style={{width:50,fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>النقاط</span>
        <span style={{width:45,fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center"}}>الفارق</span>
        <span style={{flex:1,fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"left"}}>المطلوب للفوز</span>
      </div>

      {/* Players Rows */}
      {s.map((p,rank)=>{
        const need=analyzeNeeds(p.tot,leader.tot,rules);
        const isLeader=rank===0&&rounds.length>0;
        const dangerClose=DL>0&&p.tot>=(DL-300);
        return <div key={p.idx} style={{display:"flex",alignItems:"center",padding:"10px 8px",marginBottom:2,borderRadius:8,background:isLeader?"rgba(42,157,143,0.06)":dangerClose?"rgba(230,57,70,0.04)":"rgba(255,255,255,0.015)",border:isLeader?"1px solid rgba(42,157,143,0.1)":dangerClose?"1px solid rgba(230,57,70,0.06)":"1px solid transparent",transition:"all 0.3s ease"}}>
          <span style={{width:22,fontSize:16,fontWeight:700,textAlign:"center"}}>{isLeader?"👑":rank+1}</span>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:5,marginRight:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:p.color,flexShrink:0}}/>
            <span style={{fontSize:15,fontWeight:600}}>{p.name}</span>
          </div>
          <span style={{width:50,fontSize:17,fontWeight:800,textAlign:"center",color:p.tot<0?"#2A9D8F":"#fff"}}>{p.tot}</span>
          <span style={{width:45,fontSize:13,fontWeight:600,textAlign:"center",color:need.diff>0?"rgba(230,57,70,0.7)":"#2A9D8F"}}>{need.diff>0?"+"+need.diff:"—"}</span>
          <span style={{flex:1,fontSize:12,fontWeight:600,textAlign:"left",color:typeC[need.type]||"#fff"}}>{need.text}</span>
        </div>;
      })}

      {/* Danger Limit Info */}
      {DL>0&&<div style={{marginTop:12,padding:"8px 10px",borderRadius:8,background:"rgba(230,57,70,0.04)",border:"1px solid rgba(230,57,70,0.08)"}}>
        <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:4}}>⚠️ حد النقاط: {DL}</div>
        {s.map(p=>{
          const remaining=DL-p.tot;
          if(remaining<=0) return <div key={p.idx} style={{fontSize:12,color:"#E63946",padding:"1px 0"}}>💀 {p.name} تعدى الحد!</div>;
          if(remaining<=300) return <div key={p.idx} style={{fontSize:12,color:"#E9C46A",padding:"1px 0"}}>⚠️ {p.name} باقي {remaining} ويتعدى</div>;
          return null;
        })}
      </div>}

      {/* Stats */}
      {rounds.length>0&&<div style={{marginTop:12,padding:"10px",borderRadius:8,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.03)"}}>
        <div style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.4)",marginBottom:6}}>📈 إحصائيات</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>الجولات المتبقية: <span style={{color:"#E9C46A",fontWeight:700}}>{Math.max(0,rules.totalRounds-rounds.length)}</span></div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>فرش: <span style={{color:"#E9C46A",fontWeight:700}}>{rounds.filter(r=>r.type==="farsh").length}</span> | هند: <span style={{color:"#E63946",fontWeight:700}}>{rounds.filter(r=>r.type==="hand").length}</span></div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>أقل نقاط: <span style={{color:"#2A9D8F",fontWeight:700}}>{s[0].name} ({s[0].tot})</span></div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>أكثر نقاط: <span style={{color:"#E63946",fontWeight:700}}>{s[s.length-1].name} ({s[s.length-1].tot})</span></div>
        </div>
      </div>}

      <button onClick={onClose} style={{width:"100%",marginTop:12,padding:10,borderRadius:10,border:"none",background:"linear-gradient(135deg,#E9C46A,#F4A261)",color:"#1a1a2e",fontSize:15,fontWeight:700,cursor:"pointer"}}>إغلاق</button>
    </div>
  </div>);
}

/* ═══ MAIN ═══ */
export default function HandGame(){
  const[screen,setScreen]=useState("setup");const[step,setStep]=useState(1);
  const[players,setPlayers]=useState([{name:"",color:COLORS[0]},{name:"",color:COLORS[1]}]);
  const[rules,setRules]=useState({...DEF});
  const[rounds,setRounds]=useState([]);const[history,setHistory]=useState([]); // for undo
  const[cmt,setCmt]=useState(null);const[confetti,setConfetti]=useState(false);
  const[over,setOver]=useState(null);
  const[scoring,setScoring]=useState(false);const[voiceP,setVoiceP]=useState(false);
  const[confirmUndo,setConfirmUndo]=useState(false);
  const[muted,setMuted]=useState(false);
  const[showSummary,setShowSummary]=useState(false);
  const toggleMute=()=>{const nv=!muted;setMuted(nv);setVoiceMuted(nv);};

  const cur=rounds.length+1;const R=(k,v)=>setRules({...rules,[k]:v});
  const getT=useCallback((r=rounds)=>{const t={};players.forEach((_,i)=>{t[i]=r.reduce((s,rd)=>s+(rd.scores[i]||0),0);});return t;},[players,rounds]);
  const totals=getT();const sorted=players.map((p,i)=>({...p,idx:i,tot:totals[i]||0})).sort((a,b)=>a.tot-b.tot);

  const startGame=()=>{const n=players.map((p,i)=>({...p,name:p.name.trim()||("لاعب "+(i+1))}));setPlayers(n);setRounds([]);setHistory([]);setOver(null);setCmt(null);setStep(1);setScreen("game");};
  const newSession=()=>{setRounds([]);setHistory([]);setOver(null);setCmt(null);}; // same players & rules
  const reset=()=>{setScreen("setup");setStep(1);setRounds([]);setHistory([]);setCmt(null);setOver(null);};

  // UNDO last round
  const undoRound=()=>{
    if(rounds.length===0)return;
    setHistory(h=>[...h,rounds[rounds.length-1]]); // save undone round in history
    const nr=rounds.slice(0,-1);setRounds(nr);setOver(null);setConfetti(false);
    setCmt({text:"↩️ تم التراجع عن الجولة "+rounds.length,type:"close"});
    setConfirmUndo(false);
  };
  // REDO (restore undone round)
  const redoRound=()=>{
    if(history.length===0)return;
    const rd=history[history.length-1];
    setHistory(h=>h.slice(0,-1));
    setRounds(r=>[...r,rd]);
    setCmt({text:"↪️ تم استعادة الجولة "+(rounds.length+1),type:"close"});
  };

  /* ─── Submit Round ─── */
  const submitRound=rd=>{
    const nr=[...rounds,rd];setRounds(nr);setHistory([]);setScoring(false);const t=getT(nr);
    const s=players.map((_,i)=>({name:players[i].name,i,t:t[i]})).sort((a,b)=>a.t-b.t);
    const leader=s[0],last=s[s.length-1];const rn=nr.length;
    const tl=rd.type==="hand"?(rd.isSuperJoker?"هند سوبر جوكر":rd.isSuper?"هند سوبر":"هند"):rd.type==="farsh"?(rd.isSuper?"فرش سوبر":"فرش"):"";
    let sc="نتيجة الجولة "+rn+(tl?" - "+tl:"")+": ";
    players.forEach((p,i)=>{sc+=p.name+" "+(rd.scores[i]>0?"+":"")+rd.scores[i]+(i<players.length-1?"، ":"");});
    const DL=rules.dangerLimit||0;const dangerP=DL>0?s.filter(p=>p.t>=(DL-300)&&p.i!==leader.i):[];const overP=DL>0?s.filter(p=>p.t>=DL):[];
    let dA="";if(dangerP.length>0){dA="⚠️ ";dangerP.forEach(p=>{dA+=p.name+" باقي "+(DL-p.t)+" ويتعدى "+DL+"! ";});}
    if(overP.length>0){const w=leader.i,l=overP[overP.length-1].i;setOver({winner:w,loser:l});setConfetti(true);const ft=players[overP[overP.length-1].i].name+" تعدى "+DL+"! الفائز "+players[w].name+" بـ "+t[w];setCmt({text:"🏆 "+ft,type:"win"});sfx("win");setTimeout(()=>speakSafe(ft),300);setTimeout(()=>setConfetti(false),5000);return;}
    if(rn>=rules.totalRounds){const w=leader.i,l=last.i;setOver({winner:w,loser:l});setConfetti(true);const ft="انتهت! الفائز "+players[w].name+" بـ "+t[w];setCmt({text:"🏆 "+ft,type:"win"});sfx("win");setTimeout(()=>speakSafe(ft),300);setTimeout(()=>setConfetti(false),5000);return;}
    if(rn===rules.totalRounds-1){setCmt({text:"⚡ الجاية الأخيرة!"+(rules.noFarshLastRound?" ممنوع فرش!":"")+(dA?" "+dA:""),type:"close"});sfx("close");return;}
    if(dA){setCmt({text:dA,type:"lose"});return;}
    setCmt(null);
  };

  const base={direction:"rtl",fontFamily:"'Segoe UI',Tahoma,sans-serif",minHeight:"100vh",background:"linear-gradient(135deg,#0f0c29,#1a1a3e,#24243e)",color:"#fff",padding:16,position:"relative"};
  const card={maxWidth:440,margin:"14px auto",background:"rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",borderRadius:20,padding:"24px 18px",border:"1px solid rgba(255,255,255,0.1)"};

  /* ═══ SETUP ═══ */
  if(screen==="setup"){
    if(step===1)return(<div style={base}><div style={card}>
      <div style={{textAlign:"center",marginBottom:18}}><div style={{fontSize:48,marginBottom:3,animation:"float 3s ease-in-out infinite"}}>🃏</div><h1 style={{fontSize:24,fontWeight:800,margin:0,background:"linear-gradient(135deg,#E9C46A,#F4A261)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>شبة أبوفارس</h1></div>
      <Sec title="🎮 نوع اللعب"><div style={{display:"flex",gap:6}}><Opt label="فردي 👤" active={rules.gameMode==="individual"} onClick={()=>R("gameMode","individual")} color="#2A9D8F"/><Opt label="فريق 👥" active={rules.gameMode==="team"} onClick={()=>R("gameMode","team")} color="#457B9D"/></div></Sec>
      <Sec title="📝 التسجيل" sub={rules.scoringMode==="free"?"يدوي كل جولة":"فرش/هند مع حساب تلقائي"}><div style={{display:"flex",gap:6}}><Opt label="بقوانين" active={rules.scoringMode==="rules"} onClick={()=>R("scoringMode","rules")}/><Opt label="تسجيل حر" active={rules.scoringMode==="free"} onClick={()=>R("scoringMode","free")} color="#F4A261"/></div></Sec>
      <Sec title="🔄 عدد الجولات"><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{[5,7,10,15,20].map(n=><Opt key={n} label={""+n} active={rules.totalRounds===n} onClick={()=>R("totalRounds",n)}/>)}<input type="number" inputMode="numeric" value={rules.totalRounds} onChange={e=>R("totalRounds",parseInt(e.target.value)||10)} style={{width:44,padding:5,borderRadius:7,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",color:"#fff",fontSize:13,textAlign:"center",outline:"none"}}/></div></Sec>
      <Sec title="⚠️ حد النقاط" sub="تنتهي اللعبة لو أحد تعداه"><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{[1000,1500,2000,3000].map(n=><Opt key={n} label={""+n} active={rules.dangerLimit===n} onClick={()=>R("dangerLimit",n)}/>)}<Opt label="بدون" active={rules.dangerLimit===0} onClick={()=>R("dangerLimit",0)} color="#E63946"/></div></Sec>
      <Sec title="👤 اللاعبين"><div style={{display:"flex",justifyContent:"flex-end",marginBottom:3}}><span style={{fontSize:11,color:"rgba(255,255,255,0.25)"}}>{players.length}/8</span></div>
        {players.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><div style={{width:9,height:9,borderRadius:"50%",background:p.color,flexShrink:0}}/><input type="text" placeholder={"لاعب "+(i+1)} value={p.name} onChange={e=>{const n=[...players];n[i]={...n[i],name:e.target.value};setPlayers(n);}} style={{flex:1,padding:"7px 9px",borderRadius:8,border:"1px solid rgba(255,255,255,0.09)",background:"rgba(255,255,255,0.04)",color:"#fff",fontSize:14,outline:"none",direction:"rtl"}}/>{players.length>2&&<button onClick={()=>setPlayers(players.filter((_,j)=>j!==i))} style={{width:28,height:28,borderRadius:6,border:"1px solid rgba(255,255,255,0.05)",background:"rgba(230,57,70,0.08)",color:"#E63946",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>}</div>)}
        {players.length<8&&<button onClick={()=>setPlayers([...players,{name:"",color:COLORS[players.length%COLORS.length]}])} style={{width:"100%",padding:7,borderRadius:8,border:"1px dashed rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.3)",fontSize:12,cursor:"pointer"}}>+ إضافة لاعب</button>}
      </Sec>
      {rules.gameMode==="team"&&players.length>=4&&<Sec title="👥 الفرق"><button onClick={()=>{const t=[];for(let i=0;i<players.length;i+=2){t.push({name:"فريق "+(t.length+1),members:i+1<players.length?[i,i+1]:[i]});}R("teams",t);}} style={{width:"100%",padding:7,borderRadius:8,border:"1px solid rgba(69,123,157,0.2)",background:"rgba(69,123,157,0.05)",color:"#457B9D",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:4}}>تقسيم تلقائي ⚡</button>{rules.teams?.map((tm,ti)=><div key={ti} style={{background:"rgba(255,255,255,0.015)",borderRadius:6,padding:5,marginBottom:3,border:"1px solid rgba(255,255,255,0.03)"}}><input type="text" value={tm.name} onChange={e=>{const t=[...rules.teams];t[ti]={...t[ti],name:e.target.value};R("teams",t);}} style={{width:"100%",padding:"4px 6px",borderRadius:4,border:"1px solid rgba(255,255,255,0.05)",background:"transparent",color:"#E9C46A",fontSize:12,fontWeight:600,outline:"none",direction:"rtl",boxSizing:"border-box"}}/><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{tm.members.map(mi=>(players[mi]?.name?.trim())||("لاعب "+(mi+1))).join(" + ")}</div></div>)}</Sec>}
      <button onClick={()=>setVoiceP(true)} style={{width:"100%",padding:7,borderRadius:8,border:"1px solid rgba(233,196,106,0.12)",background:"rgba(233,196,106,0.02)",color:"#E9C46A",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:7}}>🔊 {getEl().on?"ElevenLabs ✅":"الصوت"}</button>
      {rules.scoringMode==="rules"?<button onClick={()=>setStep(2)} style={{width:"100%",padding:11,borderRadius:10,border:"none",background:"linear-gradient(135deg,#E9C46A,#F4A261)",color:"#1a1a2e",fontSize:15,fontWeight:700,cursor:"pointer"}}>التالي ➜ قوانين النقاط</button>:<button onClick={startGame} style={{width:"100%",padding:11,borderRadius:10,border:"none",background:"linear-gradient(135deg,#2A9D8F,#264653)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>ابدأ 🎴</button>}
    </div>{voiceP&&<VoiceSettings onClose={()=>setVoiceP(false)}/>}<style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style></div>);

    return(<div style={base}><div style={card}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><button onClick={()=>setStep(1)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",color:"#fff",padding:"4px 9px",borderRadius:6,fontSize:12,cursor:"pointer"}}>← رجوع</button><h3 style={{fontSize:16,fontWeight:700,color:"#E9C46A",margin:0}}>⚙️ قوانين النقاط</h3><div/></div>
      <Tog label="🃏 الفرش" value={rules.farshAllowed} onChange={v=>R("farshAllowed",v)}/>{rules.farshAllowed&&<Box><NumIn label="نقاط الفارش" value={rules.farshScore} onChange={v=>R("farshScore",v)}/><NumIn label="نقاط الباقي" value={rules.farshOthersScore} onChange={v=>R("farshOthersScore",v)}/><NumIn label="اللي انأخذت منه" value={rules.farshStolenScore} onChange={v=>R("farshStolenScore",v)}/></Box>}
      <div style={{marginBottom:4}}><label style={{fontSize:14,fontWeight:700,color:"rgba(255,255,255,0.6)"}}>✋ الهند</label></div>
      <Box><NumIn label="نقاط الهاند" value={rules.handScore} onChange={v=>R("handScore",v)}/><NumIn label="نقاط الباقي" value={rules.handOthersScore} onChange={v=>R("handOthersScore",v)}/><NumIn label="الجزاء الزيادة" value={rules.handPenaltyExtra} onChange={v=>R("handPenaltyExtra",v)}/></Box>
      <Tog label="🚫 ممنوع فرش بآخر جولة" value={rules.noFarshLastRound} onChange={v=>R("noFarshLastRound",v)}/>
      <button onClick={startGame} style={{width:"100%",padding:11,borderRadius:10,border:"none",background:"linear-gradient(135deg,#2A9D8F,#264653)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:3}}>ابدأ 🎴</button>
    </div></div>);
  }

  /* ═══ GAME ═══ */
  const isLast=cur>=rules.totalRounds;const prog=(rounds.length/rules.totalRounds)*100;
  const cmtS=t=>t==="win"?{background:"linear-gradient(135deg,rgba(42,157,143,0.14),rgba(42,157,143,0.02))",border:"1px solid rgba(42,157,143,0.2)"}:t==="lose"?{background:"linear-gradient(135deg,rgba(230,57,70,0.14),rgba(230,57,70,0.02))",border:"1px solid rgba(230,57,70,0.2)"}:{background:"linear-gradient(135deg,rgba(233,196,106,0.14),rgba(233,196,106,0.02))",border:"1px solid rgba(233,196,106,0.2)"};

  return(<div style={base}>
    {confetti&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:100}}>{Array.from({length:30}).map((_,i)=><div key={i} style={{position:"absolute",top:-10,borderRadius:2,left:Math.random()*100+"%",animationDelay:Math.random()*2+"s",animationDuration:2+Math.random()*2+"s",backgroundColor:COLORS[i%COLORS.length],width:6+Math.random()*7+"px",height:6+Math.random()*7+"px",animation:"confettiFall linear forwards"}}/>)}</div>}
    {scoring&&<ScoringModal players={players} rules={{...rules,farshAllowed:rules.farshAllowed&&!(rules.noFarshLastRound&&isLast)}} curRound={cur} totals={totals} onSubmit={submitRound} onCancel={()=>setScoring(false)}/>}
    {voiceP&&<VoiceSettings onClose={()=>setVoiceP(false)}/>}
    {showSummary&&<SummaryModal players={players} totals={totals} rules={rules} rounds={rounds} onClose={()=>setShowSummary(false)}/>}

    {/* Confirm Undo Dialog */}
    {confirmUndo&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:"linear-gradient(135deg,#1a1a3e,#24243e)",borderRadius:16,padding:20,border:"1px solid rgba(255,255,255,0.1)",direction:"rtl",color:"#fff",maxWidth:320,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:8}}>↩️</div>
        <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 6px"}}>تراجع عن الجولة {rounds.length}؟</h3>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:"0 0 14px"}}>بيتم حذف نتيجة آخر جولة وترجع للحالة اللي قبلها</p>
        <div style={{display:"flex",gap:6}}>
          <button onClick={undoRound} style={{flex:1,padding:10,borderRadius:9,border:"none",background:"linear-gradient(135deg,#E63946,#c62828)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>تراجع ↩️</button>
          <button onClick={()=>setConfirmUndo(false)} style={{flex:1,padding:10,borderRadius:9,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#fff",fontSize:14,cursor:"pointer"}}>إلغاء</button>
        </div>
      </div>
    </div>}

    {/* Header */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:600,margin:"0 auto 8px"}}>
      <button onClick={reset} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.06)",color:"#fff",padding:"5px 9px",borderRadius:7,fontSize:12,cursor:"pointer"}}>← رجوع</button>
      <h2 style={{fontSize:18,fontWeight:700,margin:0}}>🃏 الهند</h2>
      <div style={{display:"flex",gap:4,alignItems:"center"}}>
        {rounds.length>0&&<button onClick={()=>setShowSummary(true)} style={{background:"linear-gradient(135deg,rgba(233,196,106,0.1),rgba(244,162,97,0.06))",border:"1px solid rgba(233,196,106,0.2)",color:"#E9C46A",padding:"4px 9px",borderRadius:6,fontSize:12,fontWeight:700,cursor:"pointer"}}>📊 ملخص</button>}
        <button onClick={()=>setVoiceP(true)} style={{background:"rgba(233,196,106,0.05)",border:"1px solid rgba(233,196,106,0.1)",color:"#E9C46A",padding:"4px 7px",borderRadius:6,fontSize:13,cursor:"pointer"}}>⚙️</button>
        <button onClick={toggleMute} style={{background:muted?"rgba(230,57,70,0.1)":"rgba(42,157,143,0.08)",border:"1px solid "+(muted?"rgba(230,57,70,0.2)":"rgba(42,157,143,0.15)"),color:muted?"#E63946":"#2A9D8F",padding:"4px 7px",borderRadius:6,fontSize:13,cursor:"pointer"}}>{muted?"🔇":"🔊"}</button>
        <div style={{background:"rgba(233,196,106,0.08)",color:"#E9C46A",padding:"3px 9px",borderRadius:12,fontSize:12,fontWeight:600}}>{cur<=rules.totalRounds?cur+"/"+rules.totalRounds:"انتهت"}</div>
      </div></div>

    {/* Progress */}
    <div style={{maxWidth:600,margin:"0 auto 8px"}}><div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.04)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,width:prog+"%",background:prog>=90?"#E63946":"linear-gradient(90deg,#2A9D8F,#E9C46A)",transition:"width .5s"}}/></div>
    {isLast&&!over&&<div style={{textAlign:"center",marginTop:4,color:"#E63946",fontSize:12,fontWeight:700}}>⚡ الأخيرة{rules.noFarshLastRound&&rules.scoringMode==="rules"?" - ممنوع فرش!":""}</div>}</div>

    {/* Undo/Redo bar */}
    {rounds.length>0&&!over&&<div style={{maxWidth:600,margin:"0 auto 8px",display:"flex",gap:5,justifyContent:"center"}}>
      <button onClick={()=>setConfirmUndo(true)} style={{padding:"5px 14px",borderRadius:8,border:"1px solid rgba(230,57,70,0.2)",background:"rgba(230,57,70,0.06)",color:"#E63946",fontSize:13,fontWeight:600,cursor:"pointer"}}>↩️ تراجع عن جولة {rounds.length}</button>
      {history.length>0&&<button onClick={redoRound} style={{padding:"5px 14px",borderRadius:8,border:"1px solid rgba(42,157,143,0.2)",background:"rgba(42,157,143,0.06)",color:"#2A9D8F",fontSize:13,fontWeight:600,cursor:"pointer"}}>↪️ استعادة</button>}
    </div>}

    {/* Commentary */}
    {cmt&&<div style={{maxWidth:600,margin:"0 auto 8px",padding:"10px 13px",borderRadius:10,textAlign:"center",animation:"slideIn .3s",...cmtS(cmt.type)}}><div style={{fontSize:14,fontWeight:600,lineHeight:1.7}}>{cmt.text}</div></div>}

    {/* Scoreboard */}
    <div style={{maxWidth:600,margin:"0 auto 8px",background:"rgba(255,255,255,0.04)",borderRadius:13,padding:12,border:"1px solid rgba(255,255,255,0.05)"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:15,fontWeight:700,color:"rgba(255,255,255,0.65)"}}>الترتيب</span><span style={{fontSize:12,color:"rgba(255,255,255,0.28)"}}>جولة {rounds.length}/{rules.totalRounds}</span></div>
      {sorted.map((p,rank)=>{const ld=rank===0&&rounds.length>0;return(<div key={p.idx} style={{marginBottom:5,padding:"7px 8px",borderRadius:8,background:ld?"rgba(42,157,143,0.06)":"rgba(255,255,255,0.015)",...(ld?{border:"1px solid rgba(42,157,143,0.08)"}:{}),transition:"all 0.5s ease",animation:"slideIn 0.3s ease"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:15,fontWeight:700,minWidth:18,textAlign:"center"}}>{ld?"👑":rank+1}</span><div style={{width:7,height:7,borderRadius:"50%",background:p.color}}/><span style={{fontSize:14,fontWeight:600}}>{p.name}</span></div><span style={{fontSize:18,fontWeight:800,color:p.tot<0?"#2A9D8F":"#fff"}}>{p.tot}</span></div></div>);})}
    </div>



    {/* Add round button */}
    {!over&&<div style={{maxWidth:600,margin:"0 auto 10px"}}><button onClick={()=>setScoring(true)} style={{width:"100%",padding:12,borderRadius:11,border:"none",background:"linear-gradient(135deg,#E9C46A,#F4A261)",color:"#1a1a2e",fontSize:16,fontWeight:700,cursor:"pointer"}}>+ سجّل جولة {cur} {isLast?"(الأخيرة ⚡)":""}</button></div>}

    {/* Game Over */}
    {over&&<div style={{maxWidth:600,margin:"0 auto 10px"}}><div style={{textAlign:"center",background:"linear-gradient(135deg,rgba(42,157,143,0.08),rgba(233,196,106,0.06))",borderRadius:15,padding:"24px 14px",border:"1px solid rgba(233,196,106,0.12)"}}>
      <div style={{fontSize:52,animation:"pulse 2s ease-in-out infinite"}}>🏆</div>
      <h2 style={{fontSize:22,fontWeight:800,margin:"4px 0 1px",background:"linear-gradient(135deg,#E9C46A,#F4A261)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{players[over.winner].name}</h2>
      <p style={{fontSize:15,color:"rgba(255,255,255,0.45)",margin:"0 0 14px"}}>بطل الجلسة!</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:16,padding:"6px 10px",borderRadius:8,background:"rgba(230,57,70,0.06)",border:"1px solid rgba(230,57,70,0.08)"}}><span style={{fontSize:16}}>😂</span><span style={{fontSize:13,color:"rgba(255,255,255,0.55)"}}>{players[over.loser].name} جاب العيد بـ {totals[over.loser]}</span></div>
      <div style={{display:"flex",gap:6,marginBottom:8}}>
        <button onClick={newSession} style={{flex:1,padding:9,borderRadius:9,border:"none",background:"linear-gradient(135deg,#2A9D8F,#264653)",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>🔄 جولة جديدة</button>
        <button onClick={reset} style={{flex:1,padding:9,borderRadius:9,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"#fff",fontSize:14,cursor:"pointer"}}>⚙️ تغيير إعدادات</button>
      </div>
      <button onClick={()=>setConfirmUndo(true)} style={{width:"100%",padding:8,borderRadius:8,border:"1px solid rgba(230,57,70,0.15)",background:"rgba(230,57,70,0.04)",color:"#E63946",fontSize:13,fontWeight:600,cursor:"pointer"}}>↩️ تراجع عن آخر جولة (خطأ؟)</button>
    </div></div>}

    {/* History */}
    {rounds.length>0&&<div style={{maxWidth:600,margin:"0 auto 14px",background:"rgba(255,255,255,0.02)",borderRadius:12,padding:12,border:"1px solid rgba(255,255,255,0.03)"}}>
      <h3 style={{fontSize:14,fontWeight:600,margin:"0 0 7px",color:"rgba(255,255,255,0.4)"}}>سجل الجولات</h3>
      <div style={{overflowX:"auto"}}>
        <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.05)",paddingBottom:4,marginBottom:2}}>
          <span style={{flex:"0 0 24px",textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.35)"}}>#</span>
          {rules.scoringMode==="rules"&&<span style={{flex:"0 0 36px",textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.35)"}}>النوع</span>}
          {players.map((p,i)=><span key={i} style={{flex:1,textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.35)"}}>{p.name}</span>)}
        </div>
        {rounds.map((rd,ri)=><div key={ri} style={{display:"flex",padding:"2px 0",...(ri%2===0?{background:"rgba(255,255,255,0.01)"}:{})}}>
          <span style={{flex:"0 0 24px",textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.35)"}}>{ri+1}</span>
          {rules.scoringMode==="rules"&&<span style={{flex:"0 0 36px",textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.3)"}}>{rd.type==="hand"?(rd.isSuperJoker?"جوكر🃏":rd.isSuper?"هند🔥":"هند"):rd.type==="farsh"?(rd.isSuper?"فرش🔥":"فرش"):"—"}</span>}
          {players.map((_,pi)=>{const v=rd.scores[pi]||0;return<span key={pi} style={{flex:1,textAlign:"center",fontSize:12,fontWeight:700,color:v<0?"#2A9D8F":v>=200?"#E63946":"rgba(255,255,255,0.45)"}}>{v}</span>;})}
        </div>)}
        <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:4,marginTop:2}}>
          <span style={{flex:"0 0 24px",textAlign:"center",fontSize:11,fontWeight:800}}>∑</span>
          {rules.scoringMode==="rules"&&<span style={{flex:"0 0 36px"}}/>}
          {players.map((_,i)=><span key={i} style={{flex:1,textAlign:"center",fontSize:13,fontWeight:800,color:totals[i]<0?"#2A9D8F":"#fff"}}>{totals[i]}</span>)}
        </div></div>
    </div>}

    <style>{`
      @keyframes confettiFall{0%{transform:translateY(-100vh) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      @keyframes slideIn{0%{transform:translateY(-16px);opacity:0}100%{transform:translateY(0);opacity:1}}
      @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
      input[type="number"]{-moz-appearance:textfield}
    `}</style>
  </div>);
}
