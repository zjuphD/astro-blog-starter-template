(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const revealTargets = [
    '.statement',
    '.section-intro',
    '.capability-grid article',
    '.dark-copy',
    '.stack-map',
    '.task-list > div',
    '.final-cta'
  ];

  const nodes = document.querySelectorAll(revealTargets.join(','));
  nodes.forEach((node) => node.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

  nodes.forEach((node) => observer.observe(node));

  const steps = Array.from(document.querySelectorAll('.agent-panel li'));
  if (steps.length) {
    let activeIndex = 0;
    const renderSteps = () => {
      steps.forEach((step, index) => {
        step.classList.toggle('is-active', index === activeIndex);
        step.classList.toggle('is-done', index < activeIndex);
      });
    };
    renderSteps();
    window.setInterval(() => {
      activeIndex = (activeIndex + 1) % steps.length;
      renderSteps();
    }, 1500);
  }

  const demo = document.querySelector('.demo-window');
  if (demo && window.matchMedia('(pointer:fine)').matches) {
    demo.addEventListener('mousemove', (event) => {
      const rect = demo.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      demo.style.transform = `perspective(1200px) rotateX(${(-y * 1.5).toFixed(2)}deg) rotateY(${(x * 1.8).toFixed(2)}deg) translateY(-2px)`;
    });
    demo.addEventListener('mouseleave', () => {
      demo.style.transform = '';
    });
  }
})();
