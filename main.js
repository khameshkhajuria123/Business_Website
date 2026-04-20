// Authentication check removed for local file viewing compatibility.

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle (simple implementation)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(2, 6, 23, 0.95)';
                navLinks.style.padding = '2rem 0';
                navLinks.style.backdropFilter = 'blur(10px)';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    // Handle all forms to prevent default submission and show success
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.textContent = 'Success!';
                btn.style.background = '#10b981';
                btn.style.opacity = '1';
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 3000);
            }, 1500);
        });
    });

    // Global Mock Properties and Favorites Logic
    window.mockProperties = [
        { id: 1, title: "Skyline View Penthouse", price: 1250000, location: "Miami, FL", type: "Apartment", beds: 3, baths: 2, sqft: 2400, image: "images/property_1.png" },
        { id: 2, title: "Modern Family Home", price: 850000, location: "Austin, TX", type: "Single Family", beds: 4, baths: 3, sqft: 3100, image: "images/property_2.png" },
        { id: 3, title: "Luxury Infinity Mansion", price: 5500000, location: "Beverly Hills, CA", type: "Mansion", beds: 6, baths: 7, sqft: 8500, image: "images/hero_bg.png" },
        { id: 4, title: "Central Park Condo", price: 2100000, location: "New York, NY", type: "Apartment", beds: 2, baths: 2, sqft: 1800, image: "images/property_1.png" }
    ];

    const getSavedPropertyIds = () => JSON.parse(localStorage.getItem('savedProperties') || '[]');
    const toggleSavedProperty = (id) => {
        let saved = getSavedPropertyIds();
        if (saved.includes(id)) {
            saved = saved.filter(savedId => savedId !== id);
        } else {
            saved.push(id);
        }
        localStorage.setItem('savedProperties', JSON.stringify(saved));
        return saved.includes(id);
    };

    // Property Rendering and Filtering Logic
    const propertiesContainer = document.getElementById('properties-container');
    if (propertiesContainer) {
        window.renderProperties = (properties) => {
            propertiesContainer.innerHTML = '';
            if (properties.length === 0) {
                propertiesContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">No properties found matching your criteria.</p>';
                return;
            }
            
            const savedIds = getSavedPropertyIds();
            
            properties.forEach(prop => {
                const isSaved = savedIds.includes(prop.id);
                const card = document.createElement('div');
                card.className = 'glass-panel property-card animate-up';
                card.style.position = 'relative';
                card.innerHTML = `
                    <button class="save-btn" data-id="${prop.id}" style="position: absolute; top: 1rem; right: 1rem; background: ${isSaved ? 'var(--accent)' : 'rgba(0,0,0,0.5)'}; border: none; color: #fff; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                        <i data-lucide="heart" style="fill: ${isSaved ? '#fff' : 'none'};"></i>
                    </button>
                    <a href="property-details.html" style="display: block; text-decoration: none; color: inherit;">
                        <img src="${prop.image}" alt="${prop.title}" class="property-img">
                        <div class="property-content">
                            <div class="property-price">$${prop.price.toLocaleString()}</div>
                            <h3 class="property-title">${prop.title}</h3>
                            <div class="property-location">
                                <i data-lucide="map-pin" style="width: 16px;"></i> ${prop.location}
                            </div>
                            <div class="property-meta">
                                <div class="meta-item"><i data-lucide="bed" style="width: 16px;"></i> ${prop.beds} Beds</div>
                                <div class="meta-item"><i data-lucide="bath" style="width: 16px;"></i> ${prop.baths} Baths</div>
                                <div class="meta-item"><i data-lucide="square" style="width: 16px;"></i> ${prop.sqft} sqft</div>
                            </div>
                        </div>
                    </a>
                `;
                propertiesContainer.appendChild(card);
            });
            
            if (window.lucide) { window.lucide.createIcons(); }
            
            document.querySelectorAll('.save-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = parseInt(btn.getAttribute('data-id'));
                    const isNowSaved = toggleSavedProperty(id);
                    btn.style.background = isNowSaved ? 'var(--accent)' : 'rgba(0,0,0,0.5)';
                    btn.innerHTML = `<i data-lucide="heart" style="fill: ${isNowSaved ? '#fff' : 'none'};"></i>`;
                    if (window.lucide) { window.lucide.createIcons(); }
                });
            });
        };

        window.renderProperties(window.mockProperties);

        const filterBtn = document.getElementById('apply-filters-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                const locFilter = document.getElementById('filter-location').value;
                const typeFilter = document.getElementById('filter-type').value;
                const priceFilter = document.getElementById('filter-price').value;

                const filtered = window.mockProperties.filter(prop => {
                    let match = true;
                    if (locFilter && prop.location !== locFilter) match = false;
                    if (typeFilter && prop.type !== typeFilter) match = false;
                    if (priceFilter && prop.price > parseInt(priceFilter)) match = false;
                    return match;
                });

                window.renderProperties(filtered);
            });
        }
    }

    // Dashboard Rendering Logic
    const dashboardSavedContainer = document.getElementById('dashboard-saved-container');
    if (dashboardSavedContainer) {
        const savedIds = getSavedPropertyIds();
        const countElem = document.getElementById('saved-count');
        if (countElem) countElem.textContent = savedIds.length;
        
        if (savedIds.length === 0) {
            dashboardSavedContainer.innerHTML = '<p style="grid-column: 1 / -1; color: var(--text-muted);">You haven\'t saved any properties yet. Go to the <a href="properties.html" style="color: var(--accent);">Properties page</a> to start building your portfolio!</p>';
        } else {
            dashboardSavedContainer.innerHTML = '';
            const savedProps = window.mockProperties.filter(p => savedIds.includes(p.id));
            
            savedProps.forEach(prop => {
                const card = document.createElement('a');
                card.href = 'property-details.html';
                card.className = 'glass-panel property-card animate-up';
                card.innerHTML = `
                    <img src="${prop.image}" alt="${prop.title}" class="property-img">
                    <div class="property-content">
                        <div class="property-price">$${prop.price.toLocaleString()}</div>
                        <h3 class="property-title">${prop.title}</h3>
                        <div class="property-location">
                            <i data-lucide="map-pin" style="width: 16px;"></i> ${prop.location}
                        </div>
                    </div>
                `;
                dashboardSavedContainer.appendChild(card);
            });
            if (window.lucide) { window.lucide.createIcons(); }
    // Mortgage Calculator Logic (if on property details page)
    const downSlider = document.getElementById('calc-down');
    if (downSlider) {
        const price = 1250000; // Hardcoded for demo property
        const downVal = document.getElementById('calc-down-val');
        const rateSlider = document.getElementById('calc-rate');
        const rateVal = document.getElementById('calc-rate-val');
        const termSelect = document.getElementById('calc-term');
        const resultVal = document.getElementById('calc-result');

        const calculateMortgage = () => {
            const downPct = parseFloat(downSlider.value) / 100;
            const principal = price - (price * downPct);
            const rate = parseFloat(rateSlider.value) / 100 / 12;
            const payments = parseInt(termSelect.value) * 12;

            downVal.textContent = downSlider.value + '%';
            rateVal.textContent = rateSlider.value + '%';

            let monthly = 0;
            if (rate === 0) {
                monthly = principal / payments;
            } else {
                monthly = principal * rate * (Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
            }

            resultVal.textContent = '$' + monthly.toLocaleString(undefined, { maximumFractionDigits: 0 });
        };

        downSlider.addEventListener('input', calculateMortgage);
        rateSlider.addEventListener('input', calculateMortgage);
        termSelect.addEventListener('change', calculateMortgage);
        calculateMortgage(); // Initial calc
    }
});
