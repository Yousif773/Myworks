// 1. إعداد المشهد 3D (Three.js)
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// إضافة جزيئات (Particles) ذهبية
const geometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15; 
}
geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xD4AF37,
    transparent: true,
    opacity: 0.6
});

const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;
    particlesMesh.rotation.y += 0.0005 * (mouseX * 0.01);
    particlesMesh.rotation.x += 0.0005 * (mouseY * 0.01);
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}
animate();

// 2. إعداد GSAP والأنيميشن (الحل النهائي للخلل)
gsap.registerPlugin(ScrollTrigger);

// دالة التشغيل عند تحميل الصفحة
window.addEventListener('load', () => {
    
    // حركة دخول القائمة العلوية
    gsap.from(".navbar", {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out"
    });

    // حركة النصوص في الصفحة الرئيسية (حل مشكلة الاختفاء)
    // نستخدم set لضمان أن العناصر تبدأ من وضعية معينة ثم تظهر
    gsap.from(".animate-text", {
        duration: 1.8,
        y: 60,
        opacity: 0,
        stagger: 0.3,
        ease: "power4.out",
        clearProps: "all" // هذا السطر يضمن أن العناصر تثبت في مكانها بعد انتهاء الحركة ولا تختفي
    });

    // 3. حركة ذكية لعناصر المعرض عند التمرير (لصفحات الأعمال)
    gsap.utils.toArray(".project-card, .contact-card").forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            scale: 0.9,
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "expo.out"
        });
    });
});

// 4. تأثير الماوس 3D على الكروت (احترافي جداً)
document.addEventListener("mousemove", (e) => {
    const cards = document.querySelectorAll(".project-card, .contact-card");
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.5
        });
    });
});

// تحديث الحجم عند تغيير نافذة المتصفح
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});