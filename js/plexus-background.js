import * as THREE from 'three';

class PlexusBackground {
    constructor() {
        this.container = document.getElementById('plexus-canvas');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.container,
            antialias: true,
            alpha: true
        });

        this.points = [];
        this.count = 80;
        this.maxDistance = 15;
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);

        this.init();
        this.createPlexus();
        this.animate();
        this.setupInteractions();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 20;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createPlexus() {
        this.group = new THREE.Group();
        this.scene.add(this.group);

        const material = new THREE.MeshBasicMaterial({
            color: 0xC08E7B,
            transparent: true,
            opacity: 0.8
        });
        const sphereGeom = new THREE.SphereGeometry(0.05, 8, 8);

        for (let i = 0; i < this.count; i++) {
            const mesh = new THREE.Mesh(sphereGeom, material);
            mesh.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20
            );
            mesh.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            );
            this.group.add(mesh);
            this.points.push(mesh);
        }

        // Lines
        this.linePositions = new Float32Array(this.count * this.count * 3);
        this.lineGeometry = new THREE.BufferGeometry();
        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x333F48,
            transparent: true,
            opacity: 0.15
        });

        this.lines = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
        this.scene.add(this.lines);
    }

    setupInteractions() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth - 0.5);
            this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Mouse Smoothing
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Group Parallalax
        this.group.rotation.y = this.mouse.x * 0.2;
        this.group.rotation.x = -this.mouse.y * 0.2;

        let lineIdx = 0;
        const positions = this.lineGeometry.attributes.position.array;

        for (let i = 0; i < this.count; i++) {
            const p1 = this.points[i];

            // Move points
            p1.position.add(p1.userData.velocity);

            // Bounds check
            if (Math.abs(p1.position.x) > 22) p1.userData.velocity.x *= -1;
            if (Math.abs(p1.position.y) > 17) p1.userData.velocity.y *= -1;
            if (Math.abs(p1.position.z) > 12) p1.userData.velocity.z *= -1;

            // Connections
            for (let j = i + 1; j < this.count; j++) {
                const p2 = this.points[j];
                const dist = p1.position.distanceTo(p2.position);

                if (dist < this.maxDistance) {
                    positions[lineIdx++] = p1.position.x;
                    positions[lineIdx++] = p1.position.y;
                    positions[lineIdx++] = p1.position.z;

                    positions[lineIdx++] = p2.position.x;
                    positions[lineIdx++] = p2.position.y;
                    positions[lineIdx++] = p2.position.z;
                }
            }
        }

        this.lineGeometry.attributes.position.needsUpdate = true;
        this.lineGeometry.setDrawRange(0, lineIdx);

        this.renderer.render(this.scene, this.camera);
    }
}

new PlexusBackground();
