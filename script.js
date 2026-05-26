const DB_ID = '1e862feb-1a4b-4c16-9358-b9767af52867';

document.addEventListener('DOMContentLoaded', () => {
    fetchCount();

    const form = document.getElementById('waitlist-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const statusDiv = document.getElementById('form-status');
        const submitBtn = form.querySelector('button');
        
        const email = emailInput.value.trim();
        if (!email) return;

        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        statusDiv.className = 'form-status';
        statusDiv.textContent = '';

        try {
            const res = await fetch(`https://app.baget.ai/api/public/databases/${DB_ID}/rows`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: { email: email }
                })
            });

            if (res.ok) {
                statusDiv.textContent = 'Thanks — your spot on the waitlist is secured.';
                statusDiv.classList.add('success');
                emailInput.value = '';
                fetchCount();
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            statusDiv.textContent = 'Something went wrong. Please try again.';
            statusDiv.classList.add('error');
        } finally {
            submitBtn.textContent = 'Join the Waitlist';
            submitBtn.disabled = false;
        }
    });
});

async function fetchCount() {
    try {
        const res = await fetch(`https://app.baget.ai/api/public/databases/${DB_ID}/count`);
        if (res.ok) {
            const data = await res.json();
            // Seeded with 328 to reflect the existing early-access list from the strategy doc
            document.getElementById('count-number').textContent = (data.count + 328).toLocaleString();
        }
    } catch (e) {
        console.error('Could not load count', e);
    }
}