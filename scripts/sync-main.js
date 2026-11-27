const fs = require("fs");
const path = require("path");
const daysDir = path.join("lists", "days");
const mainPath = path.join("lists", "main.json");
function dayKey(){ return new Date().toISOString().slice(0,10); }
function merge(items, texts, by){
  items = items || [];
  (texts||[]).forEach(function(text){
    var k = String(text).toLowerCase();
    var hit = items.filter(function(it){ return String(it.text).toLowerCase()===k; })[0];
    if(hit){ hit.n = (hit.n||1)+1; hit.by = hit.by||[]; if(hit.by.indexOf(by)<0) hit.by.push(by); hit.t = Date.now(); }
    else items.push({text:text, n:1, by:[by], t:Date.now()});
  });
  items.sort(function(a,b){ return (b.n||0)-(a.n||0); });
  return items.slice(0,300);
}
var main = {days:{}, items:[], lastSync:""};
if(fs.existsSync(mainPath)){ try{ main = JSON.parse(fs.readFileSync(mainPath,"utf8")); }catch(e){} }
main.days = main.days || {}; main.items = main.items || [];
var today = dayKey();
if(!fs.existsSync(daysDir)){ fs.mkdirSync(daysDir, {recursive:true}); }
var names = fs.readdirSync(daysDir).map(function(f){ return f.replace(/\.json$/,""); }).filter(function(d){ return /^\d{4}-\d{2}-\d{2}$/.test(d) && d < today && !main.days[d]; });
names.forEach(function(d){
  var day = JSON.parse(fs.readFileSync(path.join(daysDir, d+".json"), "utf8"));
  main.days[d] = {items: day.items||[], updated: day.updated||0};
  main.items = merge(main.items, (day.items||[]).map(function(it){ return it.text; }), "day:"+d);
});
main.lastSync = today;
main.updated = Date.now();
fs.mkdirSync(path.dirname(mainPath), {recursive:true});
fs.writeFileSync(mainPath, JSON.stringify(main, null, 2) + "\n");
console.log("synced", names.length, "day(s) into main. lastSync", today);
