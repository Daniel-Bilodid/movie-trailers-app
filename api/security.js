export default (req, res) => {
  // Устанавливаем заголовок Content Security Policy (CSP)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self';"
  );

  // Устанавливаем заголовок X-Frame-Options
  res.setHeader("X-Frame-Options", "DENY"); // или 'SAMEORIGIN'

  // Для других заголовков безопасности, например, защиты от XSS, можно добавлять дополнительные заголовки:
  res.setHeader("X-Content-Type-Options", "nosniff"); // Запрещает браузерам интерпретировать файлы как другой MIME-тип
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  ); // Использование только HTTPS

  // Вы можете добавить дополнительные заголовки для защиты по своему усмотрению.

  // Возвращаем ответ (это пример, обычно в функции будет другая логика)
  res.status(200).json({ message: "Security headers applied!" });
};
