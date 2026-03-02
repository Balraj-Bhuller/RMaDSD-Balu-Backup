(function(){
    'use strict';
    const canvas = document.getElementById('particle-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const CONFIG = {
        particleCount: 100,
        sizeMin: 1, sizeMax: 2.5,
        speedMin: 0.15, speedMax: 0.45,
        connectionDist: 150,
        mouseRadius: 200
    };
    let particles = [];
    let mouse = { x: null, y: null };
    function resize(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    class Particle {
        constructor(){
            this.x = Math.random()*canvas.width;
            this.y = Math.random()*canvas.height;
            this.size = Math.random()*(CONFIG.sizeMax-CONFIG.sizeMin)+CONFIG.sizeMin;
            this.baseSize = this.size;
            const a = Math.random()*Math.PI*2;
            const s = Math.random()*(CONFIG.speedMax-CONFIG.speedMin)+CONFIG.speedMin;
            this.vx = Math.cos(a)*s;
            this.vy = Math.sin(a)*s;
            this.alpha = Math.random()*0.5+0.3;
        }
        update(){
            this.x += this.vx;
            this.y += this.vy;
            if(this.x<0) this.x=canvas.width;
            if(this.x>canvas.width) this.x=0;
            if(this.y<0) this.y=canvas.height;
            if(this.y>canvas.height) this.y=0;
            if(mouse.x!==null){
                const dx=this.x-mouse.x, dy=this.y-mouse.y;
                const d=Math.sqrt(dx*dx+dy*dy);
                this.size = d<CONFIG.mouseRadius ? this.baseSize*(1+(1-d/CONFIG.mouseRadius)*1.5) : this.baseSize;
            } else {
                this.size = this.baseSize;
            }
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
            ctx.fillStyle='rgba(0,229,255,'+this.alpha+')';
            ctx.fill();
        }
    }
    function init(){
        particles=[];
        const count=Math.min(CONFIG.particleCount,Math.floor(canvas.width*canvas.height/15000));
        for(let i=0;i<count;i++) particles.push(new Particle());
    }
    function drawLines(){
        for(let i=0;i<particles.length;i++){
            for(let j=i+1;j<particles.length;j++){
                const dx=particles[i].x-particles[j].x;
                const dy=particles[i].y-particles[j].y;
                const d=Math.sqrt(dx*dx+dy*dy);
                if(d<CONFIG.connectionDist){
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x,particles[i].y);
                    ctx.lineTo(particles[j].x,particles[j].y);
                    ctx.strokeStyle='rgba(0,229,255,'+(1-d/CONFIG.connectionDist)*0.15+')';
                    ctx.lineWidth=0.5;
                    ctx.stroke();
                }
            }
        }
        if(mouse.x!==null){
            for(let i=0;i<particles.length;i++){
                const dx=particles[i].x-mouse.x;
                const dy=particles[i].y-mouse.y;
                const d=Math.sqrt(dx*dx+dy*dy);
                if(d<CONFIG.mouseRadius){
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x,particles[i].y);
                    ctx.lineTo(mouse.x,mouse.y);
                    ctx.strokeStyle='rgba(0,229,255,'+(1-d/CONFIG.mouseRadius)*0.25+')';
                    ctx.lineWidth=0.8;
                    ctx.stroke();
                }
            }
        }
    }
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{ p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }
    window.addEventListener('resize',()=>{ resize(); init(); });
    window.addEventListener('mousemove',e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });
    window.addEventListener('mouseout',()=>{ mouse.x=null; mouse.y=null; });
    resize(); init(); animate();
})();
