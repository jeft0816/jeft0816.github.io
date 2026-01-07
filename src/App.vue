<script setup>
const links = [
  { icon: 'fa-brands fa-github', label: 'GitHub', url: 'https://github.com/jeft0816', color: '#6e5494' },
  { icon: 'fa-solid fa-envelope', label: 'Email', url: 'mailto:jeft0816@gmail.com', color: '#ea4335' },
  { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', url: '#', color: '#0077b5' },
  { icon: 'fa-brands fa-instagram', label: 'Instagram', url: 'https://instagram.com/', color: '#e4405f' }
]

const skills = ['Vue.js', '.NET 8', 'C#', 'TypeScript', 'Docker', 'Azure', 'SQL', 'React']
</script>

<template>
  <div class="portfolio-container">
    <!-- Ambient Glow -->
    <div class="ambient-glow"></div>
    
    <!-- Main Card -->
    <div class="profile-card">
      <!-- Avatar -->
      <div class="avatar-wrapper">
        <div class="avatar">
          <i class="fa-solid fa-code"></i>
        </div>
        <div class="status-dot"></div>
      </div>

      <!-- Info -->
      <h1 class="name">JEFT</h1>
      <p class="title">Yazılım Geliştirici</p>
      <p class="bio">Modern web teknolojileri ve sistem mimarileri üzerinde çalışıyorum.</p>

      <!-- Skills -->
      <div class="skills-row">
        <span v-for="skill in skills" :key="skill" class="skill-pill">{{ skill }}</span>
      </div>

      <!-- Links -->
      <div class="links-grid">
        <a 
          v-for="link in links" 
          :key="link.label" 
          :href="link.url" 
          target="_blank"
          class="link-button"
          :style="{ '--hover-color': link.color }"
        >
          <i :class="link.icon"></i>
          <span>{{ link.label }}</span>
        </a>
      </div>
    </div>

    <!-- Footer -->
    <p class="footer-text">© 2026 JEFT</p>
  </div>
</template>

<style>
.portfolio-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 480px;
  width: 100%;
}

.ambient-glow {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.profile-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-soft);
  position: relative;
  z-index: 1;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  color: white;
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}

.status-dot {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background: #22c55e;
  border: 3px solid #1a1a2e;
  border-radius: 50%;
}

.name {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 0.25rem;
}

.title {
  font-size: 1.1rem;
  color: var(--accent-light);
  font-weight: 500;
  margin-bottom: 1rem;
}

.bio {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}

.skills-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.skill-pill {
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: var(--accent-light);
  padding: 0.4rem 0.9rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.link-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.link-button i {
  font-size: 1.1rem;
}

.link-button:hover {
  background: var(--hover-color);
  border-color: var(--hover-color);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.8rem;
  opacity: 0.5;
}

@media (max-width: 480px) {
  .profile-card {
    padding: 2rem 1.5rem;
  }
  .name {
    font-size: 2rem;
  }
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
