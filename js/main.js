// إعداد المشهد 3D
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// الكاميرا
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// المصير (Renderer)
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// إضافة جزيئات (Particles) لتعطي شكل فخم وحديث
const geometry = new THREE.BufferGeometry();
const particlesCount = 2000; // عدد النقاط
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // توزيع النقاط عشوائياً
    posArray[i] = (Math.random() - 0.5) * 15; 
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// خامة النقاط (لون ذهبي)
const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0xD4AF37, // لون ذهبي
    transparent: true,
    opacity: 0.8
});

// تكوين الشكل النهائي
const particlesMesh = new THREE.Points(geometry, material);
scene.add(particlesMesh);

// تفاعل مع الماوس
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// دالة التحريك المستمر
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // تدوير الجزيئات ببطء
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // تحريك بسيط بناءً على الماوس
    particlesMesh.rotation.y += 0.0005 * (mouseX * 0.01);
    particlesMesh.rotation.x += 0.0005 * (mouseY * 0.01);

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

animate();

// GSAP Animations (حركات دخول النصوص)
gsap.from(".animate-text", {
    duration: 1.5,
    y: 50,
    opacity: 0,
    stagger: 0.3, // تأخير زمني بين كل عنصر
    ease: "power3.out"
});

// تعديل حجم الشاشة عند التغيير
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// تأكد من استدعاء مكتبة GSAP و ScrollTrigger في الـ HTML أولاً
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

gsap.registerPlugin(ScrollTrigger);

// 1. حركة دخول القائمة العلوية (Navbar) عند فتح الموقع
gsap.from(".navbar", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
});

// 2. حركة ذكية لكل العناصر التي تحمل كلاس animate-on-scroll
gsap.utils.toArray(".animate-on-scroll").forEach(element => {
    gsap.to(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%", // تبدأ الحركة عندما يصل العنصر لـ 85% من الشاشة
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out"
    });
});

// 3. حركة "الصور الكبيرة" في الجرافيك (تأثير الظهور المتتابع)
gsap.from(".graphic-item", {
    scrollTrigger: {
        trigger: ".graphic-grid",
        start: "top 80%",
    },
    scale: 0.8,
    opacity: 0,
    duration: 1,
    stagger: 0.2, // يجعل الصور تدخل واحدة تلو الأخرى بسرعة
    ease: "back.out(1.7)"
});
document.addEventListener("mousemove", (e) => {
    const cards = document.querySelectorAll(".graphic-item, .project-card");
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;

        const angleX = (mouseY - cardY) / 30;
        const angleY = (cardX - mouseX) / 30;

        gsap.to(card, {
            rotationX: angleX,
            rotationY: angleY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.5
        });
    });
});