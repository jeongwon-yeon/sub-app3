import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { PortalRouteSync } from "portal-route-sdk-demo";

const accent = "#9333ea";
const linkStyle: React.CSSProperties = { color: accent, fontWeight: 600 };

function readDemoCookie() {
  const prefix = "portal_demo_value=";
  const entry = document.cookie.split(";").map(cookie => cookie.trim()).find(cookie => cookie.startsWith(prefix));
  try {
    return entry ? decodeURIComponent(entry.slice(prefix.length)) : "";
  } catch {
    return "";
  }
}

function DemoCookieValue() {
  const [value, setValue] = useState(readDemoCookie);

  useEffect(() => {
    const timer = window.setInterval(() => setValue(readDemoCookie()), 500);
    return () => window.clearInterval(timer);
  }, []);

  return <p role="status">공유 테스트 쿠키 <code>{value || "없음"}</code></p>;
}

function Controls() {
  const navigate = useNavigate();
  const location = useLocation();
  return <>
    <nav style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14, padding: "12px 0", borderBottom: "1px solid #ddd" }}>
      <Link style={linkStyle} to="/">Home (Link)</Link>
      <Link style={linkStyle} to="/board">Board (Link)</Link>
      <button onClick={() => navigate("/board")}>Board (navigate)</button>
      <a style={linkStyle} href="/board">Board (문서 이동)</a>
      <Link style={linkStyle} to="/board?tab=a#top">Board (query/hash)</Link>
      <button onClick={() => navigate("/detail/123")}>Detail (navigate)</button>
      <button onClick={() => navigate(-1)}>뒤로 (navigate -1)</button>
      <button onClick={() => navigate(1)}>앞으로 (navigate 1)</button>
      <button onClick={() => window.location.reload()}>iframe 새로고침</button>
    </nav>
    <p>현재 iframe 경로: <code>{location.pathname + location.search + location.hash}</code></p>
  </>;
}

function Detail() {
  const { id } = useParams();
  return <div><h2>상세 페이지</h2><p>상세 ID: {id}</p><Link style={linkStyle} to="/board">보드로 돌아가기</Link></div>;
}

export default function App() {
  return <BrowserRouter>
    <PortalRouteSync parentOrigin="http://localhost:5173" />
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, borderTop: `6px solid ${accent}`, color: "#222" }}>
      <h1 style={{ marginTop: 0 }}>Sub App 3</h1>
      <p>독립 실행해도 동작합니다. 부모 포털에서 iframe으로 열면 URL이 동기화됩니다.</p>
      <Controls />
      <DemoCookieValue />
      <Routes>
        <Route path="/" element={<div><h2>Home</h2><p>Sub App 3 홈 화면</p></div>} />
        <Route path="/board" element={<div><h2>Board</h2><p>Sub App 3 게시판 화면</p><Link style={linkStyle} to="/detail/123">상세 123 열기</Link></div>} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="*" element={<p>해당 경로가 없습니다.</p>} />
      </Routes>
    </div>
  </BrowserRouter>;
}
