# 🪐 T-Nebula — Cosmic Flow State Timer

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-6-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/Tailwind-4-cyan?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
</p>

---

**T-Nebula** adalah aplikasi *flow-state timer* (Pomodoro) bertema kosmik yang dirancang untuk membantumu menjelajahi sesi fokus layaknya mengorbit di luar angkasa. Pilih planetmu, aktifkan gravitasi fokus, dan capai *aphelion* produktivitasmu.

---

## 🚀 Fitur Utama

- 🪐 **Cosmic Planet Selection**: Pilih dari berbagai planet (Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus) dengan skema warna aksen dinamis yang unik.
- 🌌 **Parallax Space Background**: Latar belakang bintang interaktif yang bergerak dinamis mengikuti pergerakan kursor mouse.
- 🌀 **Gravity Field & Sparkle Trails**: Visualisasi partikel gravitasi dan efek cahaya (*sparkle*) yang memukau saat timer berjalan, memperkuat nuansa imersif luar angkasa.
- ⏱️ **Orbital Duration Settings**: Sesuaikan durasi waktu fokusmu melalui panel pengaturan kosmik yang modern dan futuristik.
- ✨ **Rich Micro-animations**: Didukung oleh Framer Motion untuk transisi antarmuka yang sangat mulus dan terasa premium.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi modern berkinerja tinggi:

- **Framework & Build Tools**: [React 19](https://react.dev/) & [Vite](https://vite.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Visual 3D & Grafis**: [Three.js](https://threejs.org/) (untuk rendering planet)
- **Animasi & Transisi**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikonografi**: [Lucide React](https://lucide.dev/)

---

## 📂 Struktur Proyek

Berikut adalah gambaran umum folder dan komponen penting di dalam proyek **T-Nebula**:

```text
src/
├── components/
│   ├── CosmicTimer.tsx      # Komponen utama pengatur alur waktu & logika timer
│   ├── PlanetRenderer.tsx   # Rendering 3D Planet menggunakan Three.js
│   ├── GravityField.tsx     # Efek partikel gravitasi di sekeliling planet
│   ├── CosmicStar.tsx       # Status visual bintang pusat berdasarkan mode timer
│   ├── SparkleTrail.tsx     # Efek jejak bintang yang mengikuti pergerakan fokus
│   └── SettingsModal.tsx    # Modal konfigurasi planet dan durasi fokus
├── hooks/
│   └── useSettings.ts       # Hook state manajemen untuk preferensi pengguna
├── lib/
│   └── utils.ts             # Utility classes helper
├── index.css                # Konfigurasi style global & custom cosmic tokens
└── App.tsx                  # Entri utama aplikasi
```

---

## ⚙️ Cara Menjalankan Project

Ikuti langkah-langkah di bawah ini untuk menjalankan **T-Nebula** di mesin lokalmu:

### 1. Kloning Repositori
```bash
git clone https://github.com/username/t-nebula.git
cd t-nebula
```

### 2. Instalasi Dependensi
Gunakan Package Manager pilihanmu untuk menginstal dependensi:
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Jalankan Server Pengembangan
Mulai server lokal untuk melihat aplikasi secara real-time:
```bash
npm run dev
```
Setelah dijalankan, buka `http://localhost:5173` di browsermu.

---

## 🔮 State Orbital

Aplikasi ini memiliki 4 fase utama dalam perjalanan fokusmu:
- 🛰️ **Orbital Hold (Idle)** — Memilih planet tujuan dan bersiap melakukan peluncuran.
- 🚀 **Deep Orbit (Running)** — Mode fokus aktif dengan visualisasi kosmik berjalan.
- 🛸 **Gravity Drift (Paused)** — Orbit terhenti sementara waktu.
- 🌟 **Aphelion Reached (Success)** — Misi selesai! Sesi fokus berhasil diselesaikan.

---

<p align="center">
  Dibuat dengan 💜 untuk para Penjelajah Produktivitas Kosmik.
</p>
