(function() {
    const displayPanel = document.createElement('div');
    displayPanel.style.cssText = "position:fixed; bottom:20px; right:20px; padding:15px; background:rgba(0,0,0,0.9); color:#00ff00; font-family:monospace; z-index:999999; border-radius:8px; border:2px solid #555; pointer-events:none; font-size:16px;";
    displayPanel.innerText = "[系統已初始化] 監控中...";
    document.body.appendChild(displayPanel);

    let isGenerating = false;

    function playBeep(count) {
        let played = 0;
        const interval = setInterval(() => {
            if (played >= count) {
                clearInterval(interval);
                return;
            }
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain(); // 重新加入以控制音量
                
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(1.0, audioCtx.currentTime); // 設為 1.0 (最大音量)
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.2);
            } catch (e) { console.log("音效無法播放"); }
            played++;
        }, 400);
    }

    function checkIfGenerating() {
        const buttons = document.querySelectorAll('button');
        let foundStopButton = false;
        buttons.forEach(btn => {
            const text = (btn.innerText || btn.getAttribute('aria-label') || "").toLowerCase();
            if (text.includes("停止") || text.includes("stop")) {
                foundStopButton = true;
            }
        });
        return foundStopButton;
    }

    setInterval(() => {
        const isCurrentlyActive = checkIfGenerating();
        if (isCurrentlyActive) {
            isGenerating = true;
            displayPanel.style.color = "#00ff00";
            displayPanel.innerText = "[狀態] 生成中...";
        } else if (isGenerating) {
            isGenerating = false;
            displayPanel.style.color = "#ff4444";
            displayPanel.innerText = "[狀態] 生成完成";
            playBeep(3);
        } else {
            displayPanel.style.color = "#ffffff";
            displayPanel.innerText = "[狀態] 待機中";
        }
    }, 500);
})();