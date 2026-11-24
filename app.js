const missions=[
 {id:1,title:"오늘의 게임 추천",desc:"좋아하는 Roblox 게임과 추천 이유를 2~3문장으로 작성해봐.",points:20,type:"글쓰기"},
 {id:2,title:"초보자 공략 만들기",desc:"처음 시작하는 사람에게 도움이 될 팁 한 가지를 공유해봐.",points:30,type:"공략"},
 {id:3,title:"게임 리뷰",desc:"최근 플레이한 게임의 장점과 아쉬운 점을 적어봐.",points:30,type:"리뷰"},
 {id:4,title:"안전 퀴즈",desc:"다른 사람에게 비밀번호나 인증번호를 알려주면 안 되는 이유를 적어봐.",points:20,type:"퀴즈"}
];
const get=(k,d)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d));
let user=get("rc_user",null),done=get("rc_done",[]),posts=get("rc_posts",[]);
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("rc_user",JSON.stringify(user));localStorage.setItem("rc_done",JSON.stringify(done));localStorage.setItem("rc_posts",JSON.stringify(posts));}
function render(){ $("profileBtn").textContent=user?user.name:"게스트";$("doneCount").textContent=done.length;$("points").textContent=done.reduce((s,id)=>s+(missions.find(m=>m.id===id)?.points||0),0)+" P";$("rank").textContent=user?"참여자":"-";
$("missionList").innerHTML=missions.map(m=>`<article class="card"><span class="tag">${m.type}</span><h3>${m.title}</h3><p>${m.desc}</p><div class="meta"><span>활동 점수 ${m.points}P</span><span>${done.includes(m.id)?"완료":"참여 가능"}</span></div><button class="primary" data-mission="${m.id}" ${done.includes(m.id)?"disabled":""}>${done.includes(m.id)?"완료했어요":"미션 완료"}</button></article>`).join("");
$("posts").innerHTML=posts.slice().reverse().map(p=>`<article class="post"><b>${escapeHtml(p.text)}</b><small>${escapeHtml(p.name)} · ${p.date}</small></article>`).join("")||'<div class="notice">첫 번째 게임 이야기를 남겨봐!</div>';
$("rankingList").innerHTML='<div class="notice">랭킹은 이 기기에서 기록된 활동을 기준으로 표시되는 데모입니다. 여러 이용자 간 실제 랭킹에는 서버와 데이터베이스 연결이 필요합니다.</div>';
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("joinBtn").onclick=$("profileBtn").onclick=()=>{if(user){alert("닉네임: "+user.name);return;}$("nameDialog").showModal();};
$("nameForm").onsubmit=e=>{e.preventDefault();let n=$("nickname").value.trim();if(!n)return;user={name:n};save();$("nameDialog").close();render();};
$("missionList").onclick=e=>{let id=Number(e.target.dataset.mission);if(!id||!user){if(!user)$("nameDialog").showModal();return;}if(!done.includes(id)){done.push(id);save();render();}};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("hidden",p.id!==b.dataset.tab));});
$("postForm").onsubmit=e=>{e.preventDefault();if(!user){$("nameDialog").showModal();return;}let t=$("postText").value.trim();if(!t)return;posts.push({name:user.name,text:t,date:new Date().toLocaleDateString("ko-KR")});save();$("postText").value="";render();};
render();