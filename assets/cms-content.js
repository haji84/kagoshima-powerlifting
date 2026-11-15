/* GitHub Pages に静的に公開された CMS JSON を表示。全て textContent で描画する。 */
(() => {
  'use strict';
  const doc = document;
  const make = (tag, text, className) => {
    const el = doc.createElement(tag);
    if (text !== undefined && text !== null) el.textContent = String(text);
    if (className) el.className = className;
    return el;
  };
  const validURL = (text) => {
    if (typeof text !== 'string' || !text.trim()) return null;
    try {
      const url = new URL(text.trim(), location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch (_) { return null; }
  };
  const linkTo = (url, title) => {
    const safe = validURL(url);
    if (!safe) return null;
    const a = make('a', title, 'textLink');
    a.href = safe;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    return a;
  };
  const dateText = (date) => String(date || '').replaceAll('-', '.');
  const byDate = (a, b) => String(b.date).localeCompare(String(a.date));
  async function load(name, render) {
    try {
      const response = await fetch('./content/' + name + '.json');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      if (!data || !Array.isArray(data.items)) throw new Error('invalid items');
      render(data.items);
    } catch (error) {
      console.warn('CMS content unavailable (' + name + '); keeping original content', error);
    }
  }
  load('news', (items) => {
    const holder = doc.querySelector('#news .newsList');
    if (!holder) return;
    const rows = items.filter((v) => v && v.date && v.title)
      .sort(byDate).map((entry) => {
        const article = make('article');
        const time = make('time', dateText(entry.date));
        time.dateTime = entry.date;
        article.append(time, make('span', entry.category || 'ご案内', 'newsCategory'), make('p', entry.title));
        if (entry.body) article.append(make('p', entry.body));
        const a = linkTo(entry.url, '詳細を見る');
        if (a) article.append(a);
        return article;
      });
    if (rows.length) holder.replaceChildren(...rows);
  });
  load('events', (items) => {
    const holder = doc.querySelector('#events .eventFeature');
    if (!holder || !items.length) return;
    const body = make('div');
    body.append(make('p', '大会スケジュール', 'statusBadge'), make('h3', '県内大会スケジュール'));
    const ul = make('ul', null, 'cmsEntryList');
    items.filter((v) => v && v.date && v.title && v.venue).sort(byDate).forEach((entry) => {
      const li = make('li');
      li.append(make('strong', dateText(entry.date) + '　' + entry.title));
      li.append(make('p', '会場：' + entry.venue));
      if (entry.description) li.append(make('p', entry.description));
      const a = linkTo(entry.url, '大会要項・申込情報を見る');
      if (a) li.append(a);
      ul.append(li);
    });
    if (ul.childElementCount) { body.append(ul); holder.replaceChildren(body); }
  });
  load('results', (items) => {
    const holder = doc.querySelector('#events .eventArchive');
    if (!holder || !items.length) return;
    const ul = make('ul', null, 'cmsEntryList');
    items.filter((v) => v && v.date && v.title && validURL(v.url)).sort(byDate).forEach((v) => {
      const li = make('li');
      li.append(make('span', dateText(v.date) + ' '));
      li.append(linkTo(v.url, v.title));
      ul.append(li);
    });
    if (ul.childElementCount) holder.replaceChildren(make('p', 'PAST EVENT', 'sectionEyebrow'), make('h3', '過去の大会実績'), ul);
  });
  load('records', (items) => {
    const holder = doc.querySelector('#records .recordCards');
    if (!holder || !items.length) return;
    const rows = items.filter((v) => v && v.category && v.weightClass && v.lift && v.athlete && Number(v.weightKg) > 0 && validURL(v.sourceUrl));
    if (!rows.length) return;
    const wrapper = make('div', null, 'cmsTableWrap');
    const table = make('table', null, 'cmsRecordTable');
    const head = make('thead');
    const trHead = make('tr');
    ['区分','ギア','年代','階級','種目','選手','記録','日付','根拠'].forEach((s) => trHead.append(make('th', s)));
    head.append(trHead);
    const tbody = make('tbody');
    rows.forEach((entry) => {
      const tr = make('tr');
      [entry.category,entry.equipment,entry.ageGroup,entry.weightClass,entry.lift,entry.athlete,entry.weightKg + 'kg',dateText(entry.date)].forEach((v) => tr.append(make('td', v)));
      const td = make('td');
      td.append(linkTo(entry.sourceUrl, '公式資料'));
      tr.append(td);
      tbody.append(tr);
    });
    table.append(head, tbody);
    wrapper.append(table);
    holder.replaceChildren(wrapper);
  });
  load('clubs', (items) => {
    const holder = doc.querySelector('.clubsPanel > div');
    if (!holder || !items.length) return;
    const ul = make('ul', null, 'cmsEntryList');
    items.filter((v) => v && v.name && v.area).forEach((v) => {
      const li = make('li');
      li.append(make('strong', v.name));
      li.append(make('p', v.area + (v.description ? '　' + v.description : '')));
      const a = linkTo(v.url, '施設・クラブの情報');
      if (a) li.append(a);
      ul.append(li);
    });
    if (ul.childElementCount) { const p = holder.querySelector('p:not(.sectionEyebrow)'); if (p) p.remove(); holder.append(ul); }
  });
})();
