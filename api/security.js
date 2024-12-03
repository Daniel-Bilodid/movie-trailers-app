export default (req, res) => {
  // Обрабатываем OPTIONS-запросы для CORS
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://movie-trailers-app.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return res.status(200).end(); // Завершаем обработку для OPTIONS
  }

  // Генерация nonce для скриптов и стилей
  const nonce = Math.random().toString(36).substr(2, 10);

  // Получаем текущую метку времени Unix
  const unixTimestamp = Math.floor(Date.now() / 1000);

  // Устанавливаем заголовок Content Security Policy (CSP)
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; ` +
      `script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com; ` +
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com; ` +
      `img-src 'self' https://images.com; ` +
      `connect-src 'self'; ` +
      `font-src 'self' https://fonts.gstatic.com; ` +
      `frame-ancestors 'none';`
  );

  // Устанавливаем заголовок X-Frame-Options
  res.setHeader("X-Frame-Options", "DENY");

  // Устанавливаем заголовок X-Content-Type-Options
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Устанавливаем заголовок Strict-Transport-Security
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Устанавливаем заголовки для управления кешированием
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Убираем информацию о сервере
  res.setHeader("X-Powered-By", "");

  // Удаляем временные метки из заголовков
  res.removeHeader("Date");
  res.removeHeader("Last-Modified");

  // Защищаем от междоменных запросов
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://movie-trailers-app.vercel.app"
  );

  // Пример обработки данных с метками времени
  const exampleResponse = {
    message: "Security headers applied!",
    createdAt: new Date().toISOString(), // Преобразуем метки времени в ISO-формат
    unixTimestamp, // Добавляем Unix метку времени
    nonce, // Отправляем nonce в ответ
  };

  // Ответ клиенту
  res.status(200).json(exampleResponse);
};
