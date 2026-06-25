// File ini berjalan di dalam server aman Vercel (Tidak bisa di-inspect orang)
export default async function handler(req, res) {
    // Beri izin agar website kamu bisa mengirim data ke sini
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metode salah' });

    try {
        const { fileName, base64Content } = req.body;
        
        // AMBIL TOKEN DARI SISTEM INTERNAL VERCEL
        const token = process.env.REGAL_GITHUB_TOKEN; 
        
        // Sesuaikan dengan data repository aktif kamu
        const owner = "egasenpai";
        const repo = "yuki-regal";
        
        // Domain yang kamu minta untuk output URL gambarnya
        const myDomain = "https://yuki-regal.vercel.app";

        if (!token) {
            return res.status(500).json({ error: 'Token REGAL_GITHUB_TOKEN tidak ditemukan di Environment Variables Vercel.' });
        }

        // Kirim langsung dari Vercel ke GitHub memakai token rahasia
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json",
                "User-Agent": "YukiStore-Vercel-Upload-Proxy" 
            },
            body: JSON.stringify({
                message: `Upload otomatis via Web API`,
                content: base64Content
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(500).json({ error: `Gagal ke GitHub: ${response.status} - ${errorText}` });
        }

        // Mengembalikan respons sukses beserta URL gabungan domain pilihanmu
        return res.status(200).json({ 
            success: true,
            download_url: `${myDomain}/${fileName}`
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
