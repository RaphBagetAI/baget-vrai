module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email, name, source } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // We have two waitlist databases depending on the payload
        // The default waitlist on the landing page captures only email
        let dbId = process.env.WAITLIST_DB_ID || '1e862feb-1a4b-4c16-9358-b9767af52867';
        let payload = { email };

        // The extended waitlist at /waitlist captures name, email, and timestamp
        if (source === 'extended' || name) {
            dbId = process.env.EXTENDED_WAITLIST_DB_ID || '7d29df69-dda6-4e02-bbbe-0490904d9937';
            payload = {
                name: name || 'Unknown',
                email: email,
                timestamp: new Date().toISOString()
            };
        }

        const bagetRes = await fetch(`https://app.baget.ai/api/public/databases/${dbId}/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: payload })
        });

        if (!bagetRes.ok) {
            const errorText = await bagetRes.text();
            throw new Error(`Failed to save to Baget DB: ${bagetRes.status} ${errorText}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Waitlist Submission Error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
