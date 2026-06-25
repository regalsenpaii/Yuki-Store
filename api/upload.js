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
        const owner = "egasenpai";
        const repo = "yuki-regal";

        // Kirim langsung dari Vercel ke GitHub memakai token rahasia
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
            method: 'PUT',
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Upload otomatis via Web API`,
                content: base64Content
            })
        });

        if (!response.ok) return res.status(500).json({ error: 'Gagal ke GitHub' });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
