from __future__ import annotations

import html
import io
import os
import re
import secrets
import sqlite3
from collections import defaultdict
from datetime import datetime
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse
import cgi

DB_PATH = "supremo.db"
SESSIONS: dict[str, int] = {}


def db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = db_conn()
    cur = conn.cursor()
    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            target_exam TEXT,
            weekly_hours INTEGER DEFAULT 10,
            exam_date TEXT
        );
        CREATE TABLE IF NOT EXISTS notices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            role TEXT, board TEXT, agency TEXT, level TEXT, exam_date TEXT,
            notes TEXT, extracted_text TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            notice_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            weight INTEGER DEFAULT 3
        );
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            subtopic TEXT,
            probability INTEGER DEFAULT 3,
            difficulty INTEGER DEFAULT 3,
            status TEXT DEFAULT 'não iniciado'
        );
        CREATE TABLE IF NOT EXISTS study_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            week_label TEXT NOT NULL,
            routine TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            period TEXT NOT NULL,
            metric TEXT NOT NULL,
            target_value INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject_name TEXT NOT NULL,
            topic_name TEXT,
            method TEXT NOT NULL,
            duration_min INTEGER NOT NULL,
            questions_done INTEGER DEFAULT 0,
            accuracy REAL DEFAULT 0,
            energy INTEGER DEFAULT 3,
            difficulty INTEGER DEFAULT 3,
            focus INTEGER DEFAULT 3,
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS mocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            board TEXT NOT NULL,
            score REAL NOT NULL,
            subjects TEXT,
            notes TEXT
        );
        """
    )
    conn.commit()
    conn.close()


def esc(text):
    return html.escape(str(text or ""))


def parse_notice(text: str):
    subjects = defaultdict(list)
    markers = ["língua portuguesa", "raciocínio lógico", "direito", "informática", "matemática", "contabilidade", "administração"]
    current = None
    for raw in text.splitlines():
        line = re.sub(r"\s+", " ", raw).strip(" -\t")
        if not line:
            continue
        low = line.lower()
        if any(m in low for m in markers) or (len(line) < 60 and line.isupper()):
            current = line.title()
            subjects[current]
            continue
        line = re.sub(r"^(\d+[\.)]|[a-z][\)])\s*", "", line, flags=re.I)
        if current:
            for p in [x.strip() for x in re.split(r"[;•]", line) if x.strip()][:3]:
                parts = p.split(":", 1)
                subjects[current].append((parts[0][:180], parts[1][:180] if len(parts) > 1 else ""))
    if not subjects:
        subjects["Conhecimentos Gerais"] = [("Interpretação de texto", ""), ("Lógica", ""), ("Atualidades", "")]
    return subjects


def page(title: str, body: str, user: sqlite3.Row | None = None):
    nav_auth = ""
    if user:
        nav_auth = """
        <a href='/dashboard'>Dashboard</a><a href='/editais'>Editais</a><a href='/plano'>Plano</a>
        <a href='/sessoes'>Sessões</a><a href='/simulados'>Simulados</a><a href='/analytics'>Analytics</a>
        <a href='/configuracoes'>Configurações</a><a href='/logout'>Sair</a>
        """
    else:
        nav_auth = "<a href='/login'>Entrar</a><a href='/register'>Cadastro</a>"
    return f"""<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
    <title>{esc(title)} - Supremo Concursos</title><link rel='stylesheet' href='/static/style.css'>
    <script src='https://cdn.jsdelivr.net/npm/chart.js'></script></head><body>
    <nav><div class='brand'>Supremo Concursos</div><div class='nav-links'>{nav_auth}</div></nav>
    <main><h1>{esc(title)}</h1>{body}</main></body></html>"""


class App(BaseHTTPRequestHandler):
    def current_user(self):
        c = cookies.SimpleCookie(self.headers.get("Cookie"))
        sid = c.get("sid")
        if not sid or sid.value not in SESSIONS:
            return None
        uid = SESSIONS[sid.value]
        conn = db_conn()
        user = conn.execute("SELECT * FROM users WHERE id=?", (uid,)).fetchone()
        conn.close()
        return user

    def send_html(self, text, code=200):
        self.send_response(code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(text.encode())

    def redirect(self, location):
        self.send_response(302)
        self.send_header("Location", location)
        self.end_headers()

    def parse_post(self):
        ctype, pdict = cgi.parse_header(self.headers.get("Content-Type", ""))
        if ctype == "multipart/form-data":
            fs = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": self.headers.get("Content-Type")})
            out = {}
            for k in fs.keys():
                field = fs[k]
                if isinstance(field, list):
                    field = field[0]
                if field.filename:
                    out[k] = field
                else:
                    out[k] = field.value
            return out
        length = int(self.headers.get("Content-Length", 0))
        data = self.rfile.read(length).decode()
        parsed = {k: v[0] for k, v in parse_qs(data).items()}
        return parsed

    def must_auth(self):
        user = self.current_user()
        if not user:
            self.redirect("/login")
            return None
        return user

    def do_GET(self):
        path = urlparse(self.path).path
        if path.startswith("/static/"):
            file_path = path.lstrip("/")
            if os.path.exists(file_path):
                content = open(file_path, "rb").read()
                self.send_response(200)
                self.send_header("Content-Type", "text/css")
                self.end_headers()
                self.wfile.write(content)
                return
        user = self.current_user()
        if path == "/":
            body = "<section class='hero'><h2>Edital bruto → estratégia inteligente</h2><p>Upload, verticalização, plano, progresso e analytics supremo.</p><a class='btn' href='/register'>Começar grátis</a></section>"
            return self.send_html(page("Landing", body, user))
        if path == "/register":
            form = "<form method='post'><input name='name' placeholder='Nome' required><input name='email' type='email' placeholder='E-mail' required><input name='password' type='password' placeholder='Senha' required><button>Cadastrar</button></form>"
            return self.send_html(page("Cadastro", form, user))
        if path == "/login":
            form = "<form method='post'><input name='email' type='email' placeholder='E-mail' required><input name='password' type='password' placeholder='Senha' required><button>Entrar</button></form>"
            return self.send_html(page("Login", form, user))
        if path == "/logout":
            c = cookies.SimpleCookie(self.headers.get("Cookie"))
            sid = c.get("sid")
            if sid and sid.value in SESSIONS:
                del SESSIONS[sid.value]
            return self.redirect("/")

        if path == "/onboarding":
            user = self.must_auth()
            if not user:
                return
            form = "<form method='post'><input name='target_exam' placeholder='Concurso-alvo' required><input name='weekly_hours' type='number' value='10' min='1'><input name='exam_date' type='date'><button>Salvar onboarding</button></form>"
            return self.send_html(page("Onboarding inicial", form, user))

        if path == "/dashboard":
            user = self.must_auth()
            if not user:
                return
            conn = db_conn()
            notices = conn.execute("SELECT COUNT(*) c FROM notices WHERE user_id=?", (user["id"],)).fetchone()["c"]
            sessions = conn.execute("SELECT COALESCE(SUM(duration_min),0) mins, COALESCE(AVG(accuracy),0) acc FROM sessions WHERE user_id=?", (user["id"],)).fetchone()
            body = f"<div class='grid'><div class='card'><h3>{notices}</h3><p>Editais</p></div><div class='card'><h3>{round(sessions['mins']/60,1)}</h3><p>Horas estudadas</p></div><div class='card'><h3>{round(sessions['acc'],1)}%</h3><p>Taxa média de acerto</p></div></div>"
            conn.close()
            return self.send_html(page("Dashboard geral", body, user))

        if path == "/editais":
            user = self.must_auth();
            if not user:
                return
            conn = db_conn()
            data = conn.execute("SELECT * FROM notices WHERE user_id=? ORDER BY id DESC", (user["id"],)).fetchall()
            rows = "".join([f"<tr><td>{esc(r['title'])}</td><td>{esc(r['board'])}</td><td><a href='/editais/{r['id']}'>abrir</a></td></tr>" for r in data])
            conn.close()
            body = """
            <form method='post' enctype='multipart/form-data'><label>Arquivo PDF/DOCX/TXT</label><input type='file' name='notice_file'>
            <label>Ou texto colado</label><textarea name='pasted_text' rows='8'></textarea><button>Extrair e revisar</button></form>
            <table><tr><th>Título</th><th>Banca</th><th></th></tr>""" + rows + "</table>"
            return self.send_html(page("Editais", body, user))

        if re.match(r"^/editais/\d+$", path):
            user = self.must_auth();
            if not user:
                return
            nid = int(path.split("/")[-1])
            conn = db_conn()
            notice = conn.execute("SELECT * FROM notices WHERE id=? AND user_id=?", (nid, user["id"])).fetchone()
            if not notice:
                conn.close(); return self.send_html(page("Erro", "Edital não encontrado.", user), 404)
            subs = conn.execute("SELECT * FROM subjects WHERE notice_id=?", (nid,)).fetchall()
            table = ""
            tree = ""
            for s in subs:
                topics = conn.execute("SELECT * FROM topics WHERE subject_id=?", (s["id"],)).fetchall()
                trows = "".join([f"<li>{esc(t['name'])} {'→ '+esc(t['subtopic']) if t['subtopic'] else ''}</li>" for t in topics])
                tree += f"<details><summary>{esc(s['name'])}</summary><ul>{trows}</ul></details>"
                for t in topics:
                    opts = "".join([f"<option {'selected' if st==t['status'] else ''}>{st}</option>" for st in ['não iniciado','em estudo','revisando','dominado']])
                    table += f"<tr><td>{esc(s['name'])}</td><td>{esc(t['name'])}</td><td><form method='post' action='/topicos/{t['id']}/status'><select name='status'>{opts}</select><button>Salvar</button></form></td></tr>"
            conn.close()
            body = f"<h3>{esc(notice['title'])}</h3><div class='split'><div><h4>Tabela</h4><table><tr><th>Disciplina</th><th>Tópico</th><th>Status</th></tr>{table}</table></div><div><h4>Árvore</h4>{tree}</div></div>"
            return self.send_html(page("Verticalização do edital", body, user))

        if path == "/plano":
            user = self.must_auth();
            if not user: return
            conn = db_conn()
            plans = conn.execute("SELECT * FROM study_plans WHERE user_id=? ORDER BY id DESC", (user["id"],)).fetchall()
            goals = conn.execute("SELECT * FROM goals WHERE user_id=? ORDER BY id DESC", (user["id"],)).fetchall()
            conn.close()
            phtml = "".join([f"<div class='card'><strong>{esc(p['week_label'])}</strong><pre>{esc(p['routine'])}</pre></div>" for p in plans])
            ghtml = "".join([f"<li>{esc(g['period'])}: {g['target_value']} {esc(g['metric'])}</li>" for g in goals])
            body = f"""
            <div class='split'><div><form method='post'><input name='week_label' placeholder='Semana X' required><textarea name='routine' rows='5' placeholder='Seg 19h...' required></textarea><button>Salvar cronograma</button></form></div>
            <div><form method='post' action='/metas'><input name='period' placeholder='semanal' required><input name='metric' placeholder='horas' required><input name='target_value' type='number' required><button>Adicionar meta</button></form><ul>{ghtml}</ul></div></div>{phtml}"""
            return self.send_html(page("Plano de estudos", body, user))

        if path == "/sessoes":
            user = self.must_auth();
            if not user: return
            conn = db_conn()
            data = conn.execute("SELECT * FROM sessions WHERE user_id=? ORDER BY id DESC", (user["id"],)).fetchall(); conn.close()
            rows = "".join([f"<tr><td>{r['created_at']}</td><td>{esc(r['subject_name'])}</td><td>{esc(r['method'])}</td><td>{r['duration_min']} min</td><td>{r['accuracy']}%</td></tr>" for r in data])
            body = f"<form method='post'><input name='subject_name' placeholder='Disciplina' required><input name='topic_name' placeholder='Tópico'><input name='method' placeholder='método' required><input name='duration_min' type='number' placeholder='min' required><input name='questions_done' type='number' placeholder='questões'><input name='accuracy' type='number' step='0.1' placeholder='acerto %'><input name='energy' type='number' min='1' max='5' placeholder='energia'><input name='difficulty' type='number' min='1' max='5' placeholder='dificuldade'><input name='focus' type='number' min='1' max='5' placeholder='foco'><input name='notes' placeholder='obs'><button>Registrar</button></form><table><tr><th>Data</th><th>Disciplina</th><th>Método</th><th>Duração</th><th>Acerto</th></tr>{rows}</table>"
            return self.send_html(page("Sessões de estudo", body, user))

        if path == "/simulados":
            user = self.must_auth();
            if not user: return
            conn = db_conn()
            data = conn.execute("SELECT * FROM mocks WHERE user_id=? ORDER BY date DESC", (user["id"],)).fetchall(); conn.close()
            rows = "".join([f"<tr><td>{r['date']}</td><td>{esc(r['board'])}</td><td>{r['score']}</td><td>{esc(r['subjects'])}</td></tr>" for r in data])
            body = f"<form method='post'><input name='date' type='date' required><input name='board' placeholder='Banca' required><input name='score' type='number' step='0.1' required><input name='subjects' placeholder='Disciplinas'><input name='notes' placeholder='Observações'><button>Salvar simulado</button></form><table><tr><th>Data</th><th>Banca</th><th>Nota</th><th>Disciplinas</th></tr>{rows}</table>"
            return self.send_html(page("Simulados", body, user))

        if path == "/analytics":
            user = self.must_auth();
            if not user: return
            conn = db_conn()
            sessions = conn.execute("SELECT * FROM sessions WHERE user_id=?", (user["id"],)).fetchall()
            by_method = defaultdict(list); by_subj = defaultdict(int)
            for s in sessions:
                by_method[s["method"]].append(s["accuracy"])
                by_subj[s["subject_name"]] += s["duration_min"]
            profile = "iniciante"
            if len(sessions) > 25:
                profile = "consistente"
            elif sessions and sum(x["focus"] for x in sessions) / len(sessions) < 3:
                profile = "disperso"
            insights = ["Identificamos relação entre método e desempenho.", "Priorize tópicos com alto risco de esquecimento e alta incidência.", "Mantenha revisão ativa em ciclos 24h/7d/30d."]
            perf_rows = ""
            topics = conn.execute("""SELECT t.name topic, t.probability prob, t.difficulty dif,
                COALESCE(AVG(s.accuracy),0) acc, COALESCE(SUM(s.duration_min),0)/60.0 hrs
                FROM topics t LEFT JOIN sessions s ON s.topic_name=t.name AND s.user_id=?
                GROUP BY t.id ORDER BY prob DESC LIMIT 12""", (user["id"],)).fetchall()
            for t in topics:
                dominio = min(100, round(t["acc"] * 0.7 + t["hrs"] * 6, 1))
                risco = max(0, round(100 - dominio - t["dif"] * 4, 1))
                prioridade = round(t["prob"] * 15 + risco * 0.5 - dominio * 0.2, 1)
                perf_rows += f"<tr><td>{esc(t['topic'])}</td><td>{dominio}</td><td>{risco}</td><td>{prioridade}</td></tr>"
            conn.close()
            labels_m = list(by_method.keys()); vals_m = [round(sum(v)/len(v),1) for v in by_method.values()]
            labels_s = list(by_subj.keys()); vals_s = [round(v/60,1) for v in by_subj.values()]
            body = f"<div class='card'><h3>Perfil do estudante: {profile}</h3><ul>{''.join([f'<li>{esc(i)}</li>' for i in insights])}</ul></div><div class='split'><canvas id='m'></canvas><canvas id='s'></canvas></div><table><tr><th>Tópico</th><th>Score domínio</th><th>Risco esquecimento</th><th>Prioridade estratégica</th></tr>{perf_rows}</table><script>new Chart(document.getElementById('m'),{{type:'bar',data:{{labels:{labels_m},datasets:[{{label:'Aproveitamento por método',data:{vals_m}}}]}}}});new Chart(document.getElementById('s'),{{type:'line',data:{{labels:{labels_s},datasets:[{{label:'Horas por disciplina',data:{vals_s}}}]}}}});</script>"
            return self.send_html(page("Analytics e perfil", body, user))

        if path == "/configuracoes":
            user = self.must_auth();
            if not user: return
            body = f"<div class='card'><p>Usuário: {esc(user['email'])}</p><p>Concurso-alvo: {esc(user['target_exam'])}</p><p>Horas/semana: {user['weekly_hours']}</p></div>"
            return self.send_html(page("Configurações", body, user))

        return self.send_html(page("404", "Página não encontrada", user), 404)

    def do_POST(self):
        path = urlparse(self.path).path
        data = self.parse_post()

        if path == "/register":
            conn = db_conn()
            try:
                conn.execute("INSERT INTO users(name,email,password) VALUES (?,?,?)", (data.get("name", ""), data.get("email", "").lower(), data.get("password", "")))
                conn.commit()
            except sqlite3.IntegrityError:
                conn.close(); return self.send_html(page("Cadastro", "<p>E-mail já cadastrado.</p><a href='/register'>Voltar</a>"), 400)
            uid = conn.execute("SELECT id FROM users WHERE email=?", (data.get("email", "").lower(),)).fetchone()["id"]
            create_demo(uid, conn)
            conn.close()
            sid = secrets.token_hex(16)
            SESSIONS[sid] = uid
            self.send_response(302)
            self.send_header("Location", "/onboarding")
            self.send_header("Set-Cookie", f"sid={sid}; Path=/")
            self.end_headers(); return

        if path == "/login":
            conn = db_conn()
            user = conn.execute("SELECT * FROM users WHERE email=? AND password=?", (data.get("email", "").lower(), data.get("password", ""))).fetchone()
            conn.close()
            if not user:
                return self.send_html(page("Login", "<p>Credenciais inválidas.</p><a href='/login'>Voltar</a>"), 401)
            sid = secrets.token_hex(16)
            SESSIONS[sid] = user["id"]
            self.send_response(302)
            self.send_header("Location", "/dashboard")
            self.send_header("Set-Cookie", f"sid={sid}; Path=/")
            self.end_headers(); return

        user = self.must_auth()
        if not user:
            return
        conn = db_conn()

        if path == "/onboarding":
            conn.execute("UPDATE users SET target_exam=?, weekly_hours=?, exam_date=? WHERE id=?", (data.get("target_exam"), int(data.get("weekly_hours") or 10), data.get("exam_date"), user["id"]))
            conn.commit(); conn.close(); return self.redirect("/dashboard")

        if path == "/editais":
            text = data.get("pasted_text", "")
            file_obj = data.get("notice_file")
            if hasattr(file_obj, "file"):
                raw = file_obj.file.read()
                try:
                    text = raw.decode("utf-8")
                except Exception:
                    text = raw.decode("latin-1", errors="ignore")
            form = f"""<form method='post' action='/editais/salvar'>
            <input name='title' placeholder='Título do edital' required><input name='role' placeholder='Cargo'><input name='board' placeholder='Banca'><input name='agency' placeholder='Órgão'><input name='level' placeholder='Nível'><input name='exam_date' type='date'>
            <textarea name='extracted_text' rows='12'>{esc(text)}</textarea><textarea name='notes' rows='3' placeholder='Observações'></textarea><button>Salvar e verticalizar</button></form>"""
            conn.close(); return self.send_html(page("Revisão manual do texto", form, user))

        if path == "/editais/salvar":
            cur = conn.execute("INSERT INTO notices(user_id,title,role,board,agency,level,exam_date,notes,extracted_text) VALUES (?,?,?,?,?,?,?,?,?)", (user["id"], data.get("title"), data.get("role"), data.get("board"), data.get("agency"), data.get("level"), data.get("exam_date"), data.get("notes"), data.get("extracted_text")))
            nid = cur.lastrowid
            structure = parse_notice(data.get("extracted_text", ""))
            for s, topics in structure.items():
                sid = conn.execute("INSERT INTO subjects(notice_id,name,weight) VALUES (?,?,?)", (nid, s, 3)).lastrowid
                for t, sub in topics[:8]:
                    conn.execute("INSERT INTO topics(subject_id,name,subtopic,probability,difficulty,status) VALUES (?,?,?,?,?,?)", (sid, t, sub, 3, 3, "não iniciado"))
            conn.commit(); conn.close(); return self.redirect(f"/editais/{nid}")

        if re.match(r"^/topicos/\d+/status$", path):
            tid = int(path.split("/")[2])
            conn.execute("UPDATE topics SET status=? WHERE id=?", (data.get("status", "não iniciado"), tid))
            conn.commit(); conn.close(); return self.redirect(self.headers.get("Referer", "/editais"))

        if path == "/plano":
            conn.execute("INSERT INTO study_plans(user_id,week_label,routine) VALUES (?,?,?)", (user["id"], data.get("week_label"), data.get("routine")))
            conn.commit(); conn.close(); return self.redirect("/plano")

        if path == "/metas":
            conn.execute("INSERT INTO goals(user_id,period,metric,target_value) VALUES (?,?,?,?)", (user["id"], data.get("period"), data.get("metric"), int(data.get("target_value") or 0)))
            conn.commit(); conn.close(); return self.redirect("/plano")

        if path == "/sessoes":
            conn.execute("INSERT INTO sessions(user_id,subject_name,topic_name,method,duration_min,questions_done,accuracy,energy,difficulty,focus,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)", (user["id"], data.get("subject_name"), data.get("topic_name"), data.get("method"), int(data.get("duration_min") or 0), int(data.get("questions_done") or 0), float(data.get("accuracy") or 0), int(data.get("energy") or 3), int(data.get("difficulty") or 3), int(data.get("focus") or 3), data.get("notes")))
            conn.commit(); conn.close(); return self.redirect("/sessoes")

        if path == "/simulados":
            conn.execute("INSERT INTO mocks(user_id,date,board,score,subjects,notes) VALUES (?,?,?,?,?,?)", (user["id"], data.get("date"), data.get("board"), float(data.get("score") or 0), data.get("subjects"), data.get("notes")))
            conn.commit(); conn.close(); return self.redirect("/simulados")

        conn.close()
        return self.send_html(page("404", "Ação não encontrada", user), 404)


def create_demo(uid: int, conn: sqlite3.Connection):
    if conn.execute("SELECT COUNT(*) c FROM notices WHERE user_id=?", (uid,)).fetchone()["c"] > 0:
        return
    txt = "LÍNGUA PORTUGUESA\n1. Interpretação de textos; 2. Pontuação\nRACIOCÍNIO LÓGICO\n1. Proposições; 2. Tabelas verdade"
    nid = conn.execute("INSERT INTO notices(user_id,title,role,board,agency,level,exam_date,notes,extracted_text) VALUES (?,?,?,?,?,?,?,?,?)", (uid, "Edital Demo Prefeitura", "Técnico", "FGV", "Prefeitura Exemplo", "Médio", "2026-12-20", "Base inicial", txt)).lastrowid
    for s, topics in parse_notice(txt).items():
        sid = conn.execute("INSERT INTO subjects(notice_id,name,weight) VALUES (?,?,?)", (nid, s, 3)).lastrowid
        for t, sub in topics:
            conn.execute("INSERT INTO topics(subject_id,name,subtopic) VALUES (?,?,?)", (sid, t, sub))
    conn.execute("INSERT INTO sessions(user_id,subject_name,topic_name,method,duration_min,accuracy,focus) VALUES (?,?,?,?,?,?,?)", (uid, "Língua Portuguesa", "Interpretação de textos", "questões", 90, 76, 4))
    conn.execute("INSERT INTO sessions(user_id,subject_name,topic_name,method,duration_min,accuracy,focus) VALUES (?,?,?,?,?,?,?)", (uid, "Raciocínio Lógico", "Proposições", "flashcards", 70, 62, 3))
    conn.execute("INSERT INTO mocks(user_id,date,board,score,subjects,notes) VALUES (?,?,?,?,?,?)", (uid, "2026-01-10", "FGV", 64.5, "Língua Portuguesa, Raciocínio Lógico", "diagnóstico"))
    conn.execute("INSERT INTO goals(user_id,period,metric,target_value) VALUES (?,?,?,?)", (uid, "semanal", "horas", 18))
    conn.commit()


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("0.0.0.0", 5000), App)
    print("Supremo Concursos rodando em http://127.0.0.1:5000")
    server.serve_forever()
