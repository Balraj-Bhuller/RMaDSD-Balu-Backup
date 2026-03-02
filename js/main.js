(function(){
    'use strict';
    function animateCounters(){
        document.querySelectorAll('.counter').forEach(function(el){
            var target = parseFloat(el.getAttribute('data-target'));
            var suffix = el.getAttribute('data-suffix') || '';
            var isDecimal = target % 1 !== 0;
            var duration = 2000;
            var start = performance.now();
            function tick(now){
                var p = Math.min((now - start) / duration, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                var val = target * eased;
                el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
                if(p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }
    function startTimer(){
        var el = document.getElementById('session-time');
        if(!el) return;
        var s = 0;
        setInterval(function(){
            s++;
            var h = String(Math.floor(s/3600)).padStart(2,'0');
            var m = String(Math.floor((s%3600)/60)).padStart(2,'0');
            var sec = String(s%60).padStart(2,'0');
            el.textContent = h+':'+m+':'+sec;
        }, 1000);
    }
    var msgs = [
        {text:'Perimeter scan complete. No anomalies detected.', pri:'low'},
        {text:'Firewall matrix integrity at 89 percent. Monitoring...', pri:'medium'},
        {text:'New node connected: SECTOR-7G', pri:'low'},
        {text:'Quantum relay offline. Rerouting traffic...', pri:'high'},
        {text:'Encryption handshake successful with NODE-4412.', pri:'low'},
        {text:'Satellite uplink signal degraded. Compensating...', pri:'medium'},
        {text:'Data packet integrity verified. CRC: PASS', pri:'low'},
        {text:'Intrusion attempt blocked from unknown source.', pri:'high'},
        {text:'Neural network recalibration complete.', pri:'low'},
        {text:'Memory bank optimization: 12 percent improvement.', pri:'low'},
        {text:'Comm array interference detected on CH-7.', pri:'medium'},
        {text:'System backup initiated. ETA: 4 minutes.', pri:'low'},
        {text:'Hostile signature detected in GRID-9. Alert raised.', pri:'high'},
        {text:'Power grid stable. Output: 97.3 percent', pri:'low'},
        {text:'Firmware update available for DRONE-SWARM v2.1', pri:'low'},
        {text:'Decryption module overloaded. Cooling initiated.', pri:'medium'}
    ];
    var feedIdx = 0;
    var feedList = document.getElementById('feed-list');
    function ts(){
        return new Date().toTimeString().split(' ')[0];
    }
    function addFeed(){
        if(!feedList) return;
        var m = msgs[feedIdx % msgs.length];
        feedIdx++;
        var sources = ['SYS-CORE','NET-OPS','SEC-GRID','CMD-HUB','DATA-MNT'];
        var src = sources[Math.floor(Math.random()*5)];
        var div = document.createElement('div');
        div.className = 'feed-item priority-'+m.pri;
        div.innerHTML = '<div class="feed-time">'+ts()+'</div><div class="feed-source">'+src+'</div><div class="feed-message">'+m.text+'</div>';
        feedList.prepend(div);
        while(feedList.children.length > 25) feedList.removeChild(feedList.lastChild);
    }
    function initFeed(){
        for(var i=0;i<5;i++) addFeed();
        setInterval(addFeed, 3500);
    }
    function fluctuate(){
        var els = document.querySelectorAll('.bottom-bar .counter');
        setInterval(function(){
            els.forEach(function(el){
                var base = parseFloat(el.getAttribute('data-target'));
                var suffix = el.getAttribute('data-suffix') || '';
                var isDecimal = base % 1 !== 0;
                var v = base + (Math.random()-0.5) * base * 0.04;
                el.textContent = (isDecimal ? v.toFixed(1) : Math.floor(v).toLocaleString()) + suffix;
            });
        }, 3000);
    }
    document.addEventListener('DOMContentLoaded', function(){
        animateCounters();
        startTimer();
        initFeed();
        setTimeout(fluctuate, 2500);
    });
})();
