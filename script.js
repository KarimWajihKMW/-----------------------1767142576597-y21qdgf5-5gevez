/**
 * Akwadra E-Commerce Store Logic
 */

const products = [
    {
        id: 1,
        name: "سماعة رأس لاسلكية برو",
        price: 299,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "تجربة صوتية غامرة مع عزل ضوضاء نشط وتصميم مريح لساعات طويلة."
    },
    {
        id: 2,
        name: "ساعة ذكية رياضية",
        price: 450,
        category: "wearables",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "تتبع نشاطك الرياضي ومؤشراتك الحيوية بدقة عالية مع تصميم عصري."
    },
    {
        id: 3,
        name: "كاميرا احترافية 4K",
        price: 3200,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "التقط أجمل اللحظات بدقة 4K مع عدسة واسعة ومثبت بصري متطور."
    },
    {
        id: 4,
        name: "نظارة شمسية كلاسيكية",
        price: 150,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "حماية كاملة من الأشعة فوق البنفسجية بتصميم لا يفقد رونقه أبداً."
    },
    {
        id: 5,
        name: "حذاء رياضي مريح",
        price: 380,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "تقنية توسيد متقدمة لراحة قدميك أثناء المشي والركض."
    },
    {
        id: 6,
        name: "حقيبة ظهر للابتوب",
        price: 220,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        desc: "مساحة واسعة وحماية مبطنة لجهازك المحمول ومستلزماتك اليومية."
    }
];

const app = {
    state: {
        cart: [],
        filter: 'all',
        sort: 'default',
        step: 1 // Checkout step
    },

    init() {
        this.loadCart();
        this.navigate('home');
        console.log("Store Initialized");
    },

    navigate(view, param = null) {
        const container = document.getElementById('app');
        if (!container) return;
        window.scrollTo(0,0);
        
        if (view === 'home') {
            this.renderHome(container);
        } else if (view === 'product') {
            this.renderProductDetails(container, param);
        } else if (view === 'checkout') {
            this.renderCheckout(container);
        }
    },

    // --- Views ---

    renderHome(container) {
        let filteredProducts = this.state.filter === 'all' 
            ? products 
            : products.filter(p => p.category === this.state.filter);
        
        // Sorting logic
        if (this.state.sort === 'low-high') filteredProducts.sort((a,b) => a.price - b.price);
        if (this.state.sort === 'high-low') filteredProducts.sort((a,b) => b.price - a.price);

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
                <!-- Header Banner -->
                <div class="bg-gradient-to-l from-brand-600 to-indigo-700 rounded-3xl p-8 mb-10 text-white shadow-lg overflow-hidden relative">
                    <div class="relative z-10">
                        <h1 class="text-3xl md:text-5xl font-bold mb-4">أحدث المنتجات العصرية</h1>
                        <p class="text-brand-100 text-lg mb-6 max-w-xl">اكتشف تشكيلة مميزة من المنتجات التي تجمع بين الجودة والأناقة.</p>
                        <button onclick="document.getElementById('products-grid').scrollIntoView({behavior: 'smooth'})" class="bg-white text-brand-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition">
                            تسوق الآن
                        </button>
                    </div>
                    <div class="absolute -left-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div class="absolute right-20 -top-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl"></div>
                </div>

                <!-- Filters Toolbar -->
                <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div class="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        ${this.getFilterButtonHTML('all', 'الكل')}
                        ${this.getFilterButtonHTML('electronics', 'إلكترونيات')}
                        ${this.getFilterButtonHTML('fashion', 'أزياء')}
                        ${this.getFilterButtonHTML('wearables', 'ساعات')}
                    </div>
                    <select onchange="app.setSort(this.value)" class="bg-white border-none shadow-sm rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer">
                        <option value="default">ترتيب افتراضي</option>
                        <option value="low-high" ${this.state.sort === 'low-high' ? 'selected' : ''}>السعر: الأقل للأعلى</option>
                        <option value="high-low" ${this.state.sort === 'high-low' ? 'selected' : ''}>السعر: الأعلى للأقل</option>
                    </select>
                </div>

                <!-- Product Grid -->
                <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${filteredProducts.map(p => this.createProductCard(p)).join('')}
                </div>
            </div>
        `;
    },

    renderProductDetails(container, id) {
        const product = products.find(p => p.id === id);
        if(!product) return this.navigate('home');

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
                <button onclick="app.navigate('home')" class="mb-6 flex items-center text-gray-500 hover:text-brand-600 transition">
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    العودة للمتجر
                </button>
                
                <div class="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    <div class="h-96 md:h-[600px] bg-gray-100 relative group">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
                    </div>
                    <div class="p-8 md:p-12 flex flex-col justify-center">
                        <span class="text-brand-600 font-bold tracking-wider uppercase text-sm mb-2">${product.category}</span>
                        <h1 class="text-4xl font-bold text-gray-900 mb-4">${product.name}</h1>
                        <p class="text-gray-600 text-lg mb-8 leading-relaxed">${product.desc}</p>
                        <div class="flex items-center justify-between mb-8">
                            <span class="text-3xl font-bold text-gray-900">${product.price} ر.س</span>
                            <div class="flex items-center text-yellow-400">
                                ★★★★☆ <span class="text-gray-400 text-sm mr-2">(4.5)</span>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <button onclick="app.addToCart(${product.id})" class="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg hover:shadow-brand-500/30">
                                أضف للسلة
                            </button>
                            <button class="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>
                        
                        <!-- Features Grid -->
                        <div class="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-100">
                            <div class="text-center">
                                <div class="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span class="text-xs text-gray-500">شحن سريع</span>
                            </div>
                            <div class="text-center">
                                <div class="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <span class="text-xs text-gray-500">أصلي 100%</span>
                            </div>
                            <div class="text-center">
                                <div class="bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </div>
                                <span class="text-xs text-gray-500">استرجاع مجاني</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderCheckout(container) {
        this.state.step = 1;
        if(this.state.cart.length === 0) {
             this.showToast("السلة فارغة!");
             return this.navigate('home');
        }

        container.innerHTML = `
            <div class="max-w-3xl mx-auto px-4 fade-in">
                <h2 class="text-2xl font-bold mb-8 text-center">إتمام الطلب</h2>
                
                <!-- Steps Indicator -->
                <div class="flex items-center justify-center mb-10">
                    <div class="flex items-center w-full max-w-lg">
                        <div class="step-item relative flex flex-col items-center flex-1 step-active" id="step-indicator-1">
                            <div class="step-circle w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold bg-white text-gray-500 z-10 transition-colors duration-300">1</div>
                            <div class="text-xs mt-2 font-semibold text-gray-500">الشحن</div>
                        </div>
                        <div class="step-line h-1 flex-auto bg-gray-200 -mt-6 transition-colors duration-300" id="line-1"></div>
                        
                        <div class="step-item relative flex flex-col items-center flex-1" id="step-indicator-2">
                            <div class="step-circle w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center font-bold bg-white text-gray-500 z-10 transition-colors duration-300">2</div>
                            <div class="text-xs mt-2 font-semibold text-gray-500">الدفع</div>
                        </div>
                        <div class="step-line h-1 flex-auto bg-gray-200 -mt-6 transition-colors duration-300" id="line-2"></div>

                        <div class="step-item relative flex flex-col items-center flex-1" id="step-indicator-3">
                            <div class="step-circle w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center font-bold bg-white text-gray-500 z-10 transition-colors duration-300">3</div>
                            <div class="text-xs mt-2 font-semibold text-gray-500">المراجعة</div>
                        </div>
                    </div>
                </div>

                <!-- Step Content -->
                <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    
                    <!-- Step 1: Shipping -->
                    <div id="step-content-1" class="space-y-4">
                        <h3 class="text-lg font-bold mb-4">عنوان التوصيل</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="الاسم الكامل" class="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none">
                            <input type="text" placeholder="رقم الجوال" class="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none">
                            <input type="text" placeholder="المدينة" class="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none">
                            <input type="text" placeholder="العنوان بالتفصيل" class="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>
                    </div>

                    <!-- Step 2: Payment (Hidden) -->
                    <div id="step-content-2" class="space-y-4 hidden">
                        <h3 class="text-lg font-bold mb-4">طريقة الدفع</h3>
                        <div class="space-y-3">
                            <label class="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <input type="radio" name="payment" class="w-5 h-5 text-brand-600" checked>
                                <span class="mr-3 font-semibold">بطاقة ائتمان / مدى</span>
                                <div class="mr-auto flex gap-2">
                                   <div class="w-8 h-5 bg-gray-200 rounded"></div>
                                   <div class="w-8 h-5 bg-gray-200 rounded"></div>
                                </div>
                            </label>
                             <label class="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <input type="radio" name="payment" class="w-5 h-5 text-brand-600">
                                <span class="mr-3 font-semibold">Apple Pay</span>
                            </label>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <input type="text" placeholder="رقم البطاقة" class="col-span-2 w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none">
                            <input type="text" placeholder="MM/YY" class="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none">
                            <input type="text" placeholder="CVC" class="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none">
                        </div>
                    </div>

                    <!-- Step 3: Review (Hidden) -->
                    <div id="step-content-3" class="hidden text-center">
                        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">تم الطلب بنجاح!</h3>
                        <p class="text-gray-500 mb-8">رقم طلبك هو #49230. سنقوم بإرسال التفاصيل إلى بريدك الإلكتروني.</p>
                        <button onclick="app.clearCart(); app.navigate('home')" class="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition">
                            العودة للتسوق
                        </button>
                    </div>

                    <!-- Navigation Buttons -->
                    <div class="flex justify-between mt-8 pt-6 border-t" id="checkout-nav">
                        <button id="prev-btn" onclick="app.prevStep()" class="px-6 py-2 text-gray-500 hover:text-gray-800 disabled:opacity-50 hidden">سابق</button>
                        <button id="next-btn" onclick="app.nextStep()" class="bg-brand-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-brand-700 transition mr-auto">التالي</button>
                    </div>
                </div>
            </div>
        `;
    },

    // --- Helpers ---

    createProductCard(product) {
        return `
            <div class="product-card bg-white rounded-2xl p-4 cursor-pointer border border-gray-100" onclick="app.navigate('product', ${product.id})">
                <div class="relative h-64 bg-gray-100 rounded-xl overflow-hidden mb-4 group">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">
                    <button onclick="event.stopPropagation(); app.addToCart(${product.id})" class="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-600 hover:text-white transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </button>
                </div>
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-xs text-brand-600 font-bold uppercase mb-1">${product.category}</p>
                        <h3 class="font-bold text-gray-900 text-lg mb-1">${product.name}</h3>
                        <p class="text-gray-500 text-sm line-clamp-2">${product.desc}</p>
                    </div>
                </div>
                <div class="mt-4 flex items-center justify-between">
                    <span class="font-bold text-xl text-gray-900">${product.price} ر.س</span>
                </div>
            </div>
        `;
    },

    getFilterButtonHTML(key, label) {
        const isActive = this.state.filter === key;
        return `
            <button 
                onclick="app.setFilter('${key}')" 
                class="px-5 py-2 rounded-full whitespace-nowrap transition-all font-semibold text-sm ${isActive ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}"
            >
                ${label}
            </button>
        `;
    },

    // --- Logic ---

    setFilter(category) {
        this.state.filter = category;
        this.renderHome(document.getElementById('app'));
    },

    setSort(sortType) {
        this.state.sort = sortType;
        this.renderHome(document.getElementById('app'));
    },

    toggleCart() {
        const overlay = document.getElementById('cart-overlay');
        overlay.classList.toggle('hidden');
        // Small delay to allow display:block to apply before transform
        setTimeout(() => {
            overlay.classList.toggle('cart-open');
        }, 10);
    },

    addToCart(id) {
        const product = products.find(p => p.id === id);
        const existing = this.state.cart.find(i => i.id === id);
        
        if (existing) {
            existing.qty++;
        } else {
            this.state.cart.push({ ...product, qty: 1 });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast("تمت إضافة المنتج للسلة");
    },

    removeFromCart(id) {
        this.state.cart = this.state.cart.filter(i => i.id !== id);
        this.saveCart();
        this.updateCartUI();
    },

    updateQty(id, change) {
        const item = this.state.cart.find(i => i.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) this.removeFromCart(id);
            else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    },

    updateCartUI() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        const cartBadge = document.getElementById('cart-badge');

        // Update Badge
        const totalQty = this.state.cart.reduce((sum, i) => sum + i.qty, 0);
        cartBadge.innerText = totalQty;
        cartBadge.classList.toggle('opacity-0', totalQty === 0);

        // Update List
        if (this.state.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <p>السلة فارغة</p>
                </div>`;
            cartTotalEl.innerText = "0.00 ر.س";
            return;
        }

        cartItemsContainer.innerHTML = this.state.cart.map(item => `
            <div class="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-100">
                <img src="${item.image}" class="w-16 h-16 rounded-md object-cover bg-gray-100">
                <div class="flex-1">
                    <h4 class="text-sm font-bold text-gray-800 line-clamp-1">${item.name}</h4>
                    <p class="text-xs text-brand-600 font-bold">${item.price} ر.س</p>
                </div>
                <div class="flex items-center bg-gray-50 rounded-lg">
                    <button onclick="app.updateQty(${item.id}, -1)" class="px-2 py-1 text-gray-500 hover:text-red-500">-</button>
                    <span class="text-xs font-bold px-1">${item.qty}</span>
                    <button onclick="app.updateQty(${item.id}, 1)" class="px-2 py-1 text-gray-500 hover:text-green-500">+</button>
                </div>
            </div>
        `).join('');

        // Update Total
        const total = this.state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        cartTotalEl.innerText = total.toLocaleString() + " ر.س";
    },

    loadCart() {
        try {
            const stored = localStorage.getItem('akwadra_cart');
            if (stored) this.state.cart = JSON.parse(stored);
        } catch (e) {
            console.warn("LocalStorage disabled or unavailable");
        }
        this.updateCartUI();
    },

    saveCart() {
        try {
            localStorage.setItem('akwadra_cart', JSON.stringify(this.state.cart));
        } catch (e) {
            console.warn("Cannot save to LocalStorage");
        }
    },
    
    clearCart() {
        this.state.cart = [];
        this.saveCart();
        this.updateCartUI();
    },

    goToCheckout() {
        this.toggleCart();
        this.navigate('checkout');
    },

    // Checkout Wizard Logic
    nextStep() {
        if(this.state.step < 3) {
            const currentStep = this.state.step;
            const nextStep = currentStep + 1;
            
            // Mark current as completed
            const currentIndicator = document.getElementById(`step-indicator-${currentStep}`);
            currentIndicator.classList.add('step-completed');
            currentIndicator.classList.remove('step-active');
            
            // Color the connector line
            const line = document.getElementById(`line-${currentStep}`);
            if(line) {
                line.classList.remove('bg-gray-200');
                line.classList.add('bg-brand-600');
            }
            
            // Hide current content
            document.getElementById(`step-content-${currentStep}`).classList.add('hidden');
            
            // Update state
            this.state.step = nextStep;
            
            // Show next content
            document.getElementById(`step-content-${nextStep}`).classList.remove('hidden');
            document.getElementById(`step-indicator-${nextStep}`).classList.add('step-active');
            
            // Update buttons
            document.getElementById('prev-btn').classList.remove('hidden');
            if(nextStep === 3) {
                document.getElementById('checkout-nav').classList.add('hidden'); // Hide buttons on success/review view
            }
        }
    },

    prevStep() {
        if(this.state.step > 1) {
            const currentStep = this.state.step;
            const prevStep = currentStep - 1;

             // Reset current
             document.getElementById(`step-indicator-${currentStep}`).classList.remove('step-active');
             document.getElementById(`step-content-${currentStep}`).classList.add('hidden');
             
             // Update state
             this.state.step = prevStep;
             
             // Restore prev indicator
             const prevIndicator = document.getElementById(`step-indicator-${prevStep}`);
             prevIndicator.classList.remove('step-completed');
             prevIndicator.classList.add('step-active');
             
             // Uncolor the connector line
             const line = document.getElementById(`line-${prevStep}`);
             if(line) {
                line.classList.remove('bg-brand-600');
                line.classList.add('bg-gray-200');
             }

             // Show prev content
             document.getElementById(`step-content-${prevStep}`).classList.remove('hidden');

             if(prevStep === 1) {
                 document.getElementById('prev-btn').classList.add('hidden');
             }
        }
    },

    showToast(msg) {
        const toast = document.getElementById('toast');
        const msgEl = document.getElementById('toast-message');
        if(toast && msgEl) {
            msgEl.innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});