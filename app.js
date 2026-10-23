const DEFAULT_TASKS = [
  { id:1, name:"Downtown Clinic", type:"Blood Donation", blood:"O+", location:"Downtown", urgency:"High", desc:"Collect O+ blood urgently for hospital surgery.", status:"pending", note:"" },
  { id:2, name:"City Blood Bank", type:"Blood Donation", blood:"AB-", location:"Central", urgency:"High", desc:"Urgent AB- blood needed for emergency patient.", status:"pending", note:"" },
  { id:3, name:"Eastside Hospital", type:"Blood Donation", blood:"A-", location:"Eastside", urgency:"Medium", desc:"A- blood needed for scheduled surgery.", status:"pending", note:"" },
  { id:4, name:"Northside Health", type:"Blood Donation", blood:"O-", location:"Northside", urgency:"Medium", desc:"O- universal donor blood needed.", status:"pending", note:"" },
  { id:5, name:"Southside Clinic", type:"Blood Donation", blood:"B-", location:"Southside", urgency:"High", desc:"B- blood required for accident victim.", status:"pending", note:"" },
  { id:6, name:"Red Cross Camp", type:"Blood Donation", blood:"A+", location:"Riverside", urgency:"Low", desc:"Donation camp for A+ blood group.", status:"pending", note:"" },
  { id:7, name:"Food Distribution", type:"Disaster Relief", location:"Greenwood", urgency:"High", desc:"Distribute food packets to flood-affected families.", status:"pending", note:"" },
  { id:8, name:"Emergency Shelter", type:"Disaster Relief", location:"Uptown", urgency:"High", desc:"Assist at emergency flood shelter.", status:"pending", note:"" },
  { id:9, name:"Food Camp", type:"Disaster Relief", location:"Lakeside", urgency:"Medium", desc:"Set up food camp for displaced people.", status:"pending", note:"" },
  { id:10, name:"Flood Cleanup", type:"Disaster Relief", location:"Riverbank", urgency:"High", desc:"Help clean up after flooding in the area.", status:"pending", note:"" },
  { id:11, name:"Relief Supply Drop", type:"Disaster Relief", location:"Hillside", urgency:"Medium", desc:"Deliver relief supplies to cut-off villages.", status:"pending", note:"" },
  { id:12, name:"Storm Recovery Team", type:"Disaster Relief", location:"Seaside", urgency:"Low", desc:"Help rebuild after storm damage.", status:"pending", note:"" },
  { id:13, name:"Health Camp Support", type:"Medical Aid", location:"Westside", urgency:"Medium", desc:"Assist doctors at a free health camp.", status:"pending", note:"" },
  { id:14, name:"Medicine Distribution", type:"Medical Aid", location:"Old Town", urgency:"High", desc:"Distribute medicines to elderly residents.", status:"pending", note:"" },
  { id:15, name:"Vaccination Drive", type:"Medical Aid", location:"City Center", urgency:"Medium", desc:"Support vaccination drive registration desk.", status:"pending", note:"" },
  { id:16, name:"Community Library", type:"Education", location:"North End", urgency:"Medium", desc:"Help organize books and tutor kids.", status:"pending", note:"" },
  { id:17, name:"Lakeside Tutoring", type:"Education", location:"Lakeside", urgency:"Low", desc:"Weekend tutoring for underprivileged children.", status:"pending", note:"" },
  { id:18, name:"Reading Program", type:"Education", location:"Old Town", urgency:"Low", desc:"Help run a children's reading program.", status:"pending", note:"" },
  { id:19, name:"Tree Plantation", type:"Community Support", location:"Greenwood", urgency:"Low", desc:"Plant trees in community park.", status:"pending", note:"" },
  { id:20, name:"Neighborhood Watch", type:"Community Support", location:"Old Town", urgency:"Medium", desc:"Join community night watch patrol.", status:"pending", note:"" },
  { id:21, name:"Community Center Cleanup", type:"Community Support", location:"West End", urgency:"Low", desc:"Clean and organize the community center.", status:"pending", note:"" },
  { id:22, name:"Senior Citizen Visit", type:"Community Support", location:"Midtown", urgency:"Medium", desc:"Visit and assist senior citizens at home.", status:"pending", note:"" },
  { id:23, name:"Park Cleanup Drive", type:"Community Support", location:"Riverside", urgency:"Low", desc:"Weekend park cleanup with the community.", status:"pending", note:"" },
  { id:24, name:"Road Safety Campaign", type:"Community Support", location:"Highway Zone", urgency:"Medium", desc:"Help with road safety awareness campaign.", status:"pending", note:"" }
];

const REWARDS = {
  "Blood Donation": 500,
  "Disaster Relief": 800,
  "Medical Aid": 700,
  "Education": 300,
  "Community Support": 250
};

const KEYS = {
  tasks: "rz_tasks",
  user: "rz_user",
  balance: "rz_balance"
};

function loadTasks(){
  const raw = localStorage.getItem(KEYS.tasks);
  if(!raw){
    localStorage.setItem(KEYS.tasks, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS.slice();
  }
  try{
    const parsed = JSON.parse(raw);
    if(!Array.isArray(parsed) || parsed.length < 24){
      localStorage.setItem(KEYS.tasks, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS.slice();
    }
    return parsed;
  }catch(e){
    localStorage.setItem(KEYS.tasks, JSON.stringify(DEFAULT_TASKS));
    return DEFAULT_TASKS.slice();
  }
}

function saveTasks(tasks){ localStorage.setItem(KEYS.tasks, JSON.stringify(tasks)); }

function getUser(){
  const raw = localStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

function saveUser(user){ localStorage.setItem(KEYS.user, JSON.stringify(user)); }

function getBalance(){ return Number(localStorage.getItem(KEYS.balance) || 0); }
function setBalance(a){ localStorage.setItem(KEYS.balance, a); }
function addReward(a){ setBalance(getBalance() + a); }

function logout(){
  localStorage.removeItem(KEYS.user);
  window.location.href = "index.html";
}

function getTypeBadgeClass(type){
  const map = {
    "Blood Donation":"badge-blood",
    "Community Support":"badge-community",
    "Disaster Relief":"badge-disaster",
    "Education":"badge-education",
    "Medical Aid":"badge-medical"
  };
  return map[type] || "badge-pending";
}

function getUrgencyBadgeClass(u){
  if(u === "High") return "badge-urgent";
  if(u === "Medium") return "badge-medium";
  return "badge-low";
}

function getStatusBadgeClass(s){
  if(s === "completed") return "badge-completed";
  if(s === "accepted") return "badge-accepted";
  return "badge-pending";
}

function getTypeIcon(type){
  const icons = {
    "Blood Donation":"🩸",
    "Disaster Relief":"🌊",
    "Medical Aid":"🏥",
    "Education":"📚",
    "Community Support":"🤝"
  };
  return icons[type] || "📋";
}

function getWithdrawals(){
  const raw = localStorage.getItem("rz_withdrawals");
  return raw ? JSON.parse(raw) : [];
}

function addWithdrawal(amount, method){
  const list = getWithdrawals();
  list.unshift({
    id: Date.now(),
    amount: amount,
    method: method,
    date: new Date().toISOString(),
    status: "Processing"
  });
  localStorage.setItem("rz_withdrawals", JSON.stringify(list));
}

function updateNav(){
  const user = getUser();
  const signinEl = document.getElementById("nav-signin");
  const signinBtn = document.getElementById("nav-signin-btn");
  const userEl = document.getElementById("nav-user");
  if(user && userEl){
    if(signinEl) signinEl.style.display = "none";
    if(signinBtn) signinBtn.style.display = "none";
    userEl.style.display = "flex";
    const n = userEl.querySelector(".user-name");
    if(n) n.textContent = user.name || "Volunteer";
  }
}

document.addEventListener("DOMContentLoaded", function(){
  updateNav();
});