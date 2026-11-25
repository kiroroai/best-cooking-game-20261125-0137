[![Make the best cooking game](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/kiroroai/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/kiroroai/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/c/best-cooking-game-20261125-0137)

# Warung Kilat — Game Memasak Serba Cepat

Entry for [Make the best cooking game](https://make.fun/c/best-cooking-game-20261125-0137) on make.fun.

Kamu adalah koki di sebuah warung makan Indonesia. Pelanggan memesan di **papan pesanan**,
setiap pesanan punya **timer**. Klik bahan di **counter** untuk merakit hidangan di piring
di **stasiun rakit**, lalu sajikan ke tiket pesanan sebelum waktu habis. Sajikan beruntun
untuk membangun **kombo** — tapi tiga pesanan hangus dan shift selesai.

## Cara main

- **Klik bahan** di counter (atau tekan tombol `1`–`8`) untuk menambahkannya ke piring.
- **Klik tiket pesanan** (atau tekan `Spasi`) untuk menyajikan piring yang cocok.
- **Backspace** membuang isi piring. `P` jeda, `M` bisu, `R` main lagi.
- Shift berlangsung 3 menit. Skor = poin hidangan + bonus kecepatan + bonus kombo.

## Hidangan

| Hidangan | Bahan |
| --- | --- |
| Nasi Goreng Kilat | Nasi, Telur, Ayam, Kecap |
| Mie Goreng Pedas | Mie, Cabai, Ayam, Sayur |
| Nasi Telur Dadar | Nasi, Telur, Bawang |
| Mie Ayam Warung | Mie, Ayam, Sayur, Bawang |
| Nasi Sayur Sehat | Nasi, Sayur, Telur, Bawang |
| Mie Cabai Meledak | Mie, Cabai, Telur, Kecap |

## Menjalankan

Game statis, tanpa build step dan tanpa network request:

```sh
node serve.ts        # atau server statis apa pun untuk game/
# buka http://localhost:8080
```

Atau buka `game/index.html` langsung dari file — semua aset digambar di canvas,
semua suara disintesis dengan WebAudio.

## Struktur

- `game/index.html` + `game/style.css` — halaman dan tampilan
- `game/src/main.js` — boot + game loop
- `game/src/state.js` — aturan: pesanan, piring, skor, kombo, timer
- `game/src/render.js` — semua gambar (canvas vector, tanpa file gambar)
- `game/src/input.js` — mouse + keyboard
- `game/src/recipes.js` — bahan dan resep
- `game/src/audio.js` — efek suara WebAudio
- `game/src/shots.js` — staging deterministik untuk screenshot
- `game/src/layout.js` — geometri layar bersama render + input
- `game/src/rng.js` — RNG ber-seed
- `main.ts` — entrypoint: menyalin `game/` + `screenshots/` ke `/output` dan
  menulis `/output/dossier.json` dengan `buildDossier` dari `vendor/makefun-game.ts`

Screenshot di `screenshots/` adalah render asli game ini di headless Chrome
(`?shot=cover|mid|rush|serve`): dapur, papan pesanan, bahan di counter, hidangan
mid-assembly, timer, dan piring siap saji.

## Lisensi

MIT — lihat `LICENSE`.
