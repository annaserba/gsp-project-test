import './StateCard.scss';

export function LoadingState() {
  return (
    <section className="state-card" aria-live="polite">
      <div className="state-card__pulse" />
      <div>
        <strong>Загружаем дашборд</strong>
        <p>Подтягиваем mock-данные через адаптер и собираем экран по вехам.</p>
      </div>
    </section>
  );
}

export function ErrorState() {
  return (
    <section className="state-card state-card--error" aria-live="polite">
      <div>
        <strong>Не удалось получить данные</strong>
        <p>Проверь адаптер или источник payload. Экран уже готов к подключению реального API вместо mock.</p>
      </div>
    </section>
  );
}
