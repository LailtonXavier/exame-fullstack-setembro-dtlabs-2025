import axios from "axios";

const BACKEND_URL =
  process.env.BACKEND_URL?.replace(/\/$/, "") || "http://backend:3000";
const API_URL = `${BACKEND_URL}/heartbeats`;
const LOGIN_URL = `${BACKEND_URL}/auth/login`;
const USER_URL = `${BACKEND_URL}/users`;
const LOGIN_EMAIL = process.env.LOGIN_EMAIL || "";
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || "";
const INTERVAL_MS = 60_000;

let USER_TOKEN = "";
let USER_DEVICES = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

async function obtainToken() {
  if (USER_TOKEN) return USER_TOKEN;

  if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
    console.warn(
      "⚠️ Nenhum LOGIN_EMAIL/LOGIN_PASSWORD definido. Não será possível autenticar."
    );
    return "";
  }

  try {
    console.log("🔑 Realizando login...");
    const res = await axios.post(LOGIN_URL, {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    });

    USER_TOKEN =
      res.data.access_token ??
      res.data.accessToken ??
      (res.data.tokens ? res.data.tokens.accessToken : "") ??
      "";

    console.log("✅ Token obtido com sucesso!");
    return USER_TOKEN;
  } catch (err) {
    console.error("❌ Falha ao autenticar:", err.message);
    return "";
  }
}

async function fetchUserDevices() {
  const token = await obtainToken();
  if (!token) return [];

  try {
    const res = await axios.get(USER_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = res.data;
    USER_DEVICES = (user.devices || []).map((d) => d.uuid);

    console.log(`📡 Dispositivos carregados: ${USER_DEVICES.length} encontrado(s)`);

    return USER_DEVICES;
  } catch (err) {
    console.error("❌ Erro ao buscar devices:", err.message);
    return [];
  }
}

async function sendHeartbeat() {
  const token = await obtainToken();
  if (!token) return;

  if (!USER_DEVICES.length) {
    console.log("⚠️ Nenhum dispositivo encontrado. Pulando envio...");
    return;
  }

  // pega um device aleatório
  const deviceId = USER_DEVICES[Math.floor(Math.random() * USER_DEVICES.length)];

  const heartbeat = {
    deviceId,
    cpuUsage: Number(random(10, 90).toFixed(2)),
    ramUsage: Number(random(20, 95).toFixed(2)),
    diskFree: Number(random(50, 200).toFixed(2)),
    temperature: Number(random(30, 80).toFixed(1)),
    latencyDns: Math.round(random(10, 50)),
    connectivity: Math.random() > 0.2 ? '1' : '0',
    bootTime: new Date(Date.now() - random(10_000, 5_000_000)).toISOString(),
  };

  try {
    const res = await axios.post(API_URL, heartbeat, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📤 Heartbeat enviado:", heartbeat);
    console.log(
      `✅ Status ${res.status} | Device=${deviceId} | ${new Date().toLocaleTimeString()}`
    );
  } catch (err) {
    if (err.response) {
      console.error("❌ Erro ao enviar heartbeat:", err.response.status, err.response.data);
    } else {
      console.error("❌ Erro ao enviar heartbeat:", err.message);
    }
  }
}

(async () => {
  console.log("🚀 Iniciando simulador de heartbeats...");
  await fetchUserDevices();
  setInterval(sendHeartbeat, INTERVAL_MS);
  sendHeartbeat().catch(() => {});
})();
