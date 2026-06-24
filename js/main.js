const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        const morseMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'Ñ': '--.--', 'O': '---', 'P': '.--.', 'Q': '--.-', 
            'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 
            'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', 
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
            '8': '---..', '9': '----.', '0': '-----', ' ': '/'
        };

        const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        const consonants = Object.keys(morseMap).filter(l => !vowels.includes(l) && isNaN(l) && l !== ' ' && l !== '/');
        
        let selectedCategory = '';
        let currentMode = ''; 
        let currentList = [], currentIndex = 0, userInput = "";
        let errorCount = 0;
        let errorItems = new Set();

        function handleSound(duration, startTime = audioCtx.currentTime) {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(700, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
            gain.gain.setValueAtTime(0.4, startTime + duration - 0.01);
            gain.gain.linearRampToValueAtTime(0, startTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        }

        function playSequence(morseStr) {
            let time = audioCtx.currentTime + 0.1;
            morseStr.split('').forEach(char => {
                if (char === '.') { handleSound(0.1, time); time += 0.2; }
                else if (char === '-') { handleSound(0.3, time); time += 0.4; }
            });
        }

        function playCurrentSequence() {
            playSequence(morseMap[currentList[currentIndex]]);
        }

        function hideAllScreens() {
            document.querySelectorAll('body > div').forEach(div => div.classList.add('hidden'));
        }

        function showMenu() {
            hideAllScreens();
            document.getElementById('menu').classList.remove('hidden');
        }

        function openModeSelector(category) {
            selectedCategory = category;
            hideAllScreens();
            document.getElementById('mode-selector').classList.remove('hidden');
        }

        function startGame(mode) {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            currentMode = mode;
            currentIndex = 0;
            userInput = "";
            errorCount = 0;
            errorItems.clear();

            hideAllScreens();
            document.getElementById('game').classList.remove('hidden');
            
            const titles = { 'vowels': 'Vocales', 'consonants': 'Consonantes', 'alphabet': 'Abecedario', 'numbers': 'Números' };
            document.getElementById('task-title').innerText = titles[selectedCategory];
            
            const classicControls = document.getElementById('classic-controls');
            const textControls = document.getElementById('text-controls');
            const btnReplay = document.getElementById('btn-replay');
            const subtitle = document.getElementById('mode-subtitle');

            if (mode === 'classic') {
                classicControls.classList.remove('hidden');
                textControls.classList.add('hidden');
                btnReplay.classList.add('hidden');
                subtitle.innerText = "Escribe el código de la letra";
            } else if (mode === 'visual') {
                classicControls.classList.add('hidden');
                textControls.classList.remove('hidden');
                btnReplay.classList.add('hidden');
                subtitle.innerText = "Identifica qué letra es";
            } else if (mode === 'audio') {
                classicControls.classList.add('hidden');
                textControls.classList.remove('hidden');
                btnReplay.classList.remove('hidden');
                subtitle.innerText = "Escucha y escribe la letra";
            }

            if (selectedCategory === 'vowels') currentList = [...vowels];
            else if (selectedCategory === 'consonants') currentList = [...consonants];
            else if (selectedCategory === 'numbers') currentList = Object.keys(morseMap).filter(k => !isNaN(k) && k !== ' ' && k !== '/');
            else currentList = Object.keys(morseMap).filter(k => isNaN(k) && k !== ' ' && k !== '/');
            
            currentList.sort(() => Math.random() - 0.5);
            nextLetter();
        }

        function nextLetter() {
            if (currentIndex < currentList.length) {
                const currentLetter = currentList[currentIndex];
                const targetDisplay = document.getElementById('target-letter');
                

                userInput = "";
                document.getElementById('input-preview').innerText = "";
                document.getElementById('text-answer').value = "";
                document.getElementById('feedback').innerText = "";


                if (currentMode === 'classic') {
                    targetDisplay.innerText = currentLetter;
                } else if (currentMode === 'visual') {
                    targetDisplay.innerText = morseMap[currentLetter];
                } else if (currentMode === 'audio') {
                    targetDisplay.innerText = "🔊";
                    setTimeout(playCurrentSequence, 300); 
                }


                if (currentMode !== 'classic') {
                    document.getElementById('text-answer').focus();
                }

            } else {
                showResults();
            }
        }

        function addInput(char) {
            userInput += char;
            document.getElementById('input-preview').innerText = userInput;
        }

        function checkAnswer() {
            const currentLetter = currentList[currentIndex];
            let isCorrect = false;

            if (currentMode === 'classic') {
                isCorrect = (userInput === morseMap[currentLetter]);
            } else {
                const textInput = document.getElementById('text-answer').value.toUpperCase().trim();
                isCorrect = (textInput === currentLetter);
            }

            if (isCorrect) {
                document.getElementById('feedback').innerText = "✅ CORRECTO";
                setTimeout(() => { currentIndex++; nextLetter(); }, 600);
            } else {
                document.getElementById('feedback').innerText = "❌ ERROR";
                errorCount++;
                errorItems.add(currentLetter);
                userInput = ""; 
                document.getElementById('input-preview').innerText = "";
                document.getElementById('text-answer').value = "";
            }
        }

        function showResults() {
            hideAllScreens();
            document.getElementById('results').classList.remove('hidden');
            const content = document.getElementById('results-content');
            
            if (errorCount === 0) {
                content.innerHTML = `
                    <h3 style="color: var(--success); text-align: center;">¡Perfección Absoluta! 🏆</h3>
                    <p style="text-align: center; color: #aaa;">Dominaste este modo sin ningún fallo.</p>
                `;
            } else {
                const mistakesArray = Array.from(errorItems).join(', ');
                content.innerHTML = `
                    <p style="font-size: 1.2rem; margin-bottom: 10px;"><strong>Total de errores:</strong> <span style="color: var(--error); font-size: 1.5rem;">${errorCount}</span></p>
                    <p style="font-size: 1.1rem;"><strong>Repasar caracteres:</strong> <span style="color: var(--primary); font-weight: bold;">${mistakesArray}</span></p>
                `;
            }
        }

        function openGuide() {
            hideAllScreens(); document.getElementById('guide').classList.remove('hidden'); switchGuide('letters');
        }
        function switchGuide(type) {
            const list = document.getElementById('guide-list');
            const btnL = document.getElementById('btnTabLetras');
            const btnN = document.getElementById('btnTabNumeros');
            list.innerHTML = "";
            if(type === 'letters') {
                btnL.classList.add('tab-active'); btnN.classList.remove('tab-active');
                Object.entries(morseMap).forEach(([k, v]) => { if (isNaN(k) && k !== ' ' && k !== '/') list.innerHTML += `<div class="guide-item"><strong>${k}</strong><span>${v}</span></div>`; });
            } else {
                btnN.classList.add('tab-active'); btnL.classList.remove('tab-active');
                Object.entries(morseMap).forEach(([k, v]) => { if (!isNaN(k) && k !== ' ' && k !== '/') list.innerHTML += `<div class="guide-item"><strong>${k}</strong><span>${v}</span></div>`; });
            }
        }
        function showTranslator() {
            hideAllScreens(); document.getElementById('translator').classList.remove('hidden');
        }
        function translateToMorse() {
            document.getElementById('morseInput').value = document.getElementById('textInput').value.toUpperCase().split('').map(char => morseMap[char] || '').join(' ');
        }
        function translateToText() {
            document.getElementById('textInput').value = document.getElementById('morseInput').value.trim().split(' ').map(code => reverseMorseMap[code] || '?').join('');
        }
        function clearTranslator() {
            document.getElementById('textInput').value = ""; document.getElementById('morseInput').value = "";
        }
        function playFullMorse() {
            let time = audioCtx.currentTime + 0.1;
            document.getElementById('morseInput').value.split('').forEach(char => {
                if (char === '.') { handleSound(0.1, time); time += 0.2; }
                else if (char === '-') { handleSound(0.3, time); time += 0.4; }
                else if (char === ' ') { time += 0.3; }
            });
        }