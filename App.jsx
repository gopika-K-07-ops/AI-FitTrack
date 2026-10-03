import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/store";
import api from "./services/api";

function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(s => s.auth.user);
  const [open, setOpen] = useState(false);

  const signOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand"><span>✦</span> AI FitTrack</div>
        <nav>
          <Link to="/">⌂ Dashboard</Link>
          <Link to="/workouts">▣ Workouts</Link>
          <Link to="/assistant">✦ AI Assistant</Link>
          <Link to="/progress">◒ Progress</Link>
          <Link to="/profile">◉ Profile</Link>
          {user?.role === "admin" && <Link to="/admin">⚙ Admin</Link>}
        </nav>
        <button className="logout" onClick={signOut}>Logout</button>
      </aside>
      <main className="main">
        <button className="menu" onClick={() => setOpen(v => !v)}>☰</button>
        {children}
      </main>
    </div>
  );
}

function AuthPage({ register = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const url = register ? "/auth/register" : "/auth/login";
      const { data } = await api.post(url, form);
      dispatch({ type: "auth/setAuth", payload: data });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  }

  return (
    <div className="auth">
      <form className="auth-card" onSubmit={submit}>
        <div className="brand center"><span>✦</span> AI FitTrack</div>
        <h1>{register ? "Create account" : "Welcome back"}</h1>
        <p className="muted">{register ? "Start tracking your fitness journey." : "Sign in to continue."}</p>
        {register && <input placeholder="Full name" required value={form.name} onChange={e => setForm({...form,name:e.target.value})} />}
        <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
        <input type="password" placeholder="Password" required minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
        {error && <div className="error">{error}</div>}
        <button className="primary">{register ? "Register" : "Login"}</button>
        <Link to={register ? "/login" : "/register"}>{register ? "Already have an account?" : "Create an account"}</Link>
      </form>
    </div>
  );
}

function Dashboard() {
  const user = useSelector(s => s.auth.user);
  const [summary, setSummary] = useState({ workouts: 0, duration: 0, calories: 0 });

  useEffect(() => {
    api.get("/progress/summary").then(r => setSummary(r.data.totals)).catch(() => {});
  }, []);

  return (
    <>
      <header className="top"><div><h1>Good evening, {user?.name || "there"} 👋</h1><p className="muted">Track workouts and let AI guide your next move.</p></div><span className="goal">Goal: {user?.goal || "General Fitness"}</span></header>
      <section className="stats">
        <Stat title="Workouts completed" value={summary.workouts} />
        <Stat title="Calories burned" value={summary.calories} />
        <Stat title="Workout time" value={`${summary.duration} min`} />
        <Stat title="Experience" value={user?.experience || "Beginner"} />
      </section>
      <div className="grid2">
        <div className="card">
          <h2>AI Fitness Assistant</h2>
          <p className="muted">Get personalized workout suggestions based on your goal and experience.</p>
          <Link className="primary inline" to="/assistant">Ask AI Assistant</Link>
        </div>
        <div className="card">
          <h2>Quick actions</h2>
          <div className="actions">
            <Link to="/workouts">Manage workouts</Link>
            <Link to="/progress">View progress</Link>
            <Link to="/profile">Update profile</Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ title, value }) {
  return <div className="stat card"><small>{title}</small><strong>{value}</strong></div>;
}

function Workouts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", duration: 30, calories: 250, category: "Strength", difficulty: "Beginner" });

  async function load() {
    const { data } = await api.get("/workouts");
    setItems(data.workouts);
  }
  useEffect(() => { load().catch(() => {}); }, []);

  async function add(e) {
    e.preventDefault();
    await api.post("/workouts", form);
    setForm({...form, title:""});
    load();
  }

  async function complete(id) {
    await api.post(`/workouts/${id}/complete`);
    load();
  }

  async function remove(id) {
    await api.delete(`/workouts/${id}`);
    load();
  }

  return (
    <>
      <header className="top"><div><h1>Workout Manager</h1><p className="muted">Create, search and track your workouts.</p></div></header>
      <div className="grid2">
        <form className="card" onSubmit={add}>
          <h2>Add workout</h2>
          <input placeholder="Workout title" required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <div className="two"><input type="number" min="1" value={form.duration} onChange={e=>setForm({...form,duration:+e.target.value})}/><input type="number" min="0" value={form.calories} onChange={e=>setForm({...form,calories:+e.target.value})}/></div>
          <select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
          <button className="primary">Add workout</button>
        </form>
        <div className="card"><h2>Your workouts</h2>{items.length === 0 && <p className="muted">No workouts yet. Add your first one.</p>}{items.map(w=><div className="workout" key={w._id}><div><b>{w.title}</b><p className="muted">{w.duration} min · {w.calories} kcal · {w.difficulty}</p></div><div className="row-actions"><button onClick={()=>complete(w._id)} disabled={w.completed}>{w.completed ? "Done" : "Complete"}</button><button onClick={()=>remove(w._id)}>Delete</button></div></div>)}</div>
      </div>
    </>
  );
}

function Assistant() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([{ role:"ai", text:"Hi! Tell me your goal and I’ll create a general workout suggestion." }]);
  const [busy, setBusy] = useState(false);

  async function send(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    const p = prompt;
    setMessages(m => [...m, {role:"user",text:p}]);
    setPrompt("");
    setBusy(true);
    try {
      const { data } = await api.post("/ai/recommend", { prompt:p });
      setMessages(m => [...m, {role:"ai",text:data.recommendation.response}]);
    } catch {
      setMessages(m => [...m, {role:"ai",text:"Unable to reach the AI service. Check the backend and Gemini API key."}]);
    } finally { setBusy(false); }
  }

  return <div className="card assistant"><h1>AI Fitness Assistant ✦</h1><p className="muted">Powered by your backend Gemini integration.</p><div className="chat">{messages.map((m,i)=><div key={i} className={m.role==="user"?"bubble user":"bubble"}>{m.text}</div>)}</div><form className="chat-form" onSubmit={send}><input placeholder="e.g. Give me a 30 minute beginner plan" value={prompt} onChange={e=>setPrompt(e.target.value)}/><button className="primary" disabled={busy}>{busy?"Thinking...":"Send"}</button></form></div>;
}

function Progress() {
  const [data, setData] = useState({ totals:{workouts:0,duration:0,calories:0}, history:[] });
  useEffect(()=>{api.get("/progress/summary").then(r=>setData(r.data)).catch(()=>{});},[]);
  return <><header className="top"><div><h1>Fitness Progress</h1><p className="muted">Monitor completed workouts, duration and calories.</p></div></header><section className="stats"><Stat title="Total workouts" value={data.totals.workouts}/><Stat title="Total minutes" value={data.totals.duration}/><Stat title="Calories" value={data.totals.calories}/><Stat title="History records" value={data.history.length}/></section><div className="card"><h2>Workout History</h2>{data.history.map(h=><div className="workout" key={h._id}><b>{h.title}</b><span className="muted">{h.duration} min · {h.calories} kcal · {new Date(h.completedAt).toLocaleDateString()}</span></div>)}</div></>;
}

function Profile() {
  const user = useSelector(s=>s.auth.user);
  const [goal,setGoal] = useState(user?.goal || "General Fitness");
  const [saved,setSaved] = useState(false);
  return <div className="card"><h1>Your Profile</h1><p className="muted">Profile data is stored in MongoDB through the API.</p><label>Goal<select value={goal} onChange={e=>setGoal(e.target.value)}><option>Build Strength</option><option>Lose Fat</option><option>Improve Endurance</option><option>General Fitness</option></select></label><button className="primary" onClick={()=>setSaved(true)}>Save profile</button>{saved&&<p className="success">Profile UI saved. Add a PATCH profile endpoint if you want server-side goal editing.</p>}</div>;
}

function Admin() {
  const [stats,setStats]=useState(null);
  useEffect(()=>{api.get("/admin/stats").then(r=>setStats(r.data.stats)).catch(()=>{});},[]);
  return <><header className="top"><div><h1>Admin Dashboard</h1><p className="muted">System and fitness analytics.</p></div></header><section className="stats"><Stat title="Users" value={stats?.users ?? "—"}/><Stat title="Workouts" value={stats?.workouts ?? "—"}/><Stat title="AI requests" value={stats?.aiRequests ?? "—"}/><Stat title="API status" value="Healthy"/></section></>;
}

function PrivateRoute({ children }) {
  const user = useSelector(s=>s.auth.user);
  return user ? children : <AuthPage />;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<AuthPage />} />
    <Route path="/register" element={<AuthPage register />} />
    <Route path="*" element={<PrivateRoute><Layout><Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/workouts" element={<Workouts />} />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
    </Routes></Layout></PrivateRoute>} />
  </Routes>;
}
