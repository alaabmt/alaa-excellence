const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const articleGrid = document.getElementById('article-grid');
const articleCards = [...document.querySelectorAll('.article-card[data-category]')];
const searchInput = document.getElementById('article-search');
const topicFilter = document.getElementById('topic-filter');
const dateFilter = document.getElementById('date-filter');
const readFilter = document.getElementById('read-filter');
const sortFilter = document.getElementById('sort-filter');
const clearFiltersButton = document.getElementById('clear-article-filters');
const resultsCount = document.getElementById('article-results-count');
const emptyState = document.getElementById('article-empty-state');

let activeCategory = 'all';

const normalizeText = (value = '') => value
  .toLocaleLowerCase('ar')
  .replace(/[أإآ]/g, 'ا')
  .replace(/ى/g, 'ي')
  .replace(/ة/g, 'ه')
  .trim();

const getCardDate = (card) => {
  const value = card.dataset.date;
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const withinDateRange = (card, range) => {
  if (range === 'all') return true;
  const cardDate = getCardDate(card);
  if (!cardDate) return false;

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (range === 'today') {
    return cardDate.getFullYear() === now.getFullYear()
      && cardDate.getMonth() === now.getMonth()
      && cardDate.getDate() === now.getDate();
  }

  if (range === 'week') {
    start.setDate(start.getDate() - 7);
    return cardDate >= start && cardDate <= now;
  }

  if (range === 'month') {
    return cardDate.getFullYear() === now.getFullYear() && cardDate.getMonth() === now.getMonth() && cardDate <= now;
  }

  if (range === '3months') {
    start.setMonth(start.getMonth() - 3);
    return cardDate >= start && cardDate <= now;
  }

  if (range === 'year') {
    return cardDate.getFullYear() === now.getFullYear() && cardDate <= now;
  }

  return true;
};

const matchesReadingTime = (card, range) => {
  if (range === 'all') return true;
  const minutes = Number(card.dataset.readMinutes || 0);
  if (range === 'quick') return minutes > 0 && minutes <= 3;
  if (range === 'medium') return minutes >= 4 && minutes <= 7;
  if (range === 'deep') return minutes >= 8;
  return true;
};

const availableCardsForCategory = () => articleCards.filter((card) => {
  const categories = (card.dataset.category || '').split(' ');
  return activeCategory === 'all' || categories.includes(activeCategory);
});

const populateTopics = () => {
  if (!topicFilter) return;
  const previous = topicFilter.value;
  const topics = [...new Set(availableCardsForCategory().map((card) => card.dataset.topic).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'ar'));

  topicFilter.innerHTML = '<option value="all">كل الموضوعات</option>'
    + topics.map((topic) => `<option value="${topic}">${topic}</option>`).join('');

  if (topics.includes(previous)) topicFilter.value = previous;
};

const sortCards = () => {
  if (!articleGrid || !sortFilter) return;
  const mode = sortFilter.value;
  const sorted = [...articleCards].sort((a, b) => {
    if (mode === 'oldest' || mode === 'newest') {
      const aDate = getCardDate(a)?.getTime() || 0;
      const bDate = getCardDate(b)?.getTime() || 0;
      return mode === 'newest' ? bDate - aDate : aDate - bDate;
    }
    if (mode === 'shortest') {
      return Number(a.dataset.readMinutes || 999) - Number(b.dataset.readMinutes || 999);
    }
    return 0;
  });
  sorted.forEach((card) => articleGrid.appendChild(card));
};

const applyArticleFilters = () => {
  if (!articleCards.length) return;

  const query = normalizeText(searchInput?.value || '');
  const topic = topicFilter?.value || 'all';
  const dateRange = dateFilter?.value || 'all';
  const readingRange = readFilter?.value || 'all';
  let visibleCount = 0;

  articleCards.forEach((card) => {
    const categories = (card.dataset.category || '').split(' ');
    const categoryMatch = activeCategory === 'all' || categories.includes(activeCategory);
    const topicMatch = topic === 'all' || card.dataset.topic === topic;
    const searchMatch = !query || normalizeText(card.textContent).includes(query);
    const dateMatch = withinDateRange(card, dateRange);
    const readingMatch = matchesReadingTime(card, readingRange);
    const show = categoryMatch && topicMatch && searchMatch && dateMatch && readingMatch;
    card.hidden = !show;
    if (show) visibleCount += 1;
  });

  sortCards();

  if (resultsCount) {
    resultsCount.textContent = visibleCount === 1 ? 'مقال واحد' : `${visibleCount} مقالات`;
  }
  if (emptyState) emptyState.hidden = visibleCount !== 0;
};

if (filterButtons.length && articleCards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter || 'all';
      filterButtons.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      populateTopics();
      applyArticleFilters();
    });
  });
}

[searchInput, topicFilter, dateFilter, readFilter, sortFilter].forEach((control) => {
  if (!control) return;
  control.addEventListener(control === searchInput ? 'input' : 'change', applyArticleFilters);
});

if (clearFiltersButton) {
  clearFiltersButton.addEventListener('click', () => {
    activeCategory = 'all';
    filterButtons.forEach((button) => {
      const isAll = button.dataset.filter === 'all';
      button.classList.toggle('active', isAll);
      button.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });
    if (searchInput) searchInput.value = '';
    if (dateFilter) dateFilter.value = 'all';
    if (readFilter) readFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'newest';
    populateTopics();
    if (topicFilter) topicFilter.value = 'all';
    applyArticleFilters();
  });
}

populateTopics();
applyArticleFilters();

document.querySelectorAll('.article-card[data-href]').forEach((card) => {
  const href = card.dataset.href;
  if (!href || href === '#') return;

  card.classList.add('article-card-clickable');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');

  const go = () => { window.location.href = href; };
  card.addEventListener('click', (event) => {
    if (event.target.closest('a,button')) return;
    go();
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      go();
    }
  });
});
