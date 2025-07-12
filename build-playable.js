// build-playable.js
import fs from 'fs';
import path from 'path';
import bestzip from 'bestzip';

const DIST_DIR = './dist';
const OUTPUT_ZIP = './playable.zip';
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const INDEX_JS_PATH = path.join(DIST_DIR, 'index.js'); // Ожидаем index.js в корне dist

async function inlineScriptAndCleanup() {
	// Проверяем наличие необходимых файлов
	if (!fs.existsSync(INDEX_HTML_PATH)) {
		throw new Error(`Ошибка: ${INDEX_HTML_PATH} не найден. Убедитесь, что Vite успешно завершил сборку.`);
	}
	if (!fs.existsSync(INDEX_JS_PATH)) {
		throw new Error(`Ошибка: ${INDEX_JS_PATH} не найден. Убедитесь, что Vite сконфигурирован для создания одного index.js в корне dist.`);
	}
	
	let html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
	const js = fs.readFileSync(INDEX_JS_PATH, 'utf-8');
	
	// --- ИЗМЕНЕНИЕ 1: Инлайним скрипт, сохраняя type="module" ---
	// Ищем тег <script> со ссылкой на index.js, учитывая возможные атрибуты (type, crossorigin)
	// Заменяем его на инлайновый скрипт с тем же type="module"
	html = html.replace(
		/<script(?=\s|>)([^>]*?)src=["']\.\/index\.js["']([^>]*)>(.*?)<\/script>/gs,
		(match, preSrcAttrs, postSrcAttrs) => {
			// Сохраняем все атрибуты, кроме src, и добавляем type="module" если его нет
			const attrs = `${preSrcAttrs} ${postSrcAttrs}`.trim();
			const typeModuleAttr = attrs.includes('type="module"') ? '' : 'type="module"';
			return `<script ${typeModuleAttr} ${attrs}>\n${js}\n</script>`;
		}
	);
	
	// --- ИЗМЕНЕНИЕ 2: Удаляем ссылку на favicon ---
	// Удаляем теги <link> с rel="icon"
	html = html.replace(/<link[^>]*rel=["']icon["'][^>]*>/g, '');
	// Также удаляем ссылку на apple-touch-icon, если есть
	html = html.replace(/<link[^>]*rel=["']apple-touch-icon["'][^>]*>/g, '');
	
	// --- ОПЦИОНАЛЬНО: Удаляем другие нежелательные внешние ссылки, если они есть и не нужны ---
	// Если у вас есть внешние CSS-файлы, которые Vite не инлайнит, и они не должны попасть в ZIP:
	// html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/g, '');
	
	fs.writeFileSync(INDEX_HTML_PATH, html, 'utf-8');
	console.log('✅ Скрипт заинлайнен, favicon удален из index.html.');
}

async function zipResult() {
	await bestzip({
		source: ['index.html'], // Только index.html должен быть в архиве
		destination: OUTPUT_ZIP,
		cwd: DIST_DIR, // Архивация прямо из папки dist
	});
	console.log(`📦 Архив создан: ${OUTPUT_ZIP}`);
}

// Запускаем последовательность операций
inlineScriptAndCleanup()
	.then(zipResult)
	.catch(err => {
		console.error('❌ Ошибка при сборке playable ad:', err);
		process.exit(1);
	});
