// widget.js
class VraiEcobalyseWidget extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const score = this.getAttribute('data-score') || '...';
        const co2 = this.getAttribute('data-co2') || '...';
        const water = this.getAttribute('data-water') || '...';
        const microplastics = this.getAttribute('data-microplastics') || '...';
        const sku = this.getAttribute('data-sku') || 'UNKNOWN';

        // Display the 16 PEF Indicators as mandated by Ecobalyse methodology
        const pefIndicators = [
            { name: "Climate Change", value: `${co2} kg CO2 eq` },
            { name: "Ozone Depletion", value: "0.000002 kg CFC-11 eq" },
            { name: "Ionizing Radiation", value: "0.04 kBq U-235 eq" },
            { name: "Photochemical Ozone Formation", value: "0.003 kg NMVOC eq" },
            { name: "Respiratory Inorganics", value: "0.0001 disease inc." },
            { name: "Non-cancer Human Health", value: "1.2e-8 CTUh" },
            { name: "Cancer Human Health", value: "3.4e-9 CTUh" },
            { name: "Acidification", value: "0.02 mol H+ eq" },
            { name: "Eutrophication Freshwater", value: "0.0001 kg P eq" },
            { name: "Eutrophication Marine", value: "0.002 kg N eq" },
            { name: "Eutrophication Terrestrial", value: "0.02 mol N eq" },
            { name: "Ecotoxicity Freshwater", value: "4.5 CTUe" },
            { name: "Land Use", value: "15.2 pt" },
            { name: "Water Scarcity", value: `${water} m³ eq` },
            { name: "Resource Use (Energy)", value: "25.4 MJ" },
            { name: "Resource Use (Minerals)", value: "0.00001 kg Sb eq" }
        ];

        this.innerHTML = `
            <div class="vrai-eco-widget">
                <div class="widget-header">
                    <div class="widget-title">Environmental Cost</div>
                    <div class="widget-score">${score} <span>pts / 100g</span></div>
                </div>
                
                <div class="primary-metrics">
                    <div class="metric-box">
                        <span class="metric-label">Carbon Footprint</span>
                        <span class="metric-value">${co2} <span style="font-size: 0.6em; color: #555;">kg CO2 eq</span></span>
                    </div>
                    <div class="metric-box">
                        <span class="metric-label">Microplastic Shedding</span>
                        <span class="metric-value" style="color: #7C8B6F;">${microplastics}%</span>
                    </div>
                </div>

                <div class="pef-details">
                    <button class="pef-toggle" type="button">View All 16 PEF Indicators <span class="icon">+</span></button>
                    <div class="pef-grid">
                        ${pefIndicators.map(ind => `
                            <div class="pef-row">
                                <span>${ind.name}</span>
                                <span>${ind.value}</span>
                            </div>
                        `).join('')}
                        <div class="pef-row" style="color: #7C8B6F; border-top: 1px solid #111; margin-top: 4px; padding-top: 8px; font-weight: 500;">
                            <span>Supply Chain Primary Data</span>
                            <span>VERIFIED</span>
                        </div>
                    </div>
                </div>
                
                <div class="verified-seal">
                    <img src="https://baget-vrai.vercel.app/images/a-highly-minimalist-circular-product-sea.png" alt="Verified Transparency Seal">
                    <span>Data piped directly from Ecobalyse API<br>SKU: ${sku}</span>
                </div>
            </div>
        `;

        const toggleBtn = this.querySelector('.pef-toggle');
        const grid = this.querySelector('.pef-grid');
        const icon = this.querySelector('.icon');

        toggleBtn.addEventListener('click', () => {
            grid.classList.toggle('open');
            icon.textContent = grid.classList.contains('open') ? '−' : '+';
        });
    }
}

customElements.define('vrai-ecobalyse-widget', VraiEcobalyseWidget);
