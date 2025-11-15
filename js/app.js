
        // Mock BTC price and wallet for calculation and display
        const MOCK_BTC_PRICE_USD = 60000;
        const MOCK_WALLET_ADDRESS = 'bc1qgwcsk7ejyq3u5747xa9r49lyn3a3dpk7e2xx26'; // Placeholder wallet address
        
        // Data for the pricing cards. Using placeholders for images based on uploaded files.
        const units = [
            { 
                title: 'Bronze', daily: '$4', monthly: 'BTC 0.0025 / $50', yearly: 'BTC 0.024', rent: 10, popular: false, 
                img: 'https://placehold.co/128x128/283a8a/ffb64d?text=Bronze+Rig', // Placeholder for Bronze
                schedule: [
                    { label: '1 Day', value: '$4' }, { label: '2 Days', value: '$8' }, { label: '3 Days', value: '$12' },
                    { label: '1 Month', value: '$50' }, { label: '6 Months', value: '$300' }, { label: '1 Year', value: '$600' }
                ],
                btcEquivalent: (10 / MOCK_BTC_PRICE_USD).toFixed(6),
                usdAmount: 10.00,
                walletAddress: MOCK_WALLET_ADDRESS
            },
            { 
                title: 'Silver', daily: '$22', monthly: 'BTC 0.005 / $102', yearly: 'BTC 0.060', rent: 50, popular: true, 
                img: 'https://placehold.co/128x128/7b3ed6/ffb64d?text=Silver+Rig', // Placeholder for Silver
                schedule: [
                    { label: '1 Day', value: '$22' }, { label: '2 Days', value: '$44' }, { label: '3 Days', value: '$66' },
                    { label: '1 Month', value: '$102' }, { label: '6 Months', value: '$612' }, { label: '1 Year', value: '$1224' }
                ],
                btcEquivalent: (50 / MOCK_BTC_PRICE_USD).toFixed(6),
                usdAmount: 50.00,
                walletAddress: MOCK_WALLET_ADDRESS
            },
            { 
                title: 'Gold', daily: '$60', monthly: 'BTC 0.015 / $305', yearly: 'BTC 0.180', rent: 150, popular: false, 
                img: 'https://placehold.co/128x128/ffb64d/283a8a?text=Gold+Rig', // Placeholder for Gold
                schedule: [
                    { label: '1 Day', value: '$60' }, { label: '2 Days', value: '$120' }, { label: '3 Days', value: '$180' },
                    { label: '1 Month', value: '$305' }, { label: '6 Months', value: '$1830' }, { label: '1 Year', value: '$3660' }
                ],
                btcEquivalent: (150 / MOCK_BTC_PRICE_USD).toFixed(6),
                usdAmount: 150.00,
                walletAddress: MOCK_WALLET_ADDRESS
            },
            { 
                title: 'Platinum', daily: '$150', monthly: 'BTC 0.040 / $950', yearly: 'BTC 0.480', rent: 500, popular: false, 
                img: 'https://placehold.co/128x128/f7f8fb/7b3ed6?text=Platinum+Rig', // Placeholder for Platinum
                schedule: [
                    { label: '1 Day', value: '$150' }, { label: '2 Days', value: '$300' }, { label: '3 Days', value: '$450' },
                    { label: '1 Month', value: '$950' }, { label: '6 Months', value: '$5700' }, { label: '1 Year', value: '$11400' }
                ],
                btcEquivalent: (500 / MOCK_BTC_PRICE_USD).toFixed(6),
                usdAmount: 500.00,
                walletAddress: MOCK_WALLET_ADDRESS
            }
        ];

        let selectedUnitData = null; // To hold the data of the plan chosen by the user
        
        // --- DOM Elements ---
        const landingPage = document.getElementById('landing-page');
        const walletPage = document.getElementById('wallet-page');
        const paymentPage = document.getElementById('payment-page'); 
        const startMiningBtn = document.getElementById('startMiningBtn');
        const pricingGrid = document.querySelector('#pricing .grid');

        // Wallet Page elements
        const walletUnitTitle = document.getElementById('wallet-unit-title');
        const walletRentPrice = document.getElementById('wallet-rent-price');
        const profitScheduleTable = document.getElementById('profit-schedule-table');
        const walletUnitImage = document.getElementById('wallet-unit-image');
        const orderForm = document.getElementById('order-form');
        
        // Payment Page elements
        const paymentUnitTitleFull = document.getElementById('payment-unit-title-full');
        const paymentUnitTitleSmall = document.getElementById('payment-unit-title-small');
        const paymentProfitGrid = document.getElementById('payment-profit-grid');
        const paymentWalletAddress = document.getElementById('payment-wallet-address');
        const paymentAmountDisplay = document.getElementById('payment-amount-display'); // New element ID
        const paymentUsdToggle = document.getElementById('payment-usd-toggle');
        const paymentQrCode = document.getElementById('payment-qr-code');
        const copyAddrBtn = document.getElementById('copyAddr');
        const toast = document.getElementById('toast');
        const paymentStatusMessage = document.getElementById('payment-status-message');


        // --- Helper Functions ---
        
        // Function to switch between views (Landing vs. Wallet vs. Payment)
        function showView(viewId, unitName = null) {
            // Stop payment simulation when changing views
            if (paymentInterval) {
                clearInterval(paymentInterval);
                paymentInterval = null;
            }

            landingPage.classList.add('hidden');
            walletPage.classList.add('hidden');
            paymentPage.classList.add('hidden'); 
            
            // DEFENSIVE CHECK: Ensure unitName is a string before using it
            if (typeof unitName === 'string' && unitName) {
                selectedUnitData = units.find(u => u.title.toLowerCase() === unitName.toLowerCase());
            }

            if (viewId === 'wallet' && selectedUnitData) {
                populateWalletPage(selectedUnitData);
                walletPage.classList.remove('hidden');
                window.location.hash = `wallet=${selectedUnitData.title.toLowerCase()}`;
            } else if (viewId === 'payment' && selectedUnitData) {
                populatePaymentPage(selectedUnitData);
                paymentPage.classList.remove('hidden');
                window.location.hash = `payment=${selectedUnitData.title.toLowerCase()}`;
                simulatePaymentCheck(); // Start the polling simulation
            } else {
                // Landing page view
                landingPage.classList.remove('hidden');
                if (window.location.hash.includes('wallet') || window.location.hash.includes('payment')) {
                    window.location.hash = ''; 
                }
                selectedUnitData = null;
            }
            window.scrollTo(0, 0); // Always scroll to top on view change
        }

        // Populates the details on the Wallet/Checkout page
        function populateWalletPage(unit) {
            walletUnitTitle.textContent = `${unit.title} mining unit`;
            walletRentPrice.textContent = `$${unit.rent}.00`;
            walletUnitImage.src = unit.img.replace('128x128', '300x250'); 
            
            // Generate the profit schedule table content
            let scheduleHtml = '';
            unit.schedule.forEach(item => {
                // Tailwind based structure for the schedule
                scheduleHtml += `
                    <div class="col-span-1 border-r border-white/20 last:border-r-0 py-1">
                        <p class="font-bold text-lg">${item.value}</p>
                        <p class="opacity-80 text-xs">${item.label}</p>
                    </div>
                `;
            });
            profitScheduleTable.innerHTML = scheduleHtml;
            document.getElementById('email').value = ''; // Clear form fields
            document.getElementById('wallet-input').value = ''; 
        }

        // Populates the details on the NEW Payment page
        function populatePaymentPage(unit) {
            // Header
            paymentUnitTitleFull.innerHTML = `${unit.title} <span style="color:white;opacity:.95">mining unit</span>`;
            paymentUnitTitleSmall.textContent = unit.title;
            
            // Payment schedule
            let scheduleHtml = '';
            unit.schedule.forEach(item => {
                scheduleHtml += `
                    <div class="profit-item">
                        <span class="label">${item.label}</span>
                        <span class="amount">${item.value}</span>
                    </div>
                `;
            });
            paymentProfitGrid.innerHTML = scheduleHtml;

            // Payment details
            paymentWalletAddress.textContent = unit.walletAddress;
            
            let usdShown = false; // Start showing BTC amount first, as per payment protocol
            
            // Function to update the amount display
            const updateAmountDisplay = () => {
                if (usdShown) {
                    paymentAmountDisplay.innerHTML = `<span style="font-weight:700">$${unit.usdAmount.toFixed(2)}</span>`;
                    paymentUsdToggle.textContent = `(${unit.btcEquivalent} BTC)`;
                } else {
                    paymentAmountDisplay.innerHTML = `<span style="font-weight:700">${unit.btcEquivalent}</span> <span style="font-weight:400">BTC</span>`;
                    paymentUsdToggle.textContent = `($${unit.usdAmount.toFixed(2)} USD)`;
                }
            };

            // Set up click handler for toggling USD/BTC
            paymentUsdToggle.onclick = () => {
                usdShown = !usdShown;
                updateAmountDisplay();
            };

            // Initial display
            updateAmountDisplay(); 

            // QR Code generation
            const qrData = `bitcoin:${unit.walletAddress}?amount=${unit.btcEquivalent}`;
            // Use a higher resolution placeholder QR for better quality
            // paymentQrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
            
            // Reset status message
            paymentStatusMessage.textContent = 'Waiting for payment ...';
        }


        // Helper function to generate a pricing card HTML string
        function createCard(title, profitDaily, profitMonthly, profitYearly, rentPrice, isPopular, imageSrc) {
            return `
            <div class="card-hover bg-white p-6 rounded-2xl shadow-2xl text-center fade-in-section relative group">
                ${isPopular ? '<div class="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl transform translate-y-[-5px] translate-x-[5px] rotate-3 shadow-md">MOST POPULAR</div>' : ''}
                <img src="${imageSrc}" alt="${title}" class="mx-auto h-32 w-32 object-contain mb-4 transition duration-500 group-hover:scale-105"/>
                <h3 class="text-2xl font-bold text-gray-900">${title} mining unit</h3>
                
                <div class="my-4">
                    <p class="text-4xl font-black text-[var(--color-primary)]">$${rentPrice}.00</p>
                    <p class="text-sm text-gray-500">Rent Price (One-time)</p>
                </div>

                <div class="mt-4 space-y-2 text-left pricing-card-profit-details">
                    <p>Profit per day: <span class="font-semibold text-green-600">${profitDaily}</span></p>
                    <p>Profit per month: <span class="font-semibold text-green-600">${profitMonthly}</span></p>
                    <p>Profit per year: <span class="font-semibold text-green-600">${profitYearly}</span></p>
                </div>

                <button data-unit="${title}" class="enrollNowBtn animated-button mt-6 bg-[var(--color-accent)] text-white font-bold py-2 px-6 rounded-xl shadow-md w-full transition duration-300">
                    Enroll Now
                </button>
            </div>
            `;
        }
        
        // --- Modal Functionality ---
        function openModal(message, title = 'Success!') {
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalContent = document.getElementById('modalContent');
            const actionModal = document.getElementById('actionModal');
            
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            actionModal.classList.remove('hidden');
            actionModal.classList.add('flex');

            setTimeout(() => {
                modalContent.classList.remove('scale-90', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }
        
        // Updated closeModal to redirect to payment page
        window.closeModal = function(unitName = null) {
            const modalContent = document.getElementById('modalContent');
            const actionModal = document.getElementById('actionModal');
            
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-90', 'opacity-0');
            
            setTimeout(() => {
                actionModal.classList.add('hidden');
                actionModal.classList.remove('flex');
                
                // If a unitName is provided, redirect to the payment page
                if (typeof unitName === 'string' && unitName) {
                    showView('payment', unitName);
                }
            }, 300);
        }

        // Toast helper for copy confirmation
        function showToast(text = 'Copied'){
            toast.textContent = text;
            toast.classList.add('show');
            clearTimeout(showToast._t);
            showToast._t = setTimeout(()=> toast.classList.remove('show'), 2000);
        }
        
        // --- Event Handlers ---
        
        // Handle final order submission
        function handleOrderNow(e) {
            e.preventDefault();
            
            if (!selectedUnitData) {
                openModal("Error: Please select a mining unit first.", "Error");
                return;
            }

            const email = document.getElementById('email').value;
            const wallet = document.getElementById('wallet-input').value;

            // Simple validation check
            if (!email || !wallet) {
                openModal("Error: Please fill in all required fields.", "Error");
                return;
            }

            const orderDetails = {
                unit: selectedUnitData.title,
                rent: selectedUnitData.rent,
                email: email,
                wallet: wallet
            };
            
            console.log("Order submitted:", orderDetails);

            // Show success message and prepare redirect to payment page
            document.getElementById('modalTitle').textContent = "Order Placed!";
            document.getElementById('modalMessage').textContent = `Your order for the ${selectedUnitData.title} unit has been successfully placed. Proceeding to payment.`;
            document.querySelector('#modalContent button').textContent = 'Proceed to Payment';
            // Pass the unit title string to closeModal, which will trigger the payment page redirect
            document.querySelector('#modalContent button').onclick = () => { closeModal(selectedUnitData.title); }; 
            
            openModal(); // Open modal without parameters to use the custom settings
        }

        // Handle URL hash change for deep linking to wallet or payment page
        function handleHashChange() {
            const hash = window.location.hash.substring(1); 
            const parts = hash.split('=');
            if (parts.length === 2 && parts[1]) {
                const viewType = parts[0];
                const unitName = parts[1];
                if (viewType === 'wallet' || viewType === 'payment') {
                    const unit = units.find(u => u.title.toLowerCase() === unitName.toLowerCase());
                    if (unit) {
                        selectedUnitData = unit;
                        showView(viewType, unitName);
                        return;
                    }
                }
            }
            
            // Fallback: Show landing page and handle potential section scrolling
            showView('landing');
            if (hash && ['home', 'pricing', 'about', 'wallet-info'].includes(hash.replace('#', ''))) {
                setTimeout(() => {
                    document.getElementById(hash.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }
        }
        
        // Copies the BTC wallet address to the clipboard
        function copyWalletAddress() {
            const address = paymentWalletAddress.textContent;
            
            // Use document.execCommand('copy') for better compatibility in iframes
            const tempInput = document.createElement('textarea');
            tempInput.value = address;
            document.body.appendChild(tempInput);
            tempInput.select();
            
            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (err) {
                console.error('Failed to copy text', err);
            }
            
            document.body.removeChild(tempInput);

            if (success) {
                showToast('Address copied');
            } else {
                showToast('Copy failed');
            }
        }

        // OPTIONAL: fake "polling" visual (non-blocking)
        let paymentInterval = null;
        function simulatePaymentCheck(){
            if(paymentInterval) clearInterval(paymentInterval);

            let tries = 0;
            const max = 8; // how many times to "check"
            paymentStatusMessage.textContent = 'Waiting for payment ...';

            paymentInterval = setInterval(() => {
                // Only run if on payment page AND it's visible
                if(paymentPage && !paymentPage.classList.contains('hidden')) { 
                    tries++;
                    if(tries === 4){
                        paymentStatusMessage.textContent = 'Pending confirmation of transaction, sit tight...';
                    }
                    if(tries >= max){
                        clearInterval(paymentInterval);
                        paymentStatusMessage.textContent = 'Still waiting for confirmation. Please do not close this tab or refresh the page after making your payment.';
                    }
                } else {
                    clearInterval(paymentInterval);
                    paymentInterval = null;
                }
            }, 2500);
        }

        // --- Initialization and Listener Setup ---

        function setupListeners() {
            
            // 1. Enroll Now Buttons (on Pricing section)
            pricingGrid.addEventListener('click', (e) => {
                const button = e.target.closest('.enrollNowBtn');
                if (button) {
                    e.preventDefault();
                    const unitName = button.dataset.unit;
                    showView('wallet', unitName);
                }
            });

            // 2. Navigation Links (handles all top nav and 'Back' links)
            document.querySelectorAll('.nav-link, a[data-view-target]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const viewTarget = e.currentTarget.dataset.viewTarget;
                    const sectionTarget = e.currentTarget.dataset.sectionTarget;
                    
                    if (viewTarget === 'landing') {
                         showView('landing');
                         if (sectionTarget) {
                            setTimeout(() => {
                                document.querySelector(sectionTarget)?.scrollIntoView({ behavior: 'smooth' });
                            }, 50);
                         }
                    } 
                    // No other view links currently in use, wallet page back button is handled by showView('landing')
                });
            });

            // 3. Start Mining Button (on Hero section)
            startMiningBtn.addEventListener('click', () => {
                showView('landing');
                setTimeout(() => {
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }, 50); 
            });

            // 4. Order Now Form Submission
            orderForm.addEventListener('submit', handleOrderNow);
            
            // 5. Copy Wallet Button (on Payment page)
            copyAddrBtn.addEventListener('click', copyWalletAddress);
            
            // Accessibility: allow keyboard copy with Enter when focus on copy button
            copyAddrBtn.addEventListener('keydown', (e)=>{
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    copyAddrBtn.click();
                }
            });
            
            // Listen for hash changes (e.g., browser back/forward)
            window.addEventListener('hashchange', handleHashChange);
        }

        // Function to initialize the pricing grid (runs on load)
        function initializePricingGrid() {
            if (pricingGrid) {
                let htmlContent = '';
                units.forEach(unit => {
                    htmlContent += createCard(unit.title, unit.daily, unit.monthly, unit.yearly, unit.rent, unit.popular, unit.img);
                });
                pricingGrid.innerHTML = htmlContent;
                // Add intersection observer to the fade-in sections
                document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
            }
        }
        
        // --- Animation: Fade-in on Scroll (Intersection Observer) ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Removed unobserve to allow re-triggering if scrolling back and forth, useful for sections.
                }
            });
        }, {
            threshold: 0.2, 
            rootMargin: '0px 0px -100px 0px'
        });


        // Initial setup on window load
        window.onload = function() {
            initializePricingGrid(); 
            setupListeners();
            // Check hash on load to determine initial view (Wallet, Payment, or Landing)
            handleHashChange();
        };
        
    
// ADMIN INTEGRATION
document.addEventListener("DOMContentLoaded",()=>{
 // Apply admin wallet override
 const savedWallet = localStorage.getItem("global_wallet");
 if(savedWallet){
   const el=document.getElementById("payment-wallet-address");
   if(el) el.textContent=savedWallet;
 }
 // apply qr override
 const qr=localStorage.getItem("qr_code");
 const qrEl=document.getElementById("payment-qr-code");
 if(qr && qrEl) qrEl.src=qr;
 // apply pricing overrides
 units.forEach(u=>{
   const s=localStorage.getItem("pricing_"+u.title);
   if(s) u.img=s;
 });
});
