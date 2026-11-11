(() => {
"use strict";
const $=id=>document.getElementById(id), A=window.LUNA, Lf=window.L;
if(!A)return;
const R=1737.4, rad=d=>d*Math.PI/180, deg=r=>r*180/Math.PI;
const fmt=(n,d=1)=>Number.isFinite(n)?n.toFixed(d):"—";
const S=()=>A.sites, Rs=()=>A.results, wrap=l=>((l+540)%360)-180;
let map,lay={},picked,last,top=null,tileOK=0,tileErr=0;

/* ---------- geometry ---------- */
function gc(a,b){const p1=rad(a.lat),p2=rad(b.lat),dl=rad(b.lon-a.lon),h=Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
 const y=Math.sin(dl)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);
 return{km:2*R*Math.asin(Math.min(1,Math.sqrt(h))),brg:(deg(Math.atan2(y,x))+360)%360}}
const sunMax=lat=>91.54-Math.abs(lat);
function earthMax(lat,lon){let best=-90;const f=rad(lat);
 for(let b=-6.7;b<=6.71;b+=.5)for(let l=-7.9;l<=7.91;l+=.5){const s=Math.sin(f)*Math.sin(rad(b))+Math.cos(f)*Math.cos(rad(b))*Math.cos(rad(lon-l));best=Math.max(best,deg(Math.asin(s)))}
 return best}

/* ---------- real map ---------- */
function warn(t){const w=$("mapWarn");if(w){w.innerHTML="<b>Map notice</b><p>"+t+"</p>";w.classList.remove("off")}}
function initMap(){
 const el=$("realMap");if(!el)return;
 if(!Lf){warn("Leaflet did not load. Check internet access. The Polar plot still works.");return}
 map=Lf.map(el,{crs:Lf.CRS.EPSG4326,center:[-86,0],zoom:4,minZoom:2,maxZoom:9});
 const wac=Lf.tileLayer("https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
  {maxNativeZoom:7,maxZoom:9,noWrap:true,attribution:"Imagery: NASA/GSFC/ASU LRO WAC via NASA Moon Trek"}).addTo(map);
 wac.on("tileload",()=>tileOK++);
 wac.on("tileerror",()=>{if(++tileErr>=4&&!tileOK)warn("NASA Moon Trek tiles did not load (offline or blocked). Open the Polar plot, or use the NASA Moon Trek link.")});
 lay.grat=Lf.layerGroup().addTo(map);
 [-80,-82,-84,-86,-88].forEach(l=>{const edge=l===-80;
  Lf.polyline([[l,-180],[l,180]],{color:edge?"#e5bd77":"#79d7e5",weight:edge?1.6:.7,opacity:.65,dashArray:edge?"6 4":null,interactive:false}).addTo(lay.grat);
  Lf.marker([l,-175],{icon:Lf.divIcon({className:"lbl",html:Math.abs(l)+"°S"+(edge?" · LOLA 80S limit":"")}),interactive:false}).addTo(lay.grat)});
 for(let g=-180;g<180;g+=30)Lf.polyline([[-90,g],[-80,g]],{color:"#79d7e5",weight:.6,opacity:.4,interactive:false}).addTo(lay.grat);
 lay.sites=Lf.layerGroup().addTo(map); lay.tr=Lf.layerGroup().addTo(map); lay.ref=Lf.layerGroup().addTo(map);
 Lf.circleMarker([-84.79,29.2],{radius:5,color:"#ff9f80",weight:2,fillOpacity:.2}).bindTooltip("IM-2 Athena landing area (approximate, reference only)").addTo(lay.ref);
 Lf.control.layers({"LRO WAC · NASA Moon Trek":wac},{"Candidates":lay.sites,"Graticule":lay.grat,"Traverse":lay.tr,"Reference landing":lay.ref}).addTo(map);
 const cur=Lf.control({position:"bottomleft"});
 cur.onAdd=()=>{const d=Lf.DomUtil.create("div","cursor");d.textContent="Hover for coordinates";map.on("mousemove",e=>d.textContent=fmt(e.latlng.lat,3)+"°, "+fmt(wrap(e.latlng.lng),3)+"°");return d};cur.addTo(map);
 map.on("click",e=>{const lat=e.latlng.lat,lon=wrap(e.latlng.lng);
  if(lat>-80){A.toast("Pick a point south of 80°S (LOLA coverage).");return}
  $("lat").value=lat.toFixed(4);$("lon").value=lon.toFixed(4);
  $("coordReadout").textContent=`${fmt(Math.abs(lat),4)}° S, ${fmt(Math.abs(lon),4)}° ${lon<0?"W":"E"} (picked, not saved)`;
  if(picked)picked.setLatLng(e.latlng);else picked=Lf.circleMarker(e.latlng,{radius:7,color:"#fff",weight:2,fillOpacity:0,dashArray:"3 3"}).addTo(map);
  A.toast("Point picked. Press Update coordinates or Save as new candidate.")});
}
function drawSites(){
 if(!map)return;lay.sites.clearLayers();const cols=["#e6b76d","#73d8c1","#a9a2f1"];
 S().forEach((s,i)=>{const sel=s.id===A.selected,r=Rs()[s.id];
  Lf.circleMarker([s.lat,s.lon],{radius:sel?10:7,color:sel?"#fff":cols[i%3],weight:sel?3:2,fillColor:cols[i%3],fillOpacity:.9})
   .bindTooltip(`<b>${A.safe(s.name)}</b><br>${fmt(s.lat,3)}°, ${fmt(s.lon,3)}°<br>${r&&r.slope!=null?"LOLA slope "+fmt(r.slope,2)+"°":"Not sampled"}`,{direction:"top"})
   .on("click",()=>A.select(s.id)).addTo(lay.sites)})}

/* ---------- traverse ---------- */
function renderTraverse(){
 const f=$("trFrom"),t=$("trTo"),o=S().map(s=>`<option value="${s.id}">${A.safe(s.name)}</option>`).join(""),pf=f.value,pt=t.value,has=v=>S().some(s=>s.id===v);
 f.innerHTML=o;t.innerHTML=o;f.value=has(pf)?pf:S()[0]?.id;t.value=has(pt)?pt:(S()[1]||S()[0])?.id;calcTraverse()}
function calcTraverse(){
 const a=S().find(s=>s.id===$("trFrom").value),b=S().find(s=>s.id===$("trTo").value),out=$("trOut");if(!a||!b)return;
 if(lay.tr)lay.tr.clearLayers();
 if(a.id===b.id){out.innerHTML="<small>Choose two different candidates.</small>";return}
 const g=gc(a,b),sp=Math.max(+$("trSpeed").value||1,.1),w=Math.max(+$("trWind").value||1,1),path=g.km*w,hrs=path/sp;
 out.innerHTML=`<small>STRAIGHT-LINE DISTANCE</small><strong>${fmt(g.km,2)} km</strong><small>INITIAL BEARING (FROM NORTH)</small><strong>${fmt(g.brg,1)}°</strong><small>ESTIMATED PATH · FACTOR ${w}</small><strong>${fmt(path,2)} km</strong><small>DRIVE TIME AT ${sp} KM/H</small><strong>${Math.floor(hrs)} h ${Math.round((hrs%1)*60)} min</strong><p class="muted">Geometry only. It does not know slopes, craters, boulders or shadows.</p>`;
 if(map)Lf.polyline([[a.lat,a.lon],[b.lat,b.lon]],{color:"#fff",weight:2,dashArray:"6 6"}).bindTooltip(fmt(g.km,2)+" km (schematic line)").addTo(lay.tr)}

/* ---------- visibility ---------- */
function renderVis(){
 $("visOut").innerHTML=`<table style="min-width:340px"><thead><tr><th>Candidate</th><th>Sun ceiling</th><th>Earth ceiling</th></tr></thead><tbody>${S().map(s=>{const e=earthMax(s.lat,s.lon);return `<tr><td>${A.safe(s.name)}</td><td>${fmt(sunMax(s.lat))}°</td><td>${e<0?"below horizon":fmt(e)+"°"}</td></tr>`}).join("")}</tbody></table><p class="muted">Upper bounds for flat terrain with no horizon masking. Sun: 90° − (|lat| − 1.54°). Earth: best case across libration of about ±6.7° latitude and ±7.9° longitude. Real ridges and crater walls lower these. This is not an illumination or link-budget prediction.</p>`}

/* ---------- decision matrix ---------- */
const W={slope:3,error:2,sun:2,earth:2};
const CR={slope:{n:"Low LOLA slope",low:1,v:(s,r)=>r?.slope},error:{n:"Low elevation error",low:1,v:(s,r)=>r?.error},sun:{n:"High sun ceiling",v:s=>sunMax(s.lat)},earth:{n:"High Earth ceiling",v:s=>earthMax(s.lat,s.lon)}};
function buildWeights(){
 $("weights").innerHTML=Object.keys(CR).map(k=>`<label>${CR[k].n}<output id="o_${k}">${W[k]}</output><input type="range" min="0" max="5" value="${W[k]}" data-w="${k}"></label>`).join("");
 $("weights").oninput=e=>{const k=e.target.dataset.w;if(!k)return;W[k]=+e.target.value;$("o_"+k).textContent=W[k];renderRank()}}
function renderRank(){
 const all=Object.keys(CR),rows=S().map(s=>{const r=Rs()[s.id]||{},v={};all.forEach(k=>v[k]=CR[k].v(s,r));return{s,r,v}});
 const act=all.filter(k=>W[k]>0&&rows.length&&rows.every(x=>Number.isFinite(x.v[k]))),skipped=all.filter(k=>W[k]>0&&!act.includes(k)),tw=act.reduce((a,k)=>a+W[k],0);
 act.forEach(k=>{const a=rows.map(x=>x.v[k]),lo=Math.min(...a),hi=Math.max(...a);rows.forEach(x=>{const n=hi===lo?.5:(x.v[k]-lo)/(hi-lo);(x.n=x.n||{})[k]=CR[k].low?1-n:n})});
 rows.forEach(x=>x.score=rows.length<2||!tw?null:100*act.reduce((a,k)=>a+W[k]*x.n[k],0)/tw);
 rows.sort((a,b)=>(b.score??-1)-(a.score??-1));top=rows.length>1&&rows[0].score!=null?rows[0]:null;
 window.LUNA_RANK={rows,act,skipped,labels:CR};
 const st=!tw?"Set a weight above 0":skipped.length?"Provisional":"Ranked";
 $("rankRows").innerHTML=rows.map((x,i)=>{const sc=x.score;return `<tr><td>${sc!=null?i+1:"—"}</td><td>${A.safe(x.s.name)}</td><td>${sc!=null?`<div class="bar"><i style="width:${sc.toFixed(0)}%"></i></div>${fmt(sc,0)}`:"—"}</td><td>${x.r.slope!=null?fmt(x.r.slope,2)+"°":"—"}</td><td>${x.r.error!=null?fmt(x.r.error,2)+" m":"—"}</td><td>${fmt(x.v.sun)}°</td><td>${x.v.earth<0?"below":fmt(x.v.earth)+"°"}</td><td>${st}</td></tr>`}).join("");
 if(!$("rankNote"))$("rankRows").closest(".table-wrap").insertAdjacentHTML("afterend",'<p id="rankNote" class="muted"></p>');
 $("rankNote").textContent=skipped.length?"Provisional: "+skipped.map(k=>CR[k].n).join(" and ")+" left out until every candidate has a NASA LOLA sample (NASA data hub → import, or Retrieve all).":"All weighted criteria use measured or computed values for every candidate."}

/* ---------- exports, sharing ---------- */
function dl(name,txt,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function geojson(){return JSON.stringify({type:"FeatureCollection",features:S().map(s=>{const r=Rs()[s.id]||{};
 return{type:"Feature",geometry:{type:"Point",coordinates:[s.lon,s.lat]},properties:{name:s.name,elevation_m:r.elevation??null,slope_deg:r.slope??null,elevation_error_m:r.error??null,status:r.status||"Not sampled",source:r.source||null,sampled_at:r.timestamp||null}}}),
 generator:"LUNA NAV 2.0",note:"Not for operational landing decisions."},null,2)}
function shareUrl(){const j=JSON.stringify(S().map(({id,name,lat,lon})=>({id,name,lat,lon})));return location.origin+location.pathname+"?w="+encodeURIComponent(btoa(unescape(encodeURIComponent(j))))+"#map"}
function importShared(){
 const w=new URLSearchParams(location.search).get("w");if(!w)return;
 try{const a=JSON.parse(decodeURIComponent(escape(atob(w))));
  const c=(Array.isArray(a)?a:[]).slice(0,40).filter(s=>s&&/^[\w-]{1,40}$/.test(s.id)&&Number.isFinite(s.lat)&&s.lat<=-80&&s.lat>=-90&&Number.isFinite(s.lon)&&s.lon>=-180&&s.lon<=180)
   .map(s=>({id:s.id,name:String(s.name||"Shared candidate").slice(0,60),lat:s.lat,lon:s.lon}));
  if(!c.length)return;
  S().splice(0,S().length,...c);Object.keys(Rs()).forEach(k=>delete Rs()[k]);A.save();A.select(c[0].id);A.toast("Shared workspace loaded. LOLA samples must be retrieved again.")}catch(e){console.warn("Share link ignored",e)}}

/* ---------- assistant ---------- */
LUNA_ANSWERS.unshift(
 [/traverse|distance|rover|\bdrive\b/,"The Mission lab computes great-circle distance on a 1,737.4 km sphere, the initial bearing and a drive time from your speed and path winding factor. It is geometry only: it does not know slopes, craters, boulders or shadows, so treat it as a first-order planning number."],
 [/\bsun\b|illuminat|shadow|\bpsr\b|permanent/,"Near the pole the Sun stays within a few degrees of the horizon, so terrain decides illumination. Permanently shadowed regions (PSRs) get no direct sunlight. This app shows only a flat-terrain sun ceiling (90° − (|lat| − 1.54°)). For real illumination use NASA Moon Trek and LOLA-derived illumination products."],
 [/earth|communicat|relay|visib|line of sight/,"Earth sits low near the horizon from the south pole and moves with libration. The Mission lab gives a flat-terrain Earth ceiling using about ±6.7° latitude and ±7.9° longitude libration. A real link also depends on local horizon, relay assets and antenna design."],
 [/\bice\b|water|volatile|cold trap/,"Some permanently shadowed, very cold areas can trap volatiles, and missions such as LCROSS reported water in a polar crater plume. How much ice exists, in what form and where is still uncertain. LUNA NAV does not estimate ice; it supplies terrain context."],
 [/artemis|landing region|13 region/,"In 2022 NASA named 13 candidate Artemis III landing regions near the south pole, including Faustini Rim A, Haworth, Malapert Massif, Leibnitz Beta Plateau, Nobile Rims, de Gerlache Rim 2, the Connecting Ridge areas, Peak Near Cabeus B, Slater Plain and Amundsen Rim. Mission plans change, so check NASA for current status."],
 [/rank|\bbest\b|winner|decision|score|weight/,()=>top?`Under your current weights, ${top.s.name} ranks first among your rankable candidates (score ${fmt(top.score,0)} of 100). That is a relative ranking built from retrieved LOLA slope and error plus idealised sun and Earth ceilings. It is not a landing-safety verdict.`:"Open the Mission lab and set weights. Ranking needs at least two candidates that have every weighted input; slope and error need a retrieved LOLA sample."],
 [/real map|moon trek|\bwac\b|imagery|\bmap\b/,"The Lunar map tab streams NASA/GSFC/ASU LRO WAC imagery from NASA Moon Trek in an equirectangular projection, which stretches east–west near the pole. Click anywhere south of 80°S to pick coordinates, or switch to the Polar plot for true polar geometry."]
);

/* ---------- wiring ---------- */
function refresh(){
 drawSites();renderTraverse();renderVis();renderRank();
 if(map&&A.selected!==last){last=A.selected;const s=S().find(x=>x.id===A.selected);if(s&&location.hash==="#map")map.setView([s.lat,s.lon],Math.max(map.getZoom(),5))}}
function init(){
 initMap();buildWeights();
 $("exportCsv").insertAdjacentHTML("afterend",'<button class="btn ghost wide" id="exportGeo">Export GeoJSON (GIS-ready)</button><button class="btn ghost wide" id="shareLink">Copy share link</button>');
 $("exportGeo").onclick=()=>dl("luna-nav-candidates.geojson",geojson(),"application/geo+json");
 $("shareLink").onclick=()=>{const u=shareUrl();(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>A.toast("Share link copied.")).catch(()=>window.prompt("Copy this link:",u))};
 $("resetMap").insertAdjacentHTML("afterend",'<button class="btn ghost" id="zoomSel">◎ Zoom to selected</button>');
 $("zoomSel").onclick=()=>{const s=S().find(x=>x.id===A.selected);if(map&&s)map.setView([s.lat,s.lon],6)};
 $("zoomIn").addEventListener("click",()=>map&&map.zoomIn());$("zoomOut").addEventListener("click",()=>map&&map.zoomOut());$("resetMap").addEventListener("click",()=>map&&map.setView([-86,0],4));
 ["trFrom","trTo","trSpeed","trWind"].forEach(id=>$(id).addEventListener("input",calcTraverse));
 const cv=$("polarCanvas");cv.classList.add("off");
 document.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>{const real=b.dataset.view==="real";
  document.querySelectorAll(".seg button").forEach(x=>x.classList.toggle("on",x===b));
  $("realMap").classList.toggle("off",!real);cv.classList.toggle("off",real);if(real&&map)setTimeout(()=>map.invalidateSize(),50)});
 window.addEventListener("hashchange",()=>{if(location.hash==="#map"&&map)setTimeout(()=>map.invalidateSize(),80)});
 window.addEventListener("luna:update",refresh);
 importShared();refresh();if(map)setTimeout(()=>map.invalidateSize(),150)}
init();
})();
