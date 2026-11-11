(() => {
"use strict";
const $=id=>document.getElementById(id),A=window.LUNA;if(!A)return;
const esc=A.safe,S=()=>A.sites,R=()=>A.results,f=(n,d=2,u="")=>Number.isFinite(n)?n.toFixed(d)+u:"—";
const BASE="https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/";
const P={elevation:"LDEM_80S_80MPP_ADJ.TIF",slope:"LDSM_80S_80MPP_ADJ.TIF",error:"LDEM_80S_80MPP_ADJ_ERR.TIF",slopeError:"LDSM_80S_80MPP_ADJ_ERR.TIF"};
const SOURCES=[
{n:"LOLA south-pole DEM, slope and error",d:"Cloud-optimized GeoTIFFs from NASA Goddard PGDA, 80°S–90°S. Source of elevation, slope and uncertainty.",u:"https://pgda.gsfc.nasa.gov/products/90",t:"cog"},
{n:"NASA Moon Trek",d:"LRO WAC imagery tiles and the official lunar web portal.",u:"https://trek.nasa.gov/moon/",t:"tile"},
{n:"NASA Image and Video Library",d:"Key-free API for NASA photos. Powers the site gallery below.",u:"https://images.nasa.gov/",t:"api"},
{n:"PDS Geosciences Node · LOLA",d:"Archive of raw LOLA data records.",u:"https://pds-geosciences.wustl.edu/missions/lro/lola.htm"},
{n:"Lunar Orbital Data Explorer (ODE)",d:"Search and download LRO and other lunar orbiter products.",u:"https://ode.rsl.wustl.edu/moon/"},
{n:"Lunar Reconnaissance Orbiter",d:"Mission home for LOLA, LROC and Diviner.",u:"https://science.nasa.gov/mission/lro/"},
{n:"JPL NAIF SPICE",d:"Ephemerides for exact Sun and Earth geometry (planned upgrade for the ceilings).",u:"https://naif.jpl.nasa.gov/naif/"},
{n:"JPL Horizons",d:"Online ephemeris service for Sun and Earth positions.",u:"https://ssd.jpl.nasa.gov/horizons/"},
{n:"NASA Space Apps Challenge",d:"Challenge pages and resources.",u:"https://www.spaceappschallenge.org/"}];
let PRE={samples:[]};
const stereo=(lat,lon)=>{const R0=1737400,p=Math.abs(lat)*Math.PI/180,r=2*R0*Math.tan((Math.PI/2-p)/2),l=lon*Math.PI/180;return[r*Math.sin(l),r*Math.cos(l)]};
const imgs={};
const img=u=>imgs[u]||(imgs[u]=GeoTIFF.fromUrl(u,{allowFullFile:false}).then(t=>t.getImage()).catch(e=>{delete imgs[u];throw e}));
const bad=(m,kind)=>Object.assign(Error(m),{kind});
async function val(file,x,y){if(!window.GeoTIFF)throw bad("GeoTIFF library did not load","lib");const im=await img(BASE+file),o=im.getOrigin(),r=im.getResolution(),px=Math.round((x-o[0])/r[0]),py=Math.round((y-o[1])/r[1]);
 if(px<0||py<0||px>=im.getWidth()||py>=im.getHeight())throw bad("Outside the 80°S raster","coverage");
 const v=Number((await im.readRasters({window:[px,py,px+1,py+1]}))[0][0]);if(!Number.isFinite(v)||v<-1e4||v>1e4)throw bad("No-data cell","nodata");return v}
const why=e=>e.kind?e.message:"Browser could not read NASA's server (CORS or offline)";
const near=s=>PRE.samples.find(p=>Math.abs(p.lat-s.lat)<5e-4&&Math.abs(p.lon-s.lon)<5e-4);
function fromFile(s,p){R()[s.id]={elevation:p.elevation??null,slope:p.slope??null,error:p.error??null,slopeError:p.slopeError??null,status:"Precomputed from NASA PGDA product",via:"file",timestamp:PRE.generated||null,pixelScale:"80 m",source:BASE+P.elevation}}
function applyPre(force){S().forEach(s=>{const p=near(s);if(p&&(force||!R()[s.id]))fromFile(s,p)});A.save();A.populate()}
async function sampleSite(s){const [x,y]=stereo(s.lat,s.lon);let dem;
 try{dem=await val(P.elevation,x,y)}catch(e){const p=near(s);if(p){fromFile(s,p);return"file"}throw e}
 const o={};for(const k of["slope","error","slopeError"])try{o[k]=await val(P[k],x,y)}catch{o[k]=null}
 R()[s.id]={elevation:dem,...o,status:"NASA LOLA sample retrieved",via:"live",timestamp:new Date().toISOString(),pixelScale:"80 m",source:BASE+P.elevation};return"live"}
async function run(list){const b=[$("sampleBtn"),$("sampleAll")],st=$("sampleStatus");b.forEach(x=>x&&(x.disabled=true));let ok=0,last="";
 for(const s of list){st.textContent="Reading NASA LOLA for "+s.name+"…";try{await sampleSite(s);ok++}catch(e){last=why(e);console.warn(e)}}
 A.save();A.populate();st.textContent=ok?`${ok} of ${list.length} sampled`+(last?" · "+last:""):"Sample unavailable: "+last+". Open NASA data hub to import samples.";
 A.toast(ok?"NASA LOLA values loaded.":"Could not reach NASA LOLA: "+last);b.forEach(x=>x&&(x.disabled=false))}
function metrics(){const s=S().find(v=>v.id===$("analysisSelect").value)||S()[0];if(!s)return;const r=R()[s.id];
 $("elevValue").textContent=r?.elevation!=null?f(r.elevation):"—";$("slopeValue").textContent=r?.slope!=null?f(r.slope):"—";$("errorValue").textContent=r?.error!=null?f(r.error):"—";
 if(!$("sampleBtn").disabled)$("sampleStatus").textContent=r?r.status+(r.slopeError!=null?" · slope error ±"+f(r.slopeError,1)+"°":""):"Not sampled yet"}
/* candidates */
function addUi(){$("addCand").innerHTML='<h2>Add or remove a candidate</h2><div class="addrow"><label>Name<input id="nName" placeholder="e.g. Faustini Rim A"></label><label>Latitude °<input id="nLat" type="number" step="0.0001" min="-90" max="-80"></label><label>Longitude °<input id="nLon" type="number" step="0.0001" min="-180" max="180"></label><button class="btn primary" id="nAdd">Add candidate</button><button class="btn ghost" id="nDel">Remove selected</button></div>';
 $("nAdd").onclick=()=>{const name=$("nName").value.trim(),lat=Number($("nLat").value),lon=Number($("nLon").value);
  if(!name||$("nLat").value===""||$("nLon").value===""||lat>-80||lat<-90||lon<-180||lon>180){A.toast("Enter a name, latitude -90° to -80° and longitude -180° to 180°.");return}
  const s={id:"site_"+Date.now(),name,lat,lon};S().push(s);applyPre();A.select(s.id);["nName","nLat","nLon"].forEach(i=>$(i).value="");A.toast("Candidate added. Press Retrieve NASA LOLA sample.")};
 $("nDel").onclick=()=>{if(S().length<2){A.toast("Keep at least one candidate.");return}const id=$("analysisSelect").value,i=S().findIndex(s=>s.id===id);if(i<0)return;S().splice(i,1);delete R()[id];A.save();A.select(S()[0].id);A.toast("Candidate removed.")};
 $("sampleBtn").insertAdjacentHTML("afterend",'<button class="btn ghost" id="sampleAll">Retrieve all candidates</button>');$("sampleAll").onclick=()=>run(S());
 $("sampleBtn").onclick=()=>run([S().find(s=>s.id===$("analysisSelect").value)||S()[0]])}
/* data hub */
function hub(){$("srcGrid").innerHTML=SOURCES.map((s,i)=>`<article class="src"><h3>${esc(s.n)}</h3><p>${esc(s.d)}</p><div>${s.t?`<span class="chip" id="chip${i}">Not tested</span> <button class="btn ghost" data-t="${i}">Test connection</button>`:'<span class="chip">Reference link</span>'}</div><a href="${s.u}" target="_blank" rel="noopener">Open source ↗</a></article>`).join("");
 $("srcGrid").onclick=async e=>{const b=e.target.closest("[data-t]");if(!b)return;const i=+b.dataset.t,c=$("chip"+i),t=SOURCES[i].t;c.className="chip";c.textContent="Testing…";let ok=false,m="";
  try{if(t==="cog"){const r=await fetch(BASE+P.elevation,{headers:{Range:"bytes=0-1023"}});ok=r.status===206||r.ok;m=ok?(r.status===206?"Reachable, range reads work":"Reachable, no range support"):"HTTP "+r.status}
   else if(t==="api"){const r=await fetch("https://images-api.nasa.gov/search?q=moon&page_size=1");ok=r.ok;m=ok?"Reachable":"HTTP "+r.status}
   else await new Promise((y,n)=>{const im=new Image();im.onload=y;im.onerror=n;im.src="https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/0.jpg";ok=true;m="Reachable"})}
  catch{m=t==="cog"?"Blocked by browser (CORS). Use offline samples.":"Not reachable"}
  c.className="chip "+(ok?"ok":"bad");c.textContent=m};
 const go=async()=>{const q=$("imgQ").value.trim();if(!q)return;$("imgOut").innerHTML='<span class="muted">Searching…</span>';
  try{const j=await(await fetch("https://images-api.nasa.gov/search?media_type=image&page_size=8&q="+encodeURIComponent(q))).json(),it=(j.collection?.items||[]).filter(x=>x.links?.[0]&&x.data?.[0]);
   $("imgOut").innerHTML=it.length?it.map(x=>`<a href="https://images.nasa.gov/details/${encodeURIComponent(x.data[0].nasa_id)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(x.links[0].href)}" alt="${esc(x.data[0].title)}"><br>${esc(x.data[0].title)}</a>`).join(""):'<span class="muted">No images found.</span>'}
  catch{$("imgOut").innerHTML='<span class="muted">NASA Image Library not reachable right now.</span>'}};
 $("imgGo").onclick=go;$("imgQ").onkeydown=e=>{if(e.key==="Enter")go()};
 $("impFile").onchange=async e=>{const fl=e.target.files[0];if(!fl)return;try{const j=JSON.parse(await fl.text());if(!Array.isArray(j.samples))throw Error();PRE={...j,samples:[...j.samples,...PRE.samples]};applyPre(true);A.toast("Samples imported for matching candidates.")}catch{A.toast("That file is not a LUNA NAV samples JSON.")}}}
function side(){$("sideRefs").innerHTML='<b>NASA open data</b>'+[["LOLA south-pole DEMs","https://pgda.gsfc.nasa.gov/products/90"],["Moon Trek","https://trek.nasa.gov/moon/"],["PDS Geosciences","https://pds-geosciences.wustl.edu/missions/lro/lola.htm"],["LRO mission","https://science.nasa.gov/mission/lro/"],["NASA Image Library","https://images.nasa.gov/"]].map(a=>`<a href="${a[1]}" target="_blank" rel="noopener">${a[0]} ↗</a>`).join("")+'<a href="#data" data-tab="data">All sources and tests →</a>'}
/* reports */
const hav=(a,b)=>{const r=Math.PI/180,h=Math.sin((b.lat-a.lat)*r/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin((b.lon-a.lon)*r/2)**2;return 2*1737.4*Math.asin(Math.sqrt(h))};
function scope(){const el=$("reportScope"),v=el.value;el.innerHTML='<option value="all">All candidates (comparison)</option>'+S().map(s=>`<option value="${s.id}">${esc(s.name)} only</option>`).join("");el.value=[...el.options].some(o=>o.value===v)?v:"all"}
function report(){const sc=$("reportScope").value,rk=window.LUNA_RANK||{rows:[],act:[],skipped:[]},one=sc!=="all",rows=rk.rows.filter(x=>!one||x.s.id===sc),L=rk.labels||{};
 const line=x=>`<tr><td>${rk.rows.indexOf(x)+1}</td><td>${esc(x.s.name)}</td><td>${f(x.s.lat,3)}, ${f(x.s.lon,3)}</td><td>${f(x.r.elevation,1," m")}</td><td>${f(x.r.slope,2,"°")}</td><td>${f(x.r.error,2," m")}</td><td>${f(x.v.sun,1,"°")}</td><td>${x.v.earth<0?"below horizon":f(x.v.earth,1,"°")}</td><td>${x.score!=null?f(x.score,0):"—"}</td></tr>`;
 const best=(k,lbl,low,u)=>{const c=rows.filter(x=>Number.isFinite(x.v[k]));if(c.length<2)return"";const w=c.reduce((a,b)=>(low?b.v[k]<a.v[k]:b.v[k]>a.v[k])?b:a);return`<li>${lbl}: <b>${esc(w.s.name)}</b> (${f(w.v[k],2,u)})</li>`};
 let h=`<small>LUNA NAV / RESEARCH NOTE · ${new Date().toLocaleString()}</small><h2>${esc($("reportTitle").value)}</h2><p>${one?"Single-candidate assessment":"Comparison of "+rows.length+" candidate sites"} built from NASA GSFC PGDA LOLA 80°S, 80 m/pixel products.</p>`;
 h+=`<h3>${one?"Candidate measurements":"Candidate comparison"}</h3><table><tr><th>Rank</th><th>Candidate</th><th>Lat, lon</th><th>Elevation</th><th>LOLA slope</th><th>Elev. error</th><th>Sun ceiling</th><th>Earth ceiling</th><th>Score</th></tr>${rows.map(line).join("")}</table>`;
 if(!one){const b=best("slope","Lowest LOLA slope",1,"°")+best("error","Lowest elevation error",1," m")+best("sun","Highest Sun ceiling",0,"°")+best("earth","Highest Earth ceiling",0,"°");h+=`<h3>Best by criterion</h3><ul>${b||"<li>Retrieve NASA LOLA samples to compare slope and error.</li>"}</ul>`;
  const t=rows.length>1?`<tr><th></th>${rows.map(x=>`<th>${esc(x.s.name.split(" ")[0])}</th>`).join("")}</tr>${rows.map(a=>`<tr><th>${esc(a.s.name.split(" ")[0])}</th>${rows.map(b=>`<td>${a===b?"—":f(hav(a.s,b.s),1)}</td>`).join("")}</tr>`).join("")}`:"";if(t)h+=`<h3>Great-circle distances (km)</h3><table>${t}</table>`}
 h+=`<h3>Ranking basis</h3><p>Criteria used: ${rk.act.map(k=>L[k].n).join(", ")||"none"}.${rk.skipped.length?" Left out (no sample for every candidate): "+rk.skipped.map(k=>L[k].n).join(", ")+".":""} Scores are relative among these candidates, not a safety verdict.</p>`;
 h+=`<h3>Research notes</h3><p>${esc($("reportNotes").value||"No additional notes.")}</p><h3>Limitations</h3><p>80 m pixels cannot resolve boulders or small craters. Sun and Earth ceilings assume flat terrain with no horizon. A point sample is not a landing ellipse. Missing values are never inferred.</p><h3>NASA data and citations</h3><p>LOLA products: NASA GSFC PGDA, DOI 10.60903/gsfcpgda-lola-spole. Barker et al. (2023), Planetary Science Journal 4, 183, DOI 10.3847/PSJ/acf3e1. Imagery: NASA/GSFC/ASU LRO WAC via NASA Moon Trek. Photos: NASA Image and Video Library.</p>`;
 $("reportPreview").innerHTML=h}
function init(){document.querySelectorAll("footer,.footer").forEach(x=>x.innerHTML=x.innerHTML.replace(/\s*·?\s*Not affiliated with NASA/i,""));
 addUi();hub();side();scope();$("makeReport").onclick=report;$("printReport").onclick=()=>{report();window.print()};
 window.addEventListener("luna:update",()=>{metrics();scope()});
 fetch("data/lola_samples.json").then(r=>r.ok?r.json():null).then(j=>{if(j&&Array.isArray(j.samples)){PRE=j;applyPre()}}).catch(()=>{}).finally(metrics)}
init();
})();
