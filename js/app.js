// CONTOH: Menggunakan Fetch API (seperti JSONBin atau backend custom)
const API_URL = "$2a$10$pnO7GxDvtXqB7DrQ5C75/e6xHENV2ub55CwVtiv5Fyygcq6miTAoy";
const API_KEY = "$2a$10$iiRMDXFnjwyg/XhsUduUce77AO9th3YO7oTyblGPE.BQLs/MNHDUe";

// Mengubah saveState menjadi asynchronous (mengirim ke cloud)
async function saveState() {
  try {
    // Tetap simpan di localStorage sebagai backup sementara (opsional)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); 
    
    // Kirim data ke database cloud
    await fetch(API_URL, {
      method: 'PUT', // atau POST tergantung API
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY 
      },
      body: JSON.stringify(state)
    });
  } catch(e) {
    console.error("Gagal menyimpan ke database cloud", e);
  }
}

// Mengubah loadState menjadi asynchronous (mengambil dari cloud saat web dibuka)
async function loadState() {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const raw = await response.json();
    
    // Update state dengan data dari cloud
    state = raw.record; // Sesuaikan dengan struktur respons API
    render(); // Render ulang tampilan setelah data masuk
    
  } catch(e) {
    // Jika gagal / offline, ambil dari localStorage
    const local = localStorage.getItem(STORAGE_KEY);
    if(local) {
      state = JSON.parse(local);
      render();
    }
  }
}

// Catatan: Karena loadState sekarang asinkronus, kamu harus memanggilnya 
// saat pertama kali halaman dimuat, misal: window.onload = loadState;