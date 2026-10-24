const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const themeButton = $('#theme-toggle');
themeButton.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; localStorage.setItem('green-theme', next) });

const sidebar = $('#sidebar'), scrim = $('#scrim');
function closeMenu() { sidebar.classList.remove('open'); scrim.classList.remove('open') }
$('#menu-toggle').addEventListener('click', () => { sidebar.classList.toggle('open'); scrim.classList.toggle('open') }); scrim.addEventListener('click', closeMenu);
$$('.nav-link').forEach(a => a.addEventListener('click', closeMenu));

$$('pre').forEach(pre => { const button = document.createElement('button'); button.className = 'copy-button pre-copy'; button.setAttribute('aria-label', 'Copy code'); button.innerHTML = '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>'; button.addEventListener('click', () => copy(pre.querySelector('code').textContent, button)); pre.append(button) });
$$('[data-copy]').forEach(button => button.addEventListener('click', () => copy(button.dataset.copy, button)));
async function copy(value, button) { await navigator.clipboard.writeText(value); const old = button.innerHTML; button.textContent = '✓'; setTimeout(() => button.innerHTML = old, 1300) }

const sections = $$('.doc-section'), navLinks = $$('.nav-link');
const observer = new IntersectionObserver(entries => { const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (!visible) return; navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + visible.target.id)); buildToc(visible.target) }, { rootMargin: '-15% 0px -65%', threshold: [0, .2, .5] }); sections.forEach(s => observer.observe(s));
function buildToc(section) { const toc = $('#toc-list'); const headings = [...section.querySelectorAll('h2,h3')]; toc.innerHTML = headings.map(h => { if (!h.id) h.id = section.id + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-'); return `<a href="#${h.id}">${h.textContent}</a>` }).join('') }
buildToc(sections[0]);

const dialog = $('#search-dialog'), input = $('#search-input'), results = $('#search-results');
const docs = sections.map(s => ({ id: s.id, title: s.dataset.title || s.querySelector('h2')?.textContent || 'Overview', text: s.innerText.replace(/\s+/g, ' ').trim() }));
function openSearch() { dialog.showModal(); input.value = ''; renderResults(''); setTimeout(() => input.focus(), 20) }
function closeSearch() { dialog.close() }
$('.search-trigger').addEventListener('click', openSearch);
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch() } if (e.key === 'Escape' && dialog.open) closeSearch() });
dialog.addEventListener('click', e => { if (e.target === dialog) closeSearch() });
input.addEventListener('input', () => renderResults(input.value));
function renderResults(query) { const q = query.trim().toLowerCase(); const matches = q ? docs.filter(d => (d.title + ' ' + d.text).toLowerCase().includes(q)) : docs.slice(0, 7); results.innerHTML = matches.length ? matches.map(d => { const i = q ? d.text.toLowerCase().indexOf(q) : -1; const excerpt = i >= 0 ? d.text.slice(Math.max(0, i - 35), i + 100) : d.text.slice(0, 120); return `<a class="search-result" href="#${d.id}"><strong>${d.title}</strong><span>${excerpt}…</span></a>` }).join('') : '<div class="empty-state">No documentation found.</div>'; $$('.search-result', results).forEach(a => a.addEventListener('click', closeSearch)) }

if (location.hash) { setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 50) }
