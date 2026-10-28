(() => {
  const languages = [
    ['html', 'HTML'], ['css', 'CSS'], ['python', 'Python'], ['java', 'Java'],
    ['javascript', 'JavaScript'], ['rust', 'Rust'], ['csharp', 'C#'], ['c', 'C'],
    ['cpp', 'C++'], ['go', 'Go'], ['kotlin', 'Kotlin'], ['swift', 'Swift'],
    ['php', 'PHP'], ['typescript', 'TypeScript']
  ];
  const runnable = new Set(['html', 'css', 'javascript']);
  const starters = {
    html: '<main>\n  <h1>Моя первая страница</h1>\n  <p>Я меняю HTML и сразу вижу результат.</p>\n  <button>Нажми меня</button>\n</main>',
    css: 'body {\n  font-family: sans-serif;\n  padding: 2rem;\n}\nh1 {\n  color: rebeccapurple;\n}',
    javascript: 'const name = "Мира";\nconst score = 7;\n\nconsole.log(`Привет, ${name}!`);\nconsole.log("Твой результат:", score);',
    python: 'name = "Мира"\nscore = 7\nprint(f"Привет, {name}! Твой результат: {score}")',
    java: 'public class Main {\n    public static void main(String[] args) {\n        String name = "Мира";\n        System.out.println("Привет, " + name + "!");\n    }\n}',
    rust: 'fn main() {\n    let name = "Мира";\n    println!("Привет, {}!", name);\n}',
    csharp: 'string name = "Мира";\nConsole.WriteLine($"Привет, {name}!");',
    c: '#include <stdio.h>\n\nint main(void) {\n    printf("Привет, мир!\\n");\n    return 0;\n}',
    cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Привет, мир!\\n";\n    return 0;\n}',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    name := "Мира"\n    fmt.Println("Привет,", name)\n}',
    kotlin: 'fun main() {\n    val name = "Мира"\n    println("Привет, $name!")\n}',
    swift: 'let name = "Мира"\nprint("Привет, \\(name)!")',
    php: '<?php\n$name = "Мира";\necho "Привет, $name!";\n?>',
    typescript: 'const name: string = "Мира";\nconst score: number = 7;\nconsole.log(`Привет, ${name}! Результат: ${score}`);'
  };
  const storagePrefix = 'code-zero-playground-v1-';

  function explainLine(line, language) {
    const text = line.trim();
    if (!text) return 'Пустая строка: она разделяет части кода и облегчает чтение.';
    if (/^(\/\/|#\s|\/\*|\*|<!--|\{|\}|\);?$)/.test(text)) {
      if (/^(\/\/|#\s|\/\*|\*|<!--)/.test(text)) return 'Комментарий: пояснение для человека. Среда обычно не выполняет его как команду.';
      return 'Скобка задаёт границу блока или выражения; сопоставь её с открывающей/закрывающей частью выше.';
    }
    if (/^<!doctype/i.test(text)) return 'Объявляет тип HTML-документа, чтобы браузер использовал современный стандартный режим.';
    if (/^<\/?[a-z]/i.test(text)) return 'HTML-тег создаёт элемент страницы. Открывающий и закрывающий теги вместе задают границы содержимого.';
    if (/^[.#][\w-]+\s*\{|^[\w*-][\w-]*\s*\{|^@media/.test(text)) return 'Селектор или правило CSS выбирает элементы, для которых применятся свойства внутри фигурных скобок.';
    if (/^[\w-]+\s*:\s*.+;?$/.test(text) && !/^(https?|return|case)\b/.test(text)) return 'CSS-декларация: слева свойство, справа значение. Точка с запятой отделяет её от следующего свойства.';
    if (/^(import|#include|package|using|from)\b/.test(text)) return 'Подключает модуль, библиотеку или объявляет пакет: так код получает доступ к нужным возможностям.';
    if (/^(if|else|elif|switch|when)\b/.test(text)) return 'Ветвление выбирает, какой блок выполнить, в зависимости от условия или значения.';
    if (/^(for|while|foreach|loop)\b/.test(text)) return 'Цикл повторяет блок кода. Проверь начальное значение, условие остановки и шаг, чтобы не пропустить элементы и не зациклиться.';
    if (/^(function|func|fn|fun|def|static\s+\w+|public\s+static|async\s+function)\b/.test(text)) return 'Объявляет функцию/метод: именованный блок, который можно вызвать и при необходимости передать ему аргументы.';
    if (/^(return|yield)\b/.test(text)) return 'Возвращает значение из функции вызывающему коду и обычно завершает её выполнение.';
    if (/^(const|let|var|val|int|double|float|bool|boolean|string|char|auto|short|long|byte)\b/.test(text) || /:=/.test(text)) return 'Объявляет или присваивает переменную: имя связывается со значением, которое можно использовать в следующих строках.';
    if (/\b(console\.log|Console\.WriteLine|Console\.Write|print\(|println!|println\(|printf\(|echo\b|System\.out|fmt\.Print)/.test(text)) return 'Выводит значение: помогает показать результат человеку или проверить, что происходит во время выполнения.';
    if (/^<\/?(main|section|article|header|footer|nav|div|p|h[1-6]|button|a|img|ul|li|form|input)\b/i.test(text)) return 'Создаёт HTML-элемент. Семантический тег сообщает браузеру и вспомогательным технологиям роль содержимого.';
    if (/^[}\])]/.test(text)) return 'Закрывает ранее открытый блок, список аргументов или выражение. Проверь, что пары скобок совпадают.';
    if (/[=+*/<>!-]/.test(text)) return 'Выражение или операция: вычисляет значение, сравнивает данные либо передаёт значение переменной.';
    return `Инструкция языка ${language}: прочитай её слева направо и найди имя, данные и действие. Если изменишь эту строку, сравни результат запуска.`;
  }

  function makePreview(language, code) {
    if (language === 'html') return code;
    if (language === 'css') return `<!doctype html><html lang="ru"><meta charset="utf-8"><style>${code}</style><body><main><h1>Проверка CSS</h1><p>Меняй стили — результат обновится здесь.</p><button>Пример кнопки</button></main></body></html>`;
    const encoded = encodeURIComponent(code);
    return `<!doctype html><html lang="ru"><meta charset="utf-8"><body style="font:16px system-ui;padding:16px;background:#101522;color:#f4f5fb"><strong>Вывод программы</strong><pre id="out" style="white-space:pre-wrap;color:#72e5c1"></pre><script>
      const out=document.getElementById('out');
      const show=(...values)=>{out.textContent += values.map(v=>{try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}).join(' ')+'\\n'};
      console.log=show; console.info=show; console.warn=(...v)=>show('⚠',...v); console.error=(...v)=>show('Ошибка:',...v);
      try { new Function(decodeURIComponent(${JSON.stringify(encoded)}))(); } catch (error) { show(error.name+': '+error.message); }
    <\/script></body></html>`;
  }

  function buildPlayground(courseId) {
    const section = document.createElement('section');
    section.className = 'code-lab';
    section.setAttribute('aria-label', 'Редактор и запуск собственного кода');
    section.innerHTML = `
      <div class="lab-heading"><div><span class="lab-kicker">ПРАКТИКА В БРАУЗЕРЕ</span><h3>Напиши код и проверь идею</h3></div><span class="lab-spark" aria-hidden="true">✳</span></div>
      <p class="lab-intro">Редактируй пример, запускай и разбирай пояснение к каждой строке. Код сохраняется в этом браузере.</p>
      <label class="lab-language-label" for="labLanguage">Язык для редактора</label>
      <select class="lab-language" id="labLanguage">${languages.map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}</select>
      <div class="lab-editor-heading"><label for="labEditor">ТВОЙ КОД</label><button class="lab-reset" type="button">Вернуть пример</button></div>
      <textarea class="lab-editor" id="labEditor" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Редактор кода"></textarea>
      <div class="lab-actions"><button class="lab-run" type="button">▶ Запустить</button><span class="lab-status" role="status" aria-live="polite"></span></div>
      <div class="lab-output-wrap"><div class="lab-output-label">РЕЗУЛЬТАТ / ПРЕДПРОСМОТР</div><iframe class="lab-output" title="Результат запуска кода" sandbox="allow-scripts"></iframe></div>
      <div class="lab-explanations"><div class="lab-explanation-heading"><strong>Разбор построчно</strong><span>Обновляется при вводе</span></div><ol class="lab-line-notes"></ol></div>`;

    const select = section.querySelector('.lab-language');
    const editor = section.querySelector('.lab-editor');
    const frame = section.querySelector('.lab-output');
    const status = section.querySelector('.lab-status');
    const notes = section.querySelector('.lab-line-notes');

    function refreshNotes() {
      const rows = editor.value.split('\n').slice(0, 200);
      notes.replaceChildren();
      rows.forEach((line, index) => {
        const item = document.createElement('li');
        const number = document.createElement('span');
        const explanation = document.createElement('span');
        number.className = 'lab-line-number';
        number.textContent = String(index + 1).padStart(2, '0');
        explanation.textContent = explainLine(line, select.options[select.selectedIndex].text);
        item.append(number, explanation);
        notes.append(item);
      });
      if (editor.value.split('\n').length > 200) {
        const item = document.createElement('li');
        item.textContent = 'Показаны первые 200 строк.';
        notes.append(item);
      }
    }

    function loadCode(language, preserve = true) {
      const key = storagePrefix + language;
      let value = '';
      if (preserve) {
        try { value = localStorage.getItem(key) || ''; } catch (error) { /* storage may be disabled */ }
      }
      editor.value = value || starters[language] || '';
      refreshNotes();
    }

    function run() {
      const language = select.value;
      if (!runnable.has(language)) {
        frame.srcdoc = '<!doctype html><meta charset="utf-8"><body style="font:15px system-ui;padding:18px;background:#101522;color:#d5dbea"><h2>Нужна среда выполнения</h2><p>Этот язык нельзя честно скомпилировать одним браузером. Редактор и построчный разбор работают, но запуск Python, Java, C/C++, Rust, Go и остальных требует интерпретатора или компилятора. В песочнице без сервера и установки пакетов такой запуск недоступен.</p><p>Для мгновенного запуска здесь доступны HTML, CSS и JavaScript.</p></body>';
        status.textContent = 'Редактор готов; для запуска этого языка нужен компилятор.';
        return;
      }
      frame.srcdoc = makePreview(language, editor.value);
      status.textContent = language === 'javascript' ? 'JavaScript запущен в изолированном окне; вывод появится в предпросмотре.' : 'Предпросмотр обновлён.';
    }

    select.value = languages.some(([id]) => id === courseId) ? courseId : 'javascript';
    loadCode(select.value);
    select.addEventListener('change', () => {
      loadCode(select.value);
      run();
    });
    editor.addEventListener('input', () => {
      try { localStorage.setItem(storagePrefix + select.value, editor.value); } catch (error) { /* storage may be disabled */ }
      refreshNotes();
    });
    section.querySelector('.lab-run').addEventListener('click', run);
    section.querySelector('.lab-reset').addEventListener('click', () => {
      editor.value = starters[select.value] || '';
      try { localStorage.removeItem(storagePrefix + select.value); } catch (error) { /* storage may be disabled */ }
      refreshNotes();
      run();
    });
    run();
    return section;
  }

  function install() {
    const lesson = document.getElementById('tutorialLesson');
    const title = document.getElementById('tutorialTitle');
    if (!lesson || !title) return;
    const observer = new MutationObserver(() => {
      if (!lesson.children.length || lesson.querySelector('.code-lab')) return;
      const course = [...languages].sort((a, b) => b[1].length - a[1].length).find(([id, name]) => title.textContent.includes(name));
      lesson.append(buildPlayground(course ? course[0] : 'javascript'));
    });
    observer.observe(lesson, { childList: true });
  }

  function explainTutorialCodeLine(line, language, lineIndex, lines) {
    const text = line.trim();
    const base = explainLine(line, language);
    if (!text) return 'Пустая строка отделяет смысловые части кода; на выполнение она не влияет.';
    if (language === 'html') {
      const tags = text.match(/<\/?[a-z][^>]*>/gi) || [];
      if (/^<!doctype/i.test(text)) return 'Сообщает браузеру, что документ использует современный стандарт HTML; это не обычный тег и его ставят в начале файла.';
      if (tags.length > 1) return `На этой строке ${tags.length} HTML-тега (${tags.join(', ')}): открывающие создают элементы, закрывающие отмечают конец содержимого. Атрибуты внутри тегов задают дополнительные свойства.`;
      if (/^<\//.test(text)) return 'Закрывающий тег завершает соответствующий элемент. Имя после </ должно совпадать с именем открывающего тега.';
      if (/^<[a-z]/i.test(text)) {
        const attributes = [...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => `${match[1]}="${match[2]}"`);
        return `Открывающий тег создаёт HTML-элемент${attributes.length ? `; атрибуты ${attributes.join(', ')} задают его настройки` : ''}. Всё содержимое до закрывающего тега относится к этому элементу.`;
      }
    }
    if (language === 'css') {
      if (text.startsWith('@media')) return 'Медиазапрос включает вложенные правила только при подходящих характеристиках экрана; здесь условие задаётся шириной окна.';
      if (text.endsWith('{')) return 'Начинается блок CSS-правила. Перед фигурной скобкой указан селектор, который выбирает элементы для оформления.';
      const declaration = text.match(/^([\w-]+)\s*:\s*(.+);?$/);
      if (declaration) return `CSS-свойство ${declaration[1]} получает значение ${declaration[2].replace(/;$/, '')}; браузер применяет его к элементам выбранного селектором блока.`;
      if (text === '}') return 'Закрывает текущий блок CSS и заканчивает список свойств этого правила.';
    }
    if (/^(const|let|var|val|int|double|float|bool|boolean|string|String|char|auto|short|long|byte|var)\b|:=/i.test(text)) {
      const name = text.match(/^(?:const|let|var|val|int|double|float|bool|boolean|string|String|char|auto|short|long|byte)\s+(?:[\w<>?\[\]]+\s+)?([\w$]+)/i)?.[1] || text.match(/^([\w$]+)\s*:=/)?.[1];
      return `${base}${name ? ` Имя переменной здесь — «${name}»; найди справа от знака присваивания исходное значение, которое она будет хранить.` : ''}`;
    }
    if (/^(if|else|elif|switch|when)\b/.test(text)) return `${base} Эта строка проверяет условие или начинает альтернативную ветку; следующая часть блока выполняется только по соответствующему пути.`;
    if (/^(for|while|foreach|loop)\b/.test(text)) return `${base} Отследи начальное значение/элемент, условие продолжения и изменение на каждом повторе — так видно, сколько раз выполнится тело цикла.`;
    if (/^(function|func|fn|fun|def|static\s+\w+|public\s+static)\b/.test(text)) return `${base} Эта строка задаёт имя функции и её входные параметры. Тело между границами блока выполняется при вызове функции.`;
    if (/^return\b/.test(text)) return `${base} Вычисленное справа значение отправляется обратно туда, откуда вызвали функцию; дальнейшие строки этой функции обычно уже не выполняются.`;
    if (/console\.(log|info|warn|error)|print\(|println!|println\(|printf\(|echo\b|System\.out|fmt\.Print/.test(text)) return `${base} Это точка вывода: вычисли подставленные значения и текст в кавычках, чтобы предсказать, что увидит пользователь или разработчик.`;
    if (/^[{}()[\]]+[;,]?$/.test(text)) return `${base} Сопоставь эту скобку с открывающей: она завершает блок, список или вызов, начатый выше.`;
    if (/^\s*(\/\/|#|\/\*|\*|<!--)/.test(line)) return 'Комментарий для человека: объясняет намерение автора и не выполняется как команда программы.';
    if (/^[\w.]+\s*\(/.test(text)) return `${base} Это вызов функции или метода: имя перед скобками выбирает действие, а значения в скобках передаются ему как аргументы.`;
    if (/[=+*/<>!-]/.test(text)) return `${base} Разбери выражение слева направо: оператор связывает значения, сравнивает их или изменяет данные. Скобки могут задавать порядок вычисления.`;
    if (lineIndex > 0 && /^\s*[\w$"']/.test(line)) return `${base} Эта инструкция продолжает логику предыдущих строк. Проверь, какое значение она использует и что изменится после её выполнения.`;
    return base;
  }

  function enhanceTutorialExample() {
    const lesson = document.getElementById('tutorialLesson');
    const nav = document.getElementById('tutorialNav');
    const codeBlock = lesson && lesson.querySelector('.tutorial-code-card .example-code');
    if (!codeBlock || !nav) return;
    const active = nav.querySelector('.tutorial-nav-item.active');
    const lessonIndex = Math.max(0, [...nav.querySelectorAll('.tutorial-nav-item')].indexOf(active));
    const course = typeof courses !== 'undefined' && typeof selectedCourse !== 'undefined'
      ? courses.find(item => item.id === selectedCourse)
      : null;
    if (!course || !course.steps.length) return;

    const key = `${course.id}-${lessonIndex}`;
    if (codeBlock.dataset.lessonExampleKey === key) return;
    // Cycle through language-specific course examples instead of reusing one chapter's sample for every lesson.
    const sampleIndex = (lessonIndex * 3 + Math.floor(lessonIndex / 4) * 2) % course.steps.length;
    let code = course.steps[sampleIndex][2];
    if (course.id === 'html') code = code.replace(/></g, '>\n<');
    const lessonLabel = (active && active.textContent || `Урок ${lessonIndex + 1}`).replace(/^\s*\d+\s*/, '').trim();
    const commentText = `Урок ${lessonIndex + 1}: ${lessonLabel}`.replace(/[<>\r\n]/g, ' ').slice(0, 100);
    if (course.id === 'html') code = `<!-- ${commentText} -->\n${code}`;
    else if (course.id === 'css') code = `/* ${commentText} */\n${code}`;
    else if (course.id === 'python') code = `# ${commentText}\n${code}`;
    else if (course.id === 'php' && code.startsWith('<?php')) code = code.replace('<?php', `<?php\n// ${commentText}`);
    else code = `// ${commentText}\n${code}`;
    const studentNames = ['Аня', 'Тимур', 'Лена', 'Марк', 'Саша', 'Ира', 'Даня', 'Майя'];
    code = code.replace(/Мира/g, studentNames[lessonIndex % studentNames.length])
      .replace(/Лев/g, studentNames[(lessonIndex + 3) % studentNames.length])
      .replace(/Привет, мир!/g, `Привет! Урок ${lessonIndex + 1}`);
    codeBlock.textContent = code;
    codeBlock.dataset.lessonExampleKey = key;

    let breakdown = lesson.querySelector('.tutorial-line-breakdown');
    if (breakdown) breakdown.remove();
    breakdown = document.createElement('section');
    breakdown.className = 'tutorial-line-breakdown';
    const heading = document.createElement('div');
    heading.className = 'tutorial-card-label';
    heading.textContent = 'ПОШАГОВЫЙ РАЗБОР КАЖДОЙ СТРОКИ';
    const intro = document.createElement('p');
    intro.textContent = `Пример ${sampleIndex + 1} из курса ${course.name}. Читай код сверху вниз: номер в списке соответствует номеру строки в примере.`;
    const list = document.createElement('ol');
    list.className = 'tutorial-line-breakdown-list';
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const item = document.createElement('li');
      const number = document.createElement('span');
      number.className = 'tutorial-line-breakdown-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const explanation = document.createElement('span');
      explanation.textContent = explainTutorialCodeLine(line, course.id, index, lines);
      item.append(number, explanation);
      list.append(item);
    });
    breakdown.append(heading, intro, list);
    const codeCard = lesson.querySelector('.tutorial-code-card');
    codeCard.insertAdjacentElement('afterend', breakdown);
  }

  function observeTutorialExamples() {
    const lesson = document.getElementById('tutorialLesson');
    if (!lesson) return;
    const observer = new MutationObserver(enhanceTutorialExample);
    observer.observe(lesson, { childList: true, subtree: true });
    const nav = document.getElementById('tutorialNav');
    if (nav) nav.addEventListener('click', () => setTimeout(enhanceTutorialExample, 0));
    enhanceTutorialExample();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { install(); observeTutorialExamples(); });
  } else {
    install();
    observeTutorialExamples();
  }
})();
