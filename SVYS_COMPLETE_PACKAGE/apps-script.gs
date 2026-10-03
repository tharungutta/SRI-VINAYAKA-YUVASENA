const SHEET_MEMBERS = 'Members';
const SHEET_PAYMENTS = 'Payments';
const DRIVE_ROOT = 'SRI VINAYAKA YUVA SENA';

function setupSheets(){
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  let m=ss.getSheetByName(SHEET_MEMBERS)||ss.insertSheet(SHEET_MEMBERS);
  let p=ss.getSheetByName(SHEET_PAYMENTS)||ss.insertSheet(SHEET_PAYMENTS);
  if(m.getLastRow()===0)m.appendRow(['Member ID','Name','Mobile No']);
  if(p.getLastRow()===0)p.appendRow(['Payment ID','Member ID','Member Name','Mobile No','Month','Amount','Payment Date','Screenshot URL','Screenshot File','Created At']);
}
function doGet(){
  setupSheets();
  return jsonOut(getData_());
}
function doPost(e){
  try{
    setupSheets();
    const body=JSON.parse(e.postData.contents||'{}');
    if(body.action==='addContribution') return jsonOut(addContribution_(body));
    if(body.action==='addMember') return jsonOut(addMember_(body));
    return jsonOut({ok:false,error:'Unknown action'});
  }catch(err){return jsonOut({ok:false,error:String(err.message||err)})}
}
function auth_(body){
  const expectedUser=PropertiesService.getScriptProperties().getProperty('ADMIN_USERNAME')||'Tharun';
  const expectedPass=PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD')||'Tharun@18';
  if(body.username!==expectedUser||body.password!==expectedPass)throw new Error('Invalid administrator credentials.');
}
function addMember_(b){
  auth_(b);
  const ss=SpreadsheetApp.getActive();const sh=ss.getSheetByName(SHEET_MEMBERS);
  const name=String(b.name||'').trim(),phone=String(b.phone||'').trim();
  if(!name)throw new Error('Member name is required.');
  if(!/^\d{10}$/.test(phone))throw new Error('Mobile number must contain 10 digits.');
  const values=sh.getDataRange().getValues();
  for(let i=1;i<values.length;i++)if(String(values[i][1]).trim().toLowerCase()===name.toLowerCase())throw new Error('This member already exists.');
  const id='M'+Date.now();sh.appendRow([id,name,phone]);
  return getData_();
}
function addContribution_(b){
  auth_(b);
  if(!b.memberId||!b.month||!b.amount||!b.date)throw new Error('Member, month, amount and date are required.');
  if(!b.screenshotData)throw new Error('Payment screenshot is mandatory.');
  const ss=SpreadsheetApp.getActive();const ms=ss.getSheetByName(SHEET_MEMBERS),ps=ss.getSheetByName(SHEET_PAYMENTS);
  const members=ms.getDataRange().getValues();let member=null;
  for(let i=1;i<members.length;i++)if(String(members[i][0])===String(b.memberId))member={id:members[i][0],name:members[i][1],phone:members[i][2]};
  if(!member)throw new Error('Member not found.');
  const bytes=Utilities.base64Decode(String(b.screenshotData).split(',').pop());
  const mime=b.mimeType||'image/jpeg';
  const blob=Utilities.newBlob(bytes,mime,b.screenshotName||('payment-'+Date.now()+'.jpg'));
  const root=getOrCreateFolder_(DRIVE_ROOT);
  const yearFolder=getOrCreateFolder_(root,new Date(b.date).getFullYear()+'-'+(new Date(b.date).getFullYear()+1));
  const monthFolder=getOrCreateFolder_(yearFolder,String(b.month));
  const memberFolder=getOrCreateFolder_(monthFolder,member.name);
  const file=memberFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
  const id='P'+Date.now();
  ps.appendRow([id,member.id,member.name,member.phone,b.month,Number(b.amount),b.date,file.getUrl(),file.getName(),new Date()]);
  return getData_();
}
function getOrCreateFolder_(parent,name){
  const it=parent.getFoldersByName(name);return it.hasNext()?it.next():parent.createFolder(name);
}
function getData_(){
  const ss=SpreadsheetApp.getActive();const ms=ss.getSheetByName(SHEET_MEMBERS),ps=ss.getSheetByName(SHEET_PAYMENTS);
  const mv=ms.getDataRange().getValues(),pv=ps.getDataRange().getValues();
  const members=mv.slice(1).filter(r=>r[0]).map(r=>({id:String(r[0]),name:String(r[1]||''),phone:String(r[2]||'')}));
  const payments=pv.slice(1).filter(r=>r[0]).map(r=>({id:String(r[0]),memberId:String(r[1]),memberName:String(r[2]||''),phone:String(r[3]||''),month:String(r[4]||''),amount:Number(r[5]||0),date:r[6] instanceof Date?Utilities.formatDate(r[6],Session.getScriptTimeZone(),'yyyy-MM-dd'):String(r[6]||''),screenshotUrl:String(r[7]||''),screenshotName:String(r[8]||'')}));
  return {ok:true,members,payments};
}
function jsonOut(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
