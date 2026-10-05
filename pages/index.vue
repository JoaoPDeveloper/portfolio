<script setup lang="ts">
import {
  ArrowRight, ArrowUpRight, Coffee, Github, Linkedin, Mail, Moon, Sun, Languages, ChevronDown, MessageCircle,
} from 'lucide-vue-next';
import { useAppearance } from '~/composables/useAppearance';
import { useI18n } from '~/composables/useI18n';
import profileData from '~/data/profile.json';
import technologies from '~/data/technologies.json';
import socialLinks from '~/data/social-links.json';
import projects from '~/data/projects.json';

const { resolvedAppearance: _ra, updateAppearance: _ua } = useAppearance();
const { locale, t, toggleLocale } = useI18n();

const profile = computed(() => ({
  name: profileData.name,
  lastName: profileData.lastName,
  role: profileData.role[locale.value],
  headline: profileData.headline[locale.value],
  intro: profileData.intro[locale.value],
  bio: profileData.bio[locale.value],
  aboutPoints: profileData.aboutPoints[locale.value],
  stats: profileData.stats[locale.value],
  experience: profileData.experience,
  cases: profileData.cases,
  testimonials: profileData.testimonials,
  avatarUrl: profileData.avatarUrl,
  email: profileData.email,
  whatsapp: profileData.whatsapp,
  location: profileData.location[locale.value],
}));

const featuredProjects = computed(() => projects.filter((p) => p.isFeatured));
const iconMap: Record<string, any> = { Coffee, Github, Linkedin, Mail };
const socialIcon = (icon?: string | null) => icon && icon in iconMap ? iconMap[icon] : ArrowUpRight;
const toggleTheme = () => {};
const getTechBySlug = (slug: string) => technologies.find((t) => t.slug === slug);
const localizedShort = (p: typeof projects[0]) => p.shortDescription[locale.value];

const openJob = ref<number | null>(0);
const toggleJob = (i: number) => { openJob.value = openJob.value === i ? null : i; };

// Tech graph
const techCanvas = ref<HTMLCanvasElement | null>(null);
const hoveredTech = ref<typeof technologies[0] | null>(null);
const tooltipPos = ref({ x: 0, y: 0 });

onMounted(() => {
  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target as HTMLElement;
        if (el.dataset.revealChildren !== undefined) {
          (Array.from(el.children) as HTMLElement[]).forEach((k, i) => {
            k.style.transitionDelay = `${i * 90}ms`;
          });
        }
        el.classList.add('in');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal], [data-reveal-children]').forEach((el) => observer.observe(el));

  const glow = document.getElementById('cursor-glow');
  if (glow) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08;
      glow.style.transform = `translate(${cx - 240}px,${cy - 240}px)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement | null;
  if (canvas) {
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
    const count = Math.floor((W * H) / 14000);
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      a: Math.random(),
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.a += 0.004;
        const alpha = (Math.sin(p.a) * 0.5 + 0.5) * 0.7 + 0.1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(17,181,164,${alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  // --- Tech Graph ---
  const tc = techCanvas.value;
  if (!tc) return;
  const gctx = tc.getContext('2d')!;

  // Connections: index pairs that make sense (back-end cluster, front-end cluster, etc.)
  // technologies order: Java(0) Spring(1) PHP(2) Laravel(3) TS(4) Vue(5) React(6) Angular(7)
  // Node(8) JS(9) SQL(10) AWS(11) Git(12) Tailwind(13) Firebase(14) Bootstrap(15) HTML(16) CSS(17)
  const edges = [
    [0,1],[0,10],[0,11],[1,10],[1,11],[1,12],
    [2,3],[2,10],[2,16],[2,17],[3,5],[3,10],[3,12],
    [4,5],[4,6],[4,7],[4,8],[4,9],
    [5,13],[5,16],[5,17],[6,13],[6,16],[6,17],
    [7,16],[7,17],[8,9],[8,10],
    [9,16],[9,17],[9,14],[9,15],
    [11,12],[13,17],[14,16],[15,16],[15,17],
  ];

  type Node = { x: number; y: number; vx: number; vy: number; ox: number; oy: number; t: number; img: HTMLImageElement | null; loaded: boolean; };
  const nodes: Node[] = [];

  const resize = () => {
    tc.width = tc.offsetWidth;
    tc.height = tc.offsetHeight;
    const W2 = tc.width, H2 = tc.height;
    const cols = Math.ceil(Math.sqrt(technologies.length * W2 / H2));
    const rows = Math.ceil(technologies.length / cols);
    const cw = W2 / cols, ch = H2 / rows;
    technologies.forEach((_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = cw * col + cw / 2 + (Math.random() - 0.5) * cw * 0.4;
      const y = ch * row + ch / 2 + (Math.random() - 0.5) * ch * 0.4;
      if (nodes[i]) { nodes[i].ox = x; nodes[i].oy = y; }
      else nodes[i] = { x, y, vx: 0, vy: 0, ox: x, oy: y, t: Math.random() * Math.PI * 2, img: null, loaded: false };
    });
  };
  resize();
  window.addEventListener('resize', resize);

  // Preload icons
  technologies.forEach((tech, i) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { nodes[i].img = img; nodes[i].loaded = true; };
    img.src = tech.iconUrl;
  });

  let hovIdx = -1;
  const R = 22;

  tc.addEventListener('mousemove', (e) => {
    const rect = tc.getBoundingClientRect();
    const mx2 = e.clientX - rect.left, my2 = e.clientY - rect.top;
    hovIdx = -1;
    nodes.forEach((n, i) => {
      const dx = n.x - mx2, dy = n.y - my2;
      if (Math.sqrt(dx * dx + dy * dy) < R + 6) {
        hovIdx = i;
        hoveredTech.value = technologies[i];
        tooltipPos.value = { x: n.x, y: n.y };
      }
    });
    if (hovIdx === -1) hoveredTech.value = null;
    tc.style.cursor = hovIdx !== -1 ? 'pointer' : 'default';
  });
  tc.addEventListener('mouseleave', () => { hovIdx = -1; hoveredTech.value = null; });
  tc.addEventListener('click', () => {
    if (hovIdx !== -1) window.open(technologies[hovIdx].url, '_blank', 'noreferrer');
  });

  const drawGraph = () => {
    const W2 = tc.width, H2 = tc.height;
    gctx.clearRect(0, 0, W2, H2);

    // Animate float
    nodes.forEach((n) => {
      n.t += 0.008;
      n.x = n.ox + Math.sin(n.t) * 6;
      n.y = n.oy + Math.cos(n.t * 0.7) * 5;
    });

    // Draw edges
    edges.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      if (!na || !nb) return;
      const isHov = hovIdx === a || hovIdx === b;
      gctx.beginPath();
      gctx.moveTo(na.x, na.y);
      gctx.lineTo(nb.x, nb.y);
      gctx.strokeStyle = isHov ? 'rgba(17,181,164,0.55)' : 'rgba(255,255,255,0.055)';
      gctx.lineWidth = isHov ? 1.5 : 0.8;
      gctx.stroke();
    });

    // Draw nodes
    nodes.forEach((n, i) => {
      const tech = technologies[i];
      const isHov = hovIdx === i;
      const isConn = hovIdx !== -1 && edges.some(([a, b]) => (a === hovIdx && b === i) || (b === hovIdx && a === i));
      const r = isHov ? R + 4 : R;

      // Glow on hover
      if (isHov) {
        gctx.beginPath();
        gctx.arc(n.x, n.y, r + 10, 0, Math.PI * 2);
        const grad = gctx.createRadialGradient(n.x, n.y, r, n.x, n.y, r + 14);
        grad.addColorStop(0, 'rgba(17,181,164,0.25)');
        grad.addColorStop(1, 'transparent');
        gctx.fillStyle = grad;
        gctx.fill();
      }

      // Circle bg
      gctx.beginPath();
      gctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      gctx.fillStyle = isHov ? '#11b5a4' : isConn ? '#1a2030' : '#111520';
      gctx.fill();
      gctx.strokeStyle = isHov ? '#11b5a4' : isConn ? 'rgba(17,181,164,0.4)' : 'rgba(255,255,255,0.1)';
      gctx.lineWidth = isHov ? 2 : 1;
      gctx.stroke();

      // Icon
      if (n.loaded && n.img) {
        const s = r * 1.0;
        gctx.save();
        if (isHov) gctx.filter = 'brightness(0) invert(1)';
        gctx.drawImage(n.img, n.x - s / 2, n.y - s / 2, s, s);
        gctx.restore();
      } else {
        // Fallback: first 2 letters
        gctx.fillStyle = isHov ? '#06080c' : '#9aa3b4';
        gctx.font = `bold ${r * 0.55}px monospace`;
        gctx.textAlign = 'center';
        gctx.textBaseline = 'middle';
        gctx.fillText(tech.name.slice(0, 2).toUpperCase(), n.x, n.y);
      }
    });

    requestAnimationFrame(drawGraph);
  };
  drawGraph();
});

useHead({ title: `${profileData.name} ${profileData.lastName} - Portfolio` });
</script>

<template>
  <main class="relative min-h-screen bg-[#0d0f14] text-[#eef1f6]" style="font-family:'Space Grotesk',system-ui,sans-serif">

    <!-- Particles -->
    <canvas id="particles-canvas" aria-hidden="true" />

    <!-- Cursor glow -->
    <div id="cursor-glow" aria-hidden="true" />

    <!-- Header -->
    <header class="fixed inset-x-0 top-0 z-30 border-b border-white/7 bg-[#0d0f14]/85 backdrop-blur-xl">
      <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <NuxtLink to="/" class="font-bold tracking-tight text-[#eef1f6]" style="font-family:'Space Grotesk',sans-serif">
          JP<span class="text-[#11b5a4]">.</span>
        </NuxtLink>
        <div class="flex items-center gap-1 text-sm">
          <a href="#stack" class="hidden px-3 py-2 text-[#9aa3b4] transition-colors hover:text-white sm:inline">{{ t('nav.stack') }}</a>
          <a href="#projetos" class="hidden px-3 py-2 text-[#9aa3b4] transition-colors hover:text-white sm:inline">{{ t('nav.projects') }}</a>
          <a href="#experiencia" class="hidden px-3 py-2 text-[#9aa3b4] transition-colors hover:text-white sm:inline">{{ t('experience.label') }}</a>
          <a href="#cases" class="hidden px-3 py-2 text-[#9aa3b4] transition-colors hover:text-white sm:inline">{{ t('cases.label') }}</a>
          <a href="#contato" class="hidden px-3 py-2 text-[#9aa3b4] transition-colors hover:text-white sm:inline">{{ t('nav.contact') }}</a>
          <button type="button" class="ml-2 inline-flex h-9 items-center gap-1.5 rounded-full border border-white/14 px-3 font-mono text-xs text-[#9aa3b4] transition hover:border-[#11b5a4]/50 hover:text-white" @click="toggleLocale">
            <Languages class="size-3.5" />
            {{ locale === 'pt' ? 'EN' : 'PT' }}
          </button>
          <button type="button" class="ml-1 inline-flex size-9 items-center justify-center rounded-full border border-white/14 text-[#9aa3b4] transition hover:border-[#11b5a4]/50 hover:text-white" title="Dark mode only" disabled>
            <Moon class="size-4" />
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero -->
    <section id="top" class="relative min-h-svh max-w-6xl mx-auto px-5 sm:px-8 pt-28 pb-16 flex flex-col gap-10">
      <div aria-hidden="true" class="pointer-events-none absolute right-[-10%] top-[-10%] w-[min(70vw,720px)] aspect-square rounded-full"
        style="background:radial-gradient(circle,rgba(17,181,164,.15),transparent 62%);filter:blur(40px);animation:breathe 9s ease-in-out infinite" />

      <div class="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <!-- Text -->
        <div class="flex flex-col gap-7">
          <span class="inline-flex items-center gap-2.5 font-mono text-xs text-[#11b5a4] tracking-wide" style="animation:fadein 1s both">
            <span class="size-2 rounded-full bg-current" style="box-shadow:0 0 12px currentColor" />
            {{ locale === 'pt' ? 'Disponível para novos projetos · Brasil' : 'Available for new projects · Brazil' }}
          </span>

          <div style="animation:rise 1s cubic-bezier(.2,.7,.2,1) .05s both">
            <p class="font-mono text-sm text-[#11b5a4] mb-2">{{ profile.role }}</p>
            <h1 class="text-[clamp(38px,6vw,80px)] font-bold leading-[.96] tracking-[-0.04em] text-[#eef1f6]">
              {{ profile.name }}<br />{{ profile.lastName }}
            </h1>
          </div>

          <p class="max-w-2xl text-[clamp(16px,1.6vw,20px)] leading-relaxed text-[#aab3c4]" style="animation:rise 1s cubic-bezier(.2,.7,.2,1) .2s both">
            <strong class="text-[#eef1f6] font-medium">{{ profile.headline }}</strong>
            {{ ' ' }}{{ profile.intro }}
          </p>

          <div class="flex flex-wrap gap-3" style="animation:rise 1s cubic-bezier(.2,.7,.2,1) .35s both">
            <a href="#contato"
              class="inline-flex h-12 items-center gap-2 rounded-full bg-[#11b5a4] px-6 text-sm font-semibold text-[#06080c] transition-transform hover:-translate-y-0.5 hover:bg-[#0ecfbb]">
              {{ t('hero.chat') }} <Mail class="size-4" />
            </a>
            <a href="#projetos"
              class="inline-flex h-12 items-center gap-2 rounded-full border border-white/16 px-6 text-sm font-medium text-[#eef1f6] transition hover:-translate-y-0.5 hover:border-white/30">
              {{ t('hero.viewProjects') }} <ArrowRight class="size-4" />
            </a>
          </div>

          <!-- Stats -->
          <div class="flex flex-wrap gap-8 pt-2" style="animation:fadein 1.2s .6s both">
            <div v-for="stat in profile.stats" :key="stat.value" class="flex flex-col gap-1">
              <span class="font-bold text-[clamp(28px,3vw,40px)] leading-none tracking-[-0.04em] text-[#11b5a4]" style="font-variant-numeric:tabular-nums">{{ stat.value }}</span>
              <span class="font-mono text-xs text-[#9aa3b4]">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <!-- Photo with orbit -->
        <div class="relative mx-auto w-[min(220px,38vw)] aspect-[4/5] mt-4" style="animation:fadein 1.4s .3s both">
          <div aria-hidden="true" class="absolute inset-[-9%] rounded-full border border-dashed border-[#11b5a4]/35" style="animation:orbit 40s linear infinite" />
          <div aria-hidden="true" class="absolute inset-[-9%] rounded-full" style="animation:orbit 40s linear infinite">
            <span class="absolute top-[-5px] left-1/2 size-2.5 rounded-full bg-[#11b5a4]" style="box-shadow:0 0 16px #11b5a4" />
          </div>
          <img :src="profile.avatarUrl" :alt="profile.name"
            class="w-full h-full object-cover rounded-3xl"
            style="filter:grayscale(1) contrast(1.08);mask-image:linear-gradient(#000 70%,transparent 100%)" />
        </div>
      </div>
    </section>

    <!-- Marquee -->
    <!-- <div aria-hidden="true" class="relative overflow-hidden border-y border-white/7 bg-[#090c12] py-4"
      style="mask-image:linear-gradient(90deg,transparent,#000 60px,#000 calc(100% - 60px),transparent)">
      <div class="marquee-track">
        <span v-for="tech in [...technologies, ...technologies]" :key="tech.slug + Math.random()"
          class="inline-flex items-center gap-3 px-6 font-mono text-xs text-[#7f8898]">
          {{ tech.name }}
          <span class="size-1 rounded-full bg-[#11b5a4]" />
        </span>
      </div>
    </div> -->

    <!-- About -->
    <section class="relative mx-auto max-w-6xl px-5 sm:px-8 py-24 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <div data-reveal="left">
        <span class="font-mono text-xs text-[#11b5a4]">{{ t('about.label') }}</span>
        <h2 class="mt-3 text-[clamp(28px,3.5vw,48px)] font-bold tracking-[-0.035em] leading-none">{{ t('about.title') }}</h2>
      </div>
      <div data-reveal class="space-y-6">
        <p class="text-lg leading-8 text-[#aab3c4]">{{ profile.bio }}</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <div v-for="point in profile.aboutPoints" :key="point"
            class="rounded-2xl border border-white/8 bg-[#0a0d14] p-5 text-sm leading-6 text-[#9aa3b4]">
            {{ point }}
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack -->
    <section id="stack" class="relative border-y border-white/7 bg-[#0a0c11] py-20">
      <div class="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal="left" class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end mb-10">
          <div>
            <span class="font-mono text-xs text-[#11b5a4]">{{ t('stack.label') }}</span>
            <h2 class="mt-3 text-[clamp(28px,3.5vw,48px)] font-bold tracking-[-0.035em] leading-none">{{ t('stack.title') }}</h2>
          </div>
          <p class="max-w-sm text-sm leading-6 text-[#7f8898]">{{ t('stack.description') }}</p>
        </div>

        <!-- Tech Graph -->
        <div class="relative w-full" style="height:480px">
          <canvas ref="techCanvas" class="absolute inset-0 w-full h-full rounded-2xl" />
          <!-- Tooltip -->
          <div v-if="hoveredTech"
            class="pointer-events-none absolute z-10 flex items-center gap-2 rounded-xl border border-white/12 bg-[#0d0f14]/95 px-3 py-2 text-sm font-semibold text-[#eef1f6] shadow-xl backdrop-blur-sm"
            :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px', transform: 'translate(-50%,-130%)' }">
            <img :src="hoveredTech.iconUrl" :alt="hoveredTech.name" class="size-4 object-contain" />
            {{ hoveredTech.name }}
          </div>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section id="projetos" class="relative mx-auto max-w-6xl px-5 sm:px-8 py-24">
      <div data-reveal="left" class="flex items-end gap-4 flex-wrap mb-12">
        <span class="font-mono text-xs text-[#11b5a4]">01</span>
        <h2 class="text-[clamp(28px,4vw,56px)] font-bold tracking-[-0.035em] leading-none">{{ t('projects.title') }}</h2>
        <span class="ml-auto text-sm text-[#9aa3b4]">{{ t('projects.description') }}</span>
      </div>

      <div data-reveal-children class="grid gap-4 lg:grid-cols-3">
        <NuxtLink v-for="(project, i) in featuredProjects" :key="project.slug"
          :to="`/projetos/${project.slug}`"
          class="group relative flex flex-col gap-5 rounded-2xl border border-white/8 bg-gradient-to-b from-[#0c0f16] to-[#090b11] p-6 overflow-hidden transition-all duration-300 hover:border-[#11b5a4]/40 hover:-translate-y-1">
          <span aria-hidden="true" class="absolute right-[-6px] top-[-14px] font-bold text-[110px] leading-none tracking-[-0.06em] text-white/[0.035] pointer-events-none select-none">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <div class="aspect-[16/9] overflow-hidden rounded-xl bg-[#0d1118]">
            <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-semibold leading-snug">{{ project.title }}</h3>
            <ArrowUpRight class="mt-0.5 size-5 shrink-0 text-[#11b5a4]" />
          </div>
          <p class="text-sm leading-6 text-[#9aa3b4]">{{ localizedShort(project) }}</p>
          <div class="mt-auto flex flex-wrap gap-2">
            <span v-for="slug in project.technologies" :key="slug"
              class="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-[#9aa3b4]">
              {{ getTechBySlug(slug)?.name || slug }}
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- All projects list -->
      <div class="mt-10 divide-y divide-white/7 border-y border-white/7">
        <NuxtLink v-for="project in projects" :key="project.slug"
          :to="`/projetos/${project.slug}`"
          class="group flex items-center gap-4 py-5 transition-all hover:px-3">
          <span class="font-mono text-xs text-[#11b5a4] w-6 shrink-0">{{ String(projects.indexOf(project) + 1).padStart(2, '0') }}</span>
          <h3 class="flex-1 font-semibold text-[#eef1f6]">{{ project.title }}</h3>
          <p class="hidden text-sm text-[#9aa3b4] md:block max-w-xs">{{ localizedShort(project) }}</p>
          <ArrowUpRight class="size-4 text-[#11b5a4] shrink-0" />
        </NuxtLink>
      </div>
    </section>

    <!-- Experience -->
    <section id="experiencia" class="relative border-y border-white/7 bg-[#0a0c11] py-24">
      <div class="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal="left" class="flex items-end gap-4 flex-wrap mb-12">
          <span class="font-mono text-xs text-[#11b5a4]">02</span>
          <h2 class="text-[clamp(28px,4vw,56px)] font-bold tracking-[-0.035em] leading-none">{{ t('experience.title') }}</h2>
        </div>

        <div class="relative pl-8">
          <div class="tl-line" />

          <div v-for="(job, i) in profile.experience" :key="i" class="relative mb-3">
            <span class="absolute left-[-29px] top-6 size-4 rounded-full border-2 z-10 transition-all duration-300"
              :class="openJob === i ? 'border-[#11b5a4] bg-[#11b5a4] shadow-[0_0_10px_rgba(17,181,164,.6)]' : 'border-white/20 bg-[#0d0f14]'" />

            <div class="rounded-2xl border transition-all duration-300"
              :class="openJob === i ? 'border-[#11b5a4]/30 bg-[#11b5a4]/[0.04]' : 'border-white/7 bg-[#0f1117]'">
              <button type="button" class="w-full grid grid-cols-[auto_1fr_auto] gap-4 items-center p-5 text-left cursor-pointer" @click="toggleJob(i)">
                <!-- Terminal icon -->
                <div class="flex flex-col gap-1 font-mono text-xs text-[#9aa3b4] min-w-[90px]">
                  <span>{{ job.start[locale] }}</span>
                  <span>{{ job.end[locale] }}</span>
                  <span class="text-[#11b5a4]">{{ job.duration[locale] }}</span>
                </div>
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Terminal icon badge -->
                  <span class="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#1a1d24] border border-white/10 font-mono text-[#9aa3b4] text-sm select-none">&gt;_</span>
                  <div class="flex flex-col gap-1 min-w-0">
                    <span class="text-lg font-semibold leading-snug text-[#eef1f6]">{{ job.role[locale] }}</span>
                    <span class="text-sm text-[#11b5a4]">{{ job.company }}
                      <span class="text-[#7f8898]"> · {{ job.type[locale] }}</span>
                    </span>
                  </div>
                </div>
                <ChevronDown class="size-5 text-[#7f8898] transition-transform duration-300 shrink-0"
                  :class="openJob === i ? 'rotate-180 text-[#11b5a4]' : ''" />
              </button>

              <div v-if="openJob === i" class="job-body px-5 pb-5 grid grid-cols-[auto_1fr] gap-4">
                <span />
                <div class="flex flex-col gap-4">
                  <p class="text-sm leading-7 text-[#aab3c4]">{{ job.description[locale] }}</p>
                  <ul class="flex flex-col gap-2">
                    <li v-for="h in job.highlights[locale]" :key="h" class="flex gap-3 text-sm leading-6 text-[#d5dae3]">
                      <span class="mt-2.5 size-1.5 rounded-full bg-[#11b5a4] shrink-0" />
                      {{ h }}
                    </li>
                  </ul>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span v-for="tech in job.technologies" :key="tech"
                      class="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-[#9aa3b4]">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cases -->
    <section id="cases" class="relative mx-auto max-w-6xl px-5 sm:px-8 py-24">
      <div data-reveal="left" class="flex items-end gap-4 flex-wrap mb-12">
        <span class="font-mono text-xs text-[#11b5a4]">03</span>
        <h2 class="text-[clamp(28px,4vw,56px)] font-bold tracking-[-0.035em] leading-none">{{ t('cases.title') }}</h2>
        <span class="ml-auto text-sm text-[#9aa3b4]">{{ t('cases.description') }}</span>
      </div>

      <!-- Empty state -->
      <div v-if="!profile.cases || profile.cases.length === 0"
        class="rounded-2xl border border-dashed border-white/10 bg-[#0f1117] p-12 text-center">
        <span class="font-mono text-sm text-[#5c6577]">{{ t('cases.empty') }}</span>
      </div>

      <!-- Cases: grid 2 colunas -->
      <div v-else data-reveal-children class="grid gap-4 lg:grid-cols-2">
        <article v-for="(c, i) in profile.cases" :key="i"
          class="relative flex flex-col gap-6 rounded-2xl border border-white/8 bg-gradient-to-b from-[#0f1117] to-[#0c0e13] p-7 overflow-hidden flex-1 min-w-0 transition-all duration-300 hover:border-[#11b5a4]/40">
          <!-- número fantasma -->
          <span aria-hidden="true" class="absolute right-[-4px] top-[-12px] font-bold text-[100px] leading-none tracking-[-0.06em] text-white/[0.03] pointer-events-none select-none">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <!-- tag + contexto -->
          <div class="flex gap-2 flex-wrap font-mono text-xs relative">
            <span class="px-2.5 py-1 rounded-full bg-[#11b5a4]/12 text-[#11b5a4]">{{ c.tag }}</span>
            <span class="text-[#7f8898] self-center">{{ c.context }}</span>
          </div>
          <!-- título -->
          <h3 class="text-xl font-semibold leading-snug relative">{{ c.title[locale] }}</h3>
          <!-- problema / abordagem / resultado -->
          <div class="flex flex-col gap-3 text-sm leading-6 relative">
            <div class="grid grid-cols-[76px_1fr] gap-2">
              <span class="font-mono text-[10px] uppercase tracking-wider text-[#7f8898] pt-0.5">{{ t('cases.problem') }}</span>
              <p class="text-[#aab3c4] m-0">{{ c.problem[locale] }}</p>
            </div>
            <div class="grid grid-cols-[76px_1fr] gap-2">
              <span class="font-mono text-[10px] uppercase tracking-wider text-[#7f8898] pt-0.5">{{ t('cases.approach') }}</span>
              <p class="text-[#aab3c4] m-0">{{ c.approach[locale] }}</p>
            </div>
            <div class="grid grid-cols-[76px_1fr] gap-2 rounded-xl border border-[#11b5a4]/20 bg-[#11b5a4]/5 p-3">
              <span class="font-mono text-[10px] uppercase tracking-wider text-[#11b5a4] pt-0.5">{{ t('cases.result') }}</span>
              <p class="text-[#eef1f6] m-0 font-medium">{{ c.result[locale] }}</p>
            </div>
          </div>
          <!-- techs -->
          <div class="flex flex-wrap gap-2 mt-auto relative">
            <span v-for="tech in c.technologies" :key="tech"
              class="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-[#9aa3b4]">
              {{ tech }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="depoimentos" class="relative border-y border-white/7 bg-[#0a0c11] py-24">
      <div class="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-reveal="left" class="flex items-end gap-4 flex-wrap mb-12">
          <span class="font-mono text-xs text-[#11b5a4]">04</span>
          <h2 class="text-[clamp(28px,4vw,56px)] font-bold tracking-[-0.035em] leading-none">{{ t('testimonials.title') }}</h2>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!profile.testimonials || profile.testimonials.length === 0"
        class="mx-auto max-w-6xl px-5 sm:px-8">
        <div class="rounded-2xl border border-dashed border-white/10 bg-[#0f1117] p-12 text-center">
          <span class="font-mono text-sm text-[#5c6577]">{{ t('testimonials.empty') }}</span>
        </div>
      </div>

      <!-- Carrossel horizontal infinito -->
      <div v-else class="relative overflow-hidden"
        style="mask-image:linear-gradient(90deg,transparent,#000 80px,#000 calc(100% - 80px),transparent)">
        <div class="testimonials-track">
          <!-- duplica para loop infinito -->
          <figure
            v-for="(item, i) in [...profile.testimonials, ...profile.testimonials, ...profile.testimonials]"
            :key="i"
            class="flex-none w-[min(380px,85vw)] mx-3 flex flex-col gap-5 rounded-2xl border border-white/8 bg-[#0f1117] p-6 cursor-default"
          >
            <span class="font-bold text-5xl leading-none text-[#11b5a4] select-none">&ldquo;</span>
            <blockquote class="m-0 text-base font-medium leading-relaxed text-[#eef1f6] flex-1">
              {{ item.quote[locale] }}
            </blockquote>
            <figcaption class="flex items-center gap-3 pt-2 border-t border-white/7">
              <span class="size-10 rounded-full bg-[#11b5a4]/15 text-[#11b5a4] font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                {{ item.initials }}
              </span>
              <div>
                <strong class="block text-sm text-[#eef1f6]">{{ item.name }}</strong>
                <span class="text-xs text-[#9aa3b4]">{{ item.role }} &middot; {{ item.company }}</span>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Footer / Contact -->
    <footer id="contato" class="relative bg-[#0d0f14] border-t border-white/7">
      <div class="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div data-reveal class="flex flex-col gap-4">
            <p class="font-mono text-xs text-[#7f8898]">{{ t('footer.subtitle') }}</p>
            <h2 class="text-[clamp(28px,4vw,52px)] font-bold tracking-[-0.04em] leading-none">{{ t('footer.title') }}</h2>
            <p class="font-mono text-xs text-[#11b5a4] flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-current" style="box-shadow:0 0 8px currentColor" />
              {{ t('contact.open') }}
            </p>
          </div>
          <div data-reveal class="flex flex-col gap-3">
            <!-- WhatsApp destaque -->
            <a :href="profile.whatsapp" target="_blank" rel="noreferrer"
              class="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#25d366] px-5 text-sm font-semibold text-[#06080c] transition hover:-translate-y-0.5 hover:bg-[#20bd5a]">
              <MessageCircle class="size-4" />
              {{ t('contact.whatsapp') }}
            </a>
            <div class="flex flex-wrap gap-2">
              <a v-for="link in socialLinks" :key="link.label"
                :href="link.url" target="_blank" rel="noreferrer"
                class="inline-flex h-10 items-center gap-2 rounded-full border border-white/14 px-4 text-sm text-[#eef1f6] transition hover:-translate-y-0.5 hover:border-[#11b5a4]/50">
                <component :is="socialIcon(link.icon)" class="size-4" />
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-white/7 py-5 text-center font-mono text-xs text-[#5c6577]">
        © {{ new Date().getFullYear() }} João Pedro Lima Pereira
      </div>
    </footer>

  </main>
</template>
