
function saveWallet(){
 const w=document.getElementById('adminWallet').value.trim();
 if(!w) return alert("Wallet cannot be empty!");
 localStorage.setItem("global_wallet", w);
 alert("Wallet saved.");
}
function saveQrCode(){
 const f=document.getElementById("qrUploadAdmin").files[0];
 if(!f) return alert("Select QR first!");
 const r=new FileReader();
 r.onload=e=>{ localStorage.setItem("qr_code", e.target.result); alert("QR Saved!"); };
 r.readAsDataURL(f);
}
function uploadPricingImg(unit,id){
 const f=document.getElementById(id).files[0];
 if(!f) return alert("Select image!");
 const r=new FileReader();
 r.onload=e=>{ localStorage.setItem("pricing_"+unit, e.target.result); alert(unit+" updated!"); };
 r.readAsDataURL(f);
}
