
        // --- UTILS ---
        setInterval(() => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-GB', { hour12: false });
            const el = document.getElementById('clock');
            if(el) el.innerText = time;
        }, 1000);

        // --- MOCK DATABASE (LocalStorage) ---
        const DB = {
            get: (key) => JSON.parse(localStorage.getItem(`fiuer_${key}`) || '[]'),
            set: (key, val) => localStorage.setItem(`fiuer_${key}`, JSON.stringify(val)),
            getUser: () => JSON.parse(localStorage.getItem('fiuer_user')),
            setUser: (user) => localStorage.setItem('fiuer_user', JSON.stringify(user)),
            logout: () => localStorage.removeItem('fiuer_user')
        };

        // --- STATE MANAGEMENT ---
        const State = {
            view: 'home', 
            user: DB.getUser(),
            certificates: DB.get('certificates'),
            currentTemplate: 0,
            templates: [
                { id: 1, name: "Engineering", bg: "#f0f0f0", border: "#000000", font: "monospace", accent: "#ff4d00" },
                { id: 2, name: "Dark Mode", bg: "#111111", border: "#ffffff", font: "sans-serif", accent: "#00ff00" },
                { id: 3, name: "Swiss", bg: "#ffffff", border: "#ff0000", font: "sans-serif", accent: "#000000" }
            ]
        };

        const EditorState = {
            baseImage: './CR templetes/temp1.png',
            logoImage: null,
            elements: {
                name: { x: 50, y: 45 },
                desc: { x: 50, y: 55 },
                sig1: { x: 25, y: 80 },
                sig2: { x: 75, y: 80 },
                logo: { x: 50, y: 15 }
            }
        };

        function init() { render(); }
        function navigate(view) { State.view = view; render(); }
        function logout() { DB.logout(); State.user = null; navigate('home'); }

        // --- RENDER ENGINE ---
        function render() {
            const app = document.getElementById('app');
            app.innerHTML = '';

            if (State.view === 'home') renderHome(app);
            else if (State.view === 'login') renderLogin(app);
            else if (State.view === 'verify') renderVerify(app);
            
            else if (State.user) {
                renderLayout(app, () => {
                    if (State.view === 'dashboard') renderDashboard();
                    else if (State.view === 'create') renderCreateWizard();
                    else if (State.view === 'certificates') renderCertificateList();
                    else if (State.view === 'email') renderEmailSender();
                });
            } else {
                navigate('login');
            }
        }

        // 1. HOME / LANDING (TE STYLE)
        function renderHome(container) {
            container.innerHTML = `
                <div class="flex flex-col w-full h-full overflow-y-auto">
                    <!-- Hero Section -->
                    <div class="flex-1 flex flex-col items-center justify-center p-8 relative">

                        <div class="max-w-4xl w-full border-2 border-black bg-white p-8 md:p-16 shadow-hard relative">
                            <!-- Screws -->
                            <div class="absolute top-2 left-2 w-3 h-3 border border-black rounded-full flex items-center justify-center"><div class="w-2 h-[1px] bg-black rotate-45"></div></div>
                            <div class="absolute top-2 right-2 w-3 h-3 border border-black rounded-full flex items-center justify-center"><div class="w-2 h-[1px] bg-black rotate-45"></div></div>
                            <div class="absolute bottom-2 left-2 w-3 h-3 border border-black rounded-full flex items-center justify-center"><div class="w-2 h-[1px] bg-black rotate-45"></div></div>
                            <div class="absolute bottom-2 right-2 w-3 h-3 border border-black rounded-full flex items-center justify-center"><div class="w-2 h-[1px] bg-black rotate-45"></div></div>

                            <div class="text-left mb-12">
                                <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">Flurr<br><span class="text-te-orange"></span></h1>
                                <p class="font-mono text-sm max-w-md border-l-4 border-te-orange pl-4">
                                    We Help You to  Create Digital Credentials Easily.
                                </p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onclick="navigate('login')" class="btn-te py-4 px-8 text-lg">
                                    [ Login or Signup ]
                                </button>
                                <button onclick="navigate('verify')" class="btn-te py-4 px-8 bg-gray-200 hover:bg-gray-300 hover:text-black">
                                    verify Certificates
                                </button>
                            </div>
                        </div>

                        <!-- Technical Footer -->
                        <div class="mt-12 font-mono text-[10px] opacity-60 text-center">
                            COPYRIGHT 2026 FLURR . <br>
                            DESIGNED IN GUNTUR.
                        </div>
                    </div>
                </div>
            `;
        }

        // 2. LOGIN (TE STYLE)
        function renderLogin(container) {
            container.innerHTML = `
                <div class="w-full h-full flex items-center justify-center p-4">
                    <div class="bg-white border-2 border-black p-8 shadow-hard max-w-sm w-full relative">
                        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-2 font-mono text-xs">AUTH_MODULE</div>
                        
                        <div class="mb-8 text-center">
                            <h2 class="font-bold text-2xl tracking-tighter">Login</h2>
                            <p class="font-mono text-[10px] text-gray-500 mt-1">Login with Your Email Address</p>
                        </div>
                        
                        <form onsubmit="handleLogin(event)" class="space-y-4">
                            <div>
                                <label class="block font-mono text-[10px] uppercase mb-1">User_ID (Email)</label>
                                <input type="email" value="demo@fiuer.com" class="input-te w-full p-3 text-sm" required>
                            </div>
                            <div>
                                <label class="block font-mono text-[10px] uppercase mb-1">Passcode</label>
                                <input type="password" value="password" class="input-te w-full p-3 text-sm" required>
                            </div>
                            <button type="submit" class="btn-te w-full py-3 mt-4">
                                AUTHENTICATE >
                            </button>
                        </form>
                        
                        <div class="mt-6 border-t border-dashed border-gray-400 pt-4 text-center">
                             <button onclick="navigate('home')" class="font-mono text-[10px] hover:text-te-orange hover:underline">< BACK TO ROOT</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function handleLogin(e) {
            e.preventDefault();
            const user = { 
                id: 'USR-' + Math.floor(Math.random()*1000), 
                name: 'OPERATOR_1', 
                email: 'demo@fiuer.com', 
                plan: 'PRO_AUDIO' 
            };
            DB.setUser(user);
            State.user = user;
            navigate('dashboard');
        }

        // 3. DASHBOARD LAYOUT (TE STYLE)
        function renderLayout(container, contentCallback) {
            container.innerHTML = `
                <!-- Sidebar Control Strip -->
                <aside class="hidden md:flex flex-col w-20 bg-[#f2f2f2] border-r border-black h-full shrink-0 items-center py-4 z-20">
                    <div class="mb-8 font-black text-xl tracking-tighter rotate-90 origin-center whitespace-nowrap mt-4">Flurr</div>
                    
                    <nav class="flex-1 flex flex-col space-y-6 w-full items-center">
                        <button onclick="navigate('dashboard')" class="w-12 h-12 border border-black bg-white flex items-center justify-center hover:bg-te-orange hover:text-white transition-colors shadow-hard-sm ${State.view === 'dashboard' ? 'bg-black text-white' : ''}">
                            <i class="fa-solid fa-chart-simple"></i>
                        </button>
                        <button onclick="navigate('create')" class="w-12 h-12 border border-black bg-white flex items-center justify-center hover:bg-te-orange hover:text-white transition-colors shadow-hard-sm ${State.view === 'create' ? 'bg-black text-white' : ''}">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                        <button onclick="navigate('certificates')" class="w-12 h-12 border border-black bg-white flex items-center justify-center hover:bg-te-orange hover:text-white transition-colors shadow-hard-sm ${State.view === 'certificates' ? 'bg-black text-white' : ''}">
                            <i class="fa-solid fa-list-ul"></i>
                        </button>
                        <button onclick="navigate('email')" class="w-12 h-12 border border-black bg-white flex items-center justify-center hover:bg-te-orange hover:text-white transition-colors shadow-hard-sm ${State.view === 'email' ? 'bg-black text-white' : ''}">
                            <i class="fa-solid fa-envelope"></i>
                        </button>
                    </nav>

                    <div class="mt-auto flex flex-col gap-4">
                        <div class="w-12 h-1 bg-gray-300 mx-auto"></div>
                        <div class="w-12 h-1 bg-gray-300 mx-auto"></div>
                        <button onclick="logout()" class="w-10 h-10 rounded-full border border-black flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors text-xs">
                            PWR
                        </button>
                    </div>
                </aside>

                <!-- Main Content Area -->
                <main class="flex-1 h-full overflow-y-auto relative scroll-smooth">
                     <!-- Mobile Nav -->
                    <div class="md:hidden bg-black text-white p-4 flex justify-between items-center sticky top-0 z-30 border-b border-white">
                        <span class="font-bold">Flurr.SYS</span>
                        <div class="flex gap-4">
                            <button onclick="navigate('dashboard')"><i class="fa-solid fa-chart-simple"></i></button>
                            <button onclick="navigate('create')"><i class="fa-solid fa-plus"></i></button>
                            <button onclick="navigate('certificates')"><i class="fa-solid fa-list-ul"></i></button>
                            <button onclick="navigate('email')"><i class="fa-solid fa-envelope"></i></button>
                            <button onclick="logout()"><i class="fa-solid fa-power-off"></i></button>
                        </div>
                    </div>

                    <div id="page-content" class="p-6 md:p-12 max-w-7xl mx-auto min-h-full">
                        <!-- Dynamic Page Content -->
                    </div>
                </main>
            `;
            
            contentCallback();
        }

        // 4. DASHBOARD PAGE (TE STYLE)
        function renderDashboard() {
            const certs = State.certificates;
            const total = certs.length;
            const content = document.getElementById('page-content');
            
            content.innerHTML = `
                <div class="mb-12 border-b border-black pb-4 flex justify-between items-end">
                    <div>
                        <h1 class="text-4xl font-black  tracking-tighter">Dashboard</h1>
                        <p class="font-mono text-xs mt-1 text-gray-500">Welcome to Flurr, ${State.user.name}!</p>
                    </div>
                    <div class="font-mono text-xs bg-black text-white px-2 py-1">USR: ${State.user.name}</div>
                </div>

                <!-- Stats Modules -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <!-- Module 1 -->
                    <div class="bg-white border border-black p-4 relative shadow-hard">
                        <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 border border-black"></div>
                        <p class="font-mono text-[10px] uppercase mb-2">Total_Output</p>
                        <div class="font-mono text-5xl font-bold tracking-tighter">${total.toString().padStart(3, '0')}</div>
                        <div class="w-full bg-gray-200 h-2 mt-4 border border-black">
                            <div class="bg-black h-full" style="width: ${(total/100)*100}%"></div>
                        </div>
                    </div>

                    <!-- Module 2 -->
                    <div class="bg-white border border-black p-4 relative shadow-hard">
                         <div class="absolute top-2 right-2 w-2 h-2 rounded-full bg-te-orange border border-black"></div>
                        <p class="font-mono text-[10px] uppercase mb-2">Quota_Remaining</p>
                        <div class="font-mono text-5xl font-bold tracking-tighter">${(100 - total).toString().padStart(3, '0')}</div>
                         <div class="flex gap-1 mt-4">
                            <div class="h-2 w-2 bg-black"></div>
                            <div class="h-2 w-2 bg-black"></div>
                            <div class="h-2 w-2 bg-black"></div>
                            <div class="h-2 w-2 bg-gray-300"></div>
                        </div>
                    </div>

                    <!-- Module 3 -->
                    <div class="bg-te-orange border border-black p-4 relative shadow-hard text-white">
                        <p class="font-mono text-[10px] uppercase mb-2 text-black">Current_Plan</p>
                        <div class="font-mono text-4xl font-bold tracking-tighter uppercase">PRO_AUDIO</div>
                        <p class="font-mono text-[10px] mt-4 text-black border-t border-black pt-2">EXP: 2027-12-31</p>
                    </div>
                </div>

                <!-- Data Log -->
                <div class="bg-white border border-black">
                    <div class="bg-black text-white px-4 py-2 font-mono text-xs flex justify-between">
                        <span>LATEST_OPERATIONS_LOG</span>
                        <span>[READ_ONLY]</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left font-mono text-xs uppercase">
                            <thead class="bg-gray-100 border-b border-black">
                                <tr>
                                    <th class="px-4 py-3 border-r border-black">ID_TAG</th>
                                    <th class="px-4 py-3 border-r border-black">RECIPIENT</th>
                                    <th class="px-4 py-3 border-r border-black">MODULE</th>
                                    <th class="px-4 py-3">TIMESTAMP</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-300">
                                ${total === 0 ? `
                                    <tr>
                                        <td colspan="4" class="px-4 py-8 text-center text-gray-400">
                                            // NO_DATA_FOUND <br>
                                            <button onclick="navigate('create')" class="text-te-orange hover:underline mt-2">INITIATE_SEQUENCE ></button>
                                        </td>
                                    </tr>
                                ` : certs.slice(0, 5).reverse().map(cert => `
                                    <tr class="hover:bg-te-orange hover:text-white transition-colors cursor-default">
                                        <td class="px-4 py-3 border-r border-gray-300 border-dashed">${cert.id}</td>
                                        <td class="px-4 py-3 border-r border-gray-300 border-dashed font-bold">${cert.recipientName}</td>
                                        <td class="px-4 py-3 border-r border-gray-300 border-dashed">${cert.courseName}</td>
                                        <td class="px-4 py-3">${cert.issueDate}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // 5. CERTIFICATE WIZARD (TE STYLE)
        function renderCreateWizard() {
            const content = document.getElementById('page-content');
            content.innerHTML = `
                <div class="flex flex-col xl:flex-row gap-12 h-full">
                    <!-- Config Panel -->
                    <div class="w-full xl:w-1/3 space-y-8">
                        <div>
                            <h1 class="text-4xl font-black uppercase tracking-tighter mb-2">Editor</h1>
                            <div class="h-1 w-20 bg-te-orange"></div>
                        </div>

                        <!-- Panel -->
                        <div class="bg-[#f2f2f2] p-6 border border-black shadow-hard relative">
                            <div class="absolute -left-1 -top-1 w-2 h-2 bg-black"></div>
                            <div class="absolute -right-1 -bottom-1 w-2 h-2 bg-black"></div>
                            
                            <div class="space-y-4">
                                <div>
                                    <label class="block font-mono text-[10px] uppercase mb-1">Base_Design <span class="opacity-60">[AVAILABLE_TEMPLATE_COUNT: 10]</span></label>
                                    <select id="design-select" onchange="changeDesign(this.value)" class="input-te w-full p-3 text-sm font-mono uppercase cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat">
                                        <option value="./CR templetes/temp1.png" ${EditorState.baseImage === './CR templetes/temp1.png' ? 'selected' : ''}>Temp 1</option>
                                        <option value="./CR templetes/temp2.png" ${EditorState.baseImage === './CR templetes/temp2.png' ? 'selected' : ''}>Temp 2</option>
                                        <option value="./CR templetes/temp3.png" ${EditorState.baseImage === './CR templetes/temp3.png' ? 'selected' : ''}>Temp 3</option>
                                        <option value="./CR templetes/temp4.png" ${EditorState.baseImage === './CR templetes/temp4.png' ? 'selected' : ''}>Temp 4</option>
                                        <option value="./CR templetes/temp5.png" ${EditorState.baseImage === './CR templetes/temp5.png' ? 'selected' : ''}>Temp 5</option>
                                        <option value="./CR templetes/temp6.png" ${EditorState.baseImage === './CR templetes/temp6.png' ? 'selected' : ''}>Temp 6</option>
                                        <option value="./CR templetes/temp7.png" ${EditorState.baseImage === './CR templetes/temp7.png' ? 'selected' : ''}>Temp 7</option>
                                        <option value="./CR templetes/temp8.png" ${EditorState.baseImage === './CR templetes/temp8.png' ? 'selected' : ''}>Temp 8</option>
                                        <option value="./CR templetes/temp9.png" ${EditorState.baseImage === './CR templetes/temp9.png' ? 'selected' : ''}>Temp 9</option>
                                        <option value="./CR templetes/temp10.png" ${EditorState.baseImage === './CR templetes/temp10.png' ? 'selected' : ''}>Temp 10</option>
</select>
                                </div>
                                
                                <div>
                                    <label class="block font-mono text-[10px] uppercase mb-1">Upload_Logo (PNG)</label>
                                    <input type="file" accept="image/png, image/jpeg" onchange="handleImageUpload(event, 'logo')" class="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:border file:border-black file:bg-white file:font-mono hover:file:bg-te-orange hover:file:text-white cursor-pointer">
                                </div>
                                
                                <div class="h-[1px] w-full bg-black my-4 opacity-20"></div>

                                <div>
                                    <label class="block font-mono text-[10px] uppercase mb-1">Participant_Name</label>
                                    <input type="text" id="inp-name" value="Amit Kumar" oninput="updateEditorText()" class="input-te w-full p-3 text-sm">
                                </div>
                                <div>
                                    <label class="block font-mono text-[10px] uppercase mb-1">Email</label>
                                    <input type="email" id="inp-email" value="amit@example.com" class="input-te w-full p-3 text-sm" placeholder="participant@email.com">
                                </div>
                                <div>
                                    <label class="block font-mono text-[10px] uppercase mb-1">Description / Course</label>
                                    <textarea id="inp-desc" rows="2" oninput="updateEditorText()" class="input-te w-full p-3 text-sm resize-none">For successful completion of Advanced System Engineering.</textarea>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block font-mono text-[10px] uppercase mb-1">Signature_1</label>
                                        <input type="text" id="inp-sig1" value="Director" oninput="updateEditorText()" class="input-te w-full p-3 text-sm">
                                    </div>
                                    <div>
                                        <label class="block font-mono text-[10px] uppercase mb-1">Signature_2</label>
                                        <input type="text" id="inp-sig2" value="Instructor" oninput="updateEditorText()" class="input-te w-full p-3 text-sm">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onclick="generateCertificate()" class="btn-te w-full py-4 text-sm flex items-center justify-center gap-2 bg-black text-white hover:bg-te-orange border-none">
                            <i class="fa-solid fa-print"></i>
                            <span>EXECUTE_PRINT_JOB</span>
                        </button>

                        <div class="bg-white border border-black p-4 rounded-2xl">
                            <label class="block font-mono text-[10px] uppercase mb-2">Bulk_CSV (name, Description)</label>
                            <input id="bulk-csv" type="file" accept=".csv,text/csv" class="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:border file:border-black file:bg-white file:font-mono hover:file:bg-te-orange hover:file:text-white cursor-pointer">
                            <button onclick="generateBulkCertificates()" class="btn-te w-full py-3 mt-3 text-xs flex items-center justify-center gap-2">
                                <i class="fa-solid fa-file-zipper"></i>
                                <span>GENERATE_BULK_ZIP</span>
                            </button>
                            <p id="bulk-status" class="font-mono text-[10px] mt-2 opacity-70">WAITING_FOR_CSV</p>
                        </div>
                    </div>

                    <!-- WYSIWYG Live Preview -->
                    <div class="w-full xl:w-2/3 flex flex-col">
                        <div class="flex justify-between items-end mb-2 font-mono text-[10px] uppercase">
                            
                        </div>
                        
                        <div class="bg-[#333] p-4 md:p-8 border-2 border-black shadow-hard flex items-center justify-center relative w-full">
                            <!-- Bezel screws -->
                            <div class="absolute top-3 left-3 w-2 h-2 bg-[#111] rounded-full border border-gray-600"></div>
                            <div class="absolute top-3 right-3 w-2 h-2 bg-[#111] rounded-full border border-gray-600"></div>
                            <div class="absolute bottom-3 left-3 w-2 h-2 bg-[#111] rounded-full border border-gray-600"></div>
                            <div class="absolute bottom-3 right-3 w-2 h-2 bg-[#111] rounded-full border border-gray-600"></div>
                            
                            <!-- Editor Workspace -->
                            <div id="workspace-container" class="bg-[#f0f0f0] aspect-[4/3] border-2 border-black shadow-2xl relative overflow-hidden w-full max-w-4xl cursor-default">
                                
                                <!-- Background Layer -->
                                <div id="workspace-bg" class="absolute inset-0 bg-contain bg-center bg-no-repeat" style="background-image: url('${EditorState.baseImage}'); background-color: #ffffff;">
                                </div>
                                
                                <!-- Draggable Layers -->
                                <div id="drag-logo" class="draggable absolute p-2 border border-transparent hover:border-te-orange hover:border-dashed cursor-move select-none ${EditorState.logoImage ? '' : 'hidden'}" style="left: ${EditorState.elements.logo.x}%; top: ${EditorState.elements.logo.y}%; transform: translate(-50%, -50%);" onmousedown="initDrag(event, 'logo')">
                                    <img id="display-logo" src="${EditorState.logoImage || ''}" class="h-16 w-auto pointer-events-none">
                                </div>

                                <div id="drag-name" class="draggable absolute p-2 border border-transparent hover:border-te-orange hover:border-dashed cursor-move whitespace-nowrap select-none" style="left: ${EditorState.elements.name.x}%; top: ${EditorState.elements.name.y}%; transform: translate(-50%, -50%);" onmousedown="initDrag(event, 'name')">
                                    <span id="display-name" class="text-5xl md:text-7xl font-pinyon text-black pointer-events-none drop-shadow-sm leading-none">Amit Kumar</span>
                                </div>

                                <div id="drag-desc" class="draggable absolute p-2 border border-transparent hover:border-te-orange hover:border-dashed cursor-move whitespace-nowrap text-center select-none" style="left: ${EditorState.elements.desc.x}%; top: ${EditorState.elements.desc.y}%; transform: translate(-50%, -50%);" onmousedown="initDrag(event, 'desc')">
                                    <span id="display-desc" class="text-lg md:text-2xl font-playfair italic font-medium text-gray-800 pointer-events-none drop-shadow-sm">For successful completion of Advanced System Engineering.</span>
                                </div>

                                <div id="drag-sig1" class="draggable absolute p-2 border border-transparent hover:border-te-orange hover:border-dashed cursor-move whitespace-nowrap select-none" style="left: ${EditorState.elements.sig1.x}%; top: ${EditorState.elements.sig1.y}%; transform: translate(-50%, -50%);" onmousedown="initDrag(event, 'sig1')">
                                    <span id="display-sig1" class="text-3xl md:text-4xl font-signature text-black border-t-2 border-black pt-2 pointer-events-none block text-center min-w-[120px] md:min-w-[150px]">Director</span>
                                </div>

                                <div id="drag-sig2" class="draggable absolute p-2 border border-transparent hover:border-te-orange hover:border-dashed cursor-move whitespace-nowrap select-none" style="left: ${EditorState.elements.sig2.x}%; top: ${EditorState.elements.sig2.y}%; transform: translate(-50%, -50%);" onmousedown="initDrag(event, 'sig2')">
                                    <span id="display-sig2" class="text-3xl md:text-4xl font-signature text-black border-t-2 border-black pt-2 pointer-events-none block text-center min-w-[120px] md:min-w-[150px]">Instructor</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            setTimeout(() => { updateEditorText(); }, 100);
        }

        // --- DRAG & DROP EDITOR LOGIC ---
        function changeDesign(url) {
            EditorState.baseImage = url;
            const bgEl = document.getElementById('workspace-bg');
            if (bgEl) {
                bgEl.style.backgroundImage = `url('${url}')`;
            }
        }

        function updateEditorText() {
            document.getElementById('display-name').innerText = document.getElementById('inp-name').value || 'PARTICIPANT NAME';
            document.getElementById('display-desc').innerText = document.getElementById('inp-desc').value || 'Description text...';
            document.getElementById('display-sig1').innerText = document.getElementById('inp-sig1').value || 'Signature 1';
            document.getElementById('display-sig2').innerText = document.getElementById('inp-sig2').value || 'Signature 2';
        }

        function handleImageUpload(event, type) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                if (type === 'logo') {
                    EditorState.logoImage = e.target.result;
                    const logoEl = document.getElementById('display-logo');
                    logoEl.src = e.target.result;
                    document.getElementById('drag-logo').classList.remove('hidden');
                }
            };
            reader.readAsDataURL(file);
        }

        let activeDrag = null;
        function initDrag(e, id) {
            e.preventDefault();
            activeDrag = {
                id: id,
                startX: e.clientX,
                startY: e.clientY,
                startLeft: EditorState.elements[id].x,
                startTop: EditorState.elements[id].y
            };
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        }

        function onDrag(e) {
            if (!activeDrag) return;
            const workspace = document.getElementById('workspace-container');
            const rect = workspace.getBoundingClientRect();
            
            const dx = ((e.clientX - activeDrag.startX) / rect.width) * 100;
            const dy = ((e.clientY - activeDrag.startY) / rect.height) * 100;
            
            let newX = activeDrag.startLeft + dx;
            let newY = activeDrag.startTop + dy;
            
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));
            
            EditorState.elements[activeDrag.id].x = newX;
            EditorState.elements[activeDrag.id].y = newY;
            
            const el = document.getElementById('drag-' + activeDrag.id);
            el.style.left = newX + '%';
            el.style.top = newY + '%';
        }

        function stopDrag() {
            activeDrag = null;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        async function renderCertificateCanvas(name, desc, sig1Text, sig2Text) {
            const canvas = document.createElement('canvas');
            canvas.width = 1600;
            canvas.height = 1200;
            const ctx = canvas.getContext('2d');

            if (EditorState.baseImage) {
                const img = new Image();
                img.src = EditorState.baseImage;
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
                try {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                } catch (e) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            } else {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 10;
                ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
            }

            if (EditorState.logoImage) {
                const logo = new Image();
                logo.src = EditorState.logoImage;
                await new Promise((resolve) => {
                    logo.onload = resolve;
                    logo.onerror = resolve;
                });
                const l = EditorState.elements.logo;
                const h = 150;
                const w = logo.height ? (logo.width / logo.height) * h : h;
                ctx.drawImage(logo, (l.x / 100) * canvas.width - w / 2, (l.y / 100) * canvas.height - h / 2, w, h);
            }

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000000';

            const drawText = (idStr, text, font) => {
                const pos = EditorState.elements[idStr];
                ctx.font = font;
                ctx.fillText(text, (pos.x / 100) * canvas.width, (pos.y / 100) * canvas.height);
            };

            const drawSig = (idStr, text, font) => {
                const pos = EditorState.elements[idStr];
                const x = (pos.x / 100) * canvas.width;
                const y = (pos.y / 100) * canvas.height;

                ctx.beginPath();
                ctx.moveTo(x - 120, y - 25);
                ctx.lineTo(x + 120, y - 25);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#000000';
                ctx.stroke();

                ctx.font = font;
                ctx.fillText(text, x, y + 15);
            };

            drawText('name', name, "normal 110px 'Pinyon Script'");
            drawText('desc', desc, "italic 40px 'Playfair Display'");
            drawSig('sig1', sig1Text, "normal 55px 'Great Vibes'");
            drawSig('sig2', sig2Text, "normal 55px 'Great Vibes'");

            return canvas;
        }

        function sanitizeFileName(value) {
            return (value || 'participant')
                .toString()
                .trim()
                .replace(/[\\/:*?"<>|]/g, '')
                .replace(/\s+/g, '_') || 'participant';
        }

        function parseBulkCsv(file) {
            return new Promise((resolve, reject) => {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.errors && results.errors.length) {
                            reject(new Error(results.errors[0].message));
                            return;
                        }
                        resolve(results.data || []);
                    },
                    error: (err) => reject(err)
                });
            });
        }

        async function generateCertificate() {
            const name = document.getElementById('inp-name').value;
            const desc = document.getElementById('inp-desc').value;
            const email = (document.getElementById('inp-email') || {}).value || '';
            const sig1 = document.getElementById('inp-sig1').value;
            const sig2 = document.getElementById('inp-sig2').value;
            const id = 'FIU-' + Math.floor(100000 + Math.random() * 900000);

            const newCert = {
                id: id,
                recipientName: name,
                courseName: 'Custom Certification',
                issueDate: new Date().toISOString().split('T')[0],
                templateId: 'CUSTOM',
                createdAt: new Date().toISOString(),
                email: email
            };

            const certs = DB.get('certificates');
            certs.push(newCert);
            DB.set('certificates', certs);
            State.certificates = certs;

            const canvas = await renderCertificateCanvas(name, desc, sig1, sig2);
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1600, 1200] });
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            doc.addImage(imgData, 'JPEG', 0, 0, 1600, 1200);
            doc.setFont('courier');
            doc.setFontSize(24);
            doc.text(`ID_REF: ${id}`, 50, 1150);
            doc.save(`CERT_${id}.pdf`);

            alert(`PROCESS COMPLETE.\nFILE: CERT_${id}.pdf`);
            navigate('dashboard');
        }

        async function generateBulkCertificates() {
            const statusEl = document.getElementById('bulk-status');
            const fileInput = document.getElementById('bulk-csv');

            if (!fileInput || !fileInput.files || !fileInput.files[0]) {
                if (statusEl) statusEl.innerText = 'PLEASE_UPLOAD_CSV';
                return;
            }

            try {
                const defaultEmail = (document.getElementById('inp-email') || {}).value || '';
                const rows = await parseBulkCsv(fileInput.files[0]);
                const validRows = rows
                    .map((row) => ({
                        name: (row.name || row.Name || '').toString().trim(),
                        desc: (row.Description || '').toString().trim(),
                        email: (row.Email || defaultEmail || '').toString().trim()
                    }))
                    .filter((row) => row.name && row.desc);

                if (!validRows.length) {
                    if (statusEl) statusEl.innerText = 'NO_VALID_ROWS_FOUND';
                    return;
                }

                const sig1 = (document.getElementById('inp-sig1') || {}).value || 'Director';
                const sig2 = (document.getElementById('inp-sig2') || {}).value || 'Instructor';
                const zip = new JSZip();
                const certs = DB.get('certificates');

                for (let i = 0; i < validRows.length; i++) {
                    const row = validRows[i];
                    if (statusEl) statusEl.innerText = `Processing ${i + 1} / ${validRows.length}...`;

                    const canvas = await renderCertificateCanvas(row.name, row.desc, sig1, sig2);
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1600, 1200] });
                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    doc.addImage(imgData, 'JPEG', 0, 0, 1600, 1200);

                    const pdfBlob = doc.output('blob');
                    const baseName = sanitizeFileName(row.name);
                    usedNames[baseName] = (usedNames[baseName] || 0) + 1;
                    const fileName = usedNames[baseName] === 1
                        ? `${baseName}.pdf`
                        : `${baseName}_${usedNames[baseName]}.pdf`;
                    zip.file(fileName, pdfBlob);

                    certs.push({
                        id: 'FIU-' + Math.floor(100000 + Math.random() * 900000),
                        recipientName: row.name,
                        courseName: 'Custom Certification',
                        issueDate: new Date().toISOString().split('T')[0],
                        templateId: 'CUSTOM',
                        createdAt: new Date().toISOString(),
                        email: row.email
                    });

                    await new Promise((resolve) => setTimeout(resolve, 100));
                }

                DB.set('certificates', certs);
                State.certificates = certs;

                if (statusEl) statusEl.innerText = 'PACKING_ZIP...';
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                saveAs(zipBlob, 'certificates.zip');
                if (statusEl) statusEl.innerText = `DONE_${validRows.length}_CERTIFICATES`;
            } catch (error) {
                if (statusEl) statusEl.innerText = `ERROR: ${(error && error.message) ? error.message : 'BULK_JOB_FAILED'}`;
            }
        }

        // 6. CERTIFICATE HISTORY (TE STYLE)
        function renderCertificateList() {
             const content = document.getElementById('page-content');
             const certs = State.certificates;
             
             content.innerHTML = `
                <div class="mb-8">
                    <h1 class="text-4xl font-black uppercase tracking-tighter mb-2">History</h1>
                    <div class="h-1 w-full bg-black"></div>
                </div>
                
                <div class="bg-white border border-black p-1 shadow-hard">
                    <table class="w-full text-left font-mono text-xs uppercase">
                        <thead class="bg-black text-white">
                            <tr>
                                <th class="px-4 py-3">ID_REF</th>
                                <th class="px-4 py-3">TARGET</th>
                                <th class="px-4 py-3">PROJECT</th>
                                <th class="px-4 py-3">DATE</th>
                                <th class="px-4 py-3">OP</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                             ${certs.length === 0 ? `<tr><td colspan="5" class="p-8 text-center text-gray-400">// EMPTY_BUFFER</td></tr>` : 
                             certs.map(c => `
                                <tr class="hover:bg-gray-100">
                                    <td class="px-4 py-3 font-bold text-te-orange select-all">${c.id}</td>
                                    <td class="px-4 py-3 font-bold">${c.recipientName}</td>
                                    <td class="px-4 py-3">${c.courseName}</td>
                                    <td class="px-4 py-3">${c.issueDate}</td>
                                    <td class="px-4 py-3">
                                        <button onclick="navigate('verify')" class="hover:bg-black hover:text-white px-2 border border-black">VIEW</button>
                                    </td>
                                </tr>
                             `).join('')}
                        </tbody>
                    </table>
                </div>
             `;
        }

        // 7. EMAIL SENDER (TE STYLE)
        function renderEmailSender() {
            const content = document.getElementById('page-content');
            const certs = State.certificates || [];
            const recipients = certs
                .map(c => (c.email || '').trim())
                .filter(email => email.length > 0);
            const uniqueRecipients = [...new Set(recipients)];

            content.innerHTML = `
                <div class="mb-8 border-b border-black pb-4">
                    <h1 class="text-4xl font-black tracking-tighter mb-2">Email</h1>
                    <p class="font-mono text-xs text-gray-600">BULK_MAIL_SENDER // Uses emails saved from Editor and CSV rows.</p>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div class="xl:col-span-2 bg-white border border-black p-6 shadow-hard">
                        <label class="block font-mono text-[10px] uppercase mb-1">Subject</label>
                        <input id="mail-subject" type="text" class="input-te w-full p-3 text-sm mb-4" value="Your Certificate from Flurr">

                        <label class="block font-mono text-[10px] uppercase mb-1">Message</label>
                        <textarea id="mail-body" rows="8" class="input-te w-full p-3 text-sm resize-none">Hello,\n\nPlease find your generated certificate attached.\n\nRegards,\nFlurr Team</textarea>

                        <button onclick="openBulkMailDraft()" class="btn-te w-full py-3 mt-4 text-sm flex items-center justify-center gap-2 bg-black text-white hover:bg-te-orange border-none">
                            <i class="fa-solid fa-paper-plane"></i>
                            <span>OPEN_BULK_MAIL_DRAFT</span>
                        </button>
                    </div>

                    <div class="bg-white border border-black p-6 shadow-hard">
                        <p class="font-mono text-[10px] uppercase mb-2">Recipients</p>
                        <div class="text-4xl font-black tracking-tight mb-4">${uniqueRecipients.length}</div>
                        <p class="font-mono text-[10px] uppercase mb-2">Preview</p>
                        <div class="max-h-72 overflow-y-auto border border-black p-2 font-mono text-[10px] bg-gray-50">
                            ${uniqueRecipients.length ? uniqueRecipients.map(e => `<div class="py-1 border-b border-dashed border-gray-300">${e}</div>`).join('') : '<div class="text-gray-400">NO_EMAILS_FOUND</div>'}
                        </div>
                    </div>
                </div>
            `;
        }

        function openBulkMailDraft() {
            const certs = State.certificates || [];
            const recipients = [...new Set(certs.map(c => (c.email || '').trim()).filter(Boolean))];
            if (!recipients.length) {
                alert('NO_EMAILS_FOUND. Add email in Editor or include Email column in CSV.');
                return;
            }

            const subject = (document.getElementById('mail-subject') || {}).value || 'Your Certificate from Flurr';
            const body = (document.getElementById('mail-body') || {}).value || '';

            const chunkSize = 40;
            for (let i = 0; i < recipients.length; i += chunkSize) {
                const group = recipients.slice(i, i + chunkSize);
                const url = `mailto:?bcc=${encodeURIComponent(group.join(','))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(url, '_blank');
            }
        }
        // 8. PUBLIC VERIFICATION (TE STYLE)
        function renderVerify(container) {
            container.innerHTML = `
                <div class="w-full h-full flex flex-col">
                    <!-- Nav -->
                    <nav class="h-16 border-b border-black bg-white flex justify-between items-center px-6">
                        <div onclick="navigate('home')" class="cursor-pointer font-black text-xl tracking-tighter hover:text-te-orange">
                             FIUER.SYS // VERIFY
                        </div>
                        <button onclick="navigate('home')" class="font-mono text-xs hover:underline">[ ESCAPE ]</button>
                    </nav>

                    <div class="flex-1 flex flex-col items-center justify-center p-6 bg-grid">
                        <div class="w-full max-w-lg">
                            <h1 class="text-4xl font-black text-center uppercase tracking-tighter mb-8">Credential<br>Check</h1>
                            
                            <div class="bg-white p-6 border-2 border-black shadow-hard mb-8">
                                <label class="font-mono text-xs uppercase block mb-2">Input_Sequence (Certificate ID)</label>
                                <div class="flex gap-2">
                                    <input type="text" id="verify-input" placeholder="FIU-XXXXXX" class="input-te flex-1 p-4 text-lg uppercase font-bold">
                                    <button onclick="checkCertificate()" class="btn-te px-6 bg-black text-white hover:bg-te-orange border-none">SCAN</button>
                                </div>
                            </div>

                            <!-- Result Container -->
                            <div id="verify-result" class="hidden">
                                <!-- Injected via JS -->
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function checkCertificate() {
            const input = document.getElementById('verify-input').value.trim();
            const resultDiv = document.getElementById('verify-result');
            const certs = DB.get('certificates');
            const found = certs.find(c => c.id === input);
            
            resultDiv.classList.remove('hidden');
            
            if (found) {
                resultDiv.innerHTML = `
                    <div class="bg-[#f0fdf4] border-2 border-green-600 p-6 shadow-hard relative overflow-hidden">
                        <div class="absolute -right-4 -top-4 w-16 h-16 bg-green-600 rotate-45"></div>
                        
                        <div class="flex items-center gap-4 mb-4 border-b border-green-600 pb-4">
                            <div class="w-8 h-8 bg-green-600 text-white flex items-center justify-center font-bold">✓</div>
                            <div>
                                <h3 class="font-bold text-green-900 uppercase">Valid_Signature</h3>
                                <p class="font-mono text-[10px] text-green-700">AUTH_KEY_MATCHED</p>
                            </div>
                        </div>
                        <div class="font-mono text-xs space-y-2 uppercase">
                            <div class="flex justify-between"><span>Subject:</span> <span class="font-bold">${found.recipientName}</span></div>
                            <div class="flex justify-between"><span>Module:</span> <span class="font-bold">${found.courseName}</span></div>
                            <div class="flex justify-between"><span>Date:</span> <span>${found.issueDate}</span></div>
                            <div class="mt-4 pt-2 border-t border-green-600/30 text-center text-[10px] opacity-50">
                                FIUER.VERIFICATION.SYSTEM
                            </div>
                        </div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="bg-[#fef2f2] border-2 border-red-600 p-6 shadow-hard text-center">
                        <div class="w-12 h-12 bg-red-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-2xl">!</div>
                        <h3 class="font-bold text-red-900 uppercase mb-1">Error_404</h3>
                        <p class="font-mono text-xs text-red-700">ID_SEQUENCE_NOT_FOUND</p>
                    </div>
                `;
            }
        }

        init();

    















