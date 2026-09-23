import { DatabaseService } from '../services/database'

// Строгая типизация объекта урока для всего приложения
export interface Lesson {
  id: number
  categoryId: string
  title: string
  content: string
  orderIndex: number
  progress: string
  status: string
}

export class LessonRepository {
  private dbService: DatabaseService

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }

  /**
   * Получить список всех уроков для отображения в нашей карусели на главном экране
   */
  public async getLessonsForCarousel(): Promise<Lesson[]> {
    const db = this.dbService.getDb()
    
    // Делаем SQL-запрос на выборку уроков, отсортированных по их порядку
    const result = await db.query('SELECT * FROM lessons ORDER BY order_index ASC;')
    
    if (!result.values || result.values.length === 0) {
      // Если база пустая, временно вернем стартовые данные, чтобы приложение не падало
      return []
    }

    // Переводим snake_case из базы данных в camelCase для TypeScript
    return result.values.map((row: any) => ({
      id: Number(row.id),
      categoryId: row.category_id,
      title: row.title,
      content: row.content,
      orderIndex: row.order_index,
      progress: row.progress || '0/10',
      status: row.status || 'not_started'
    }))
  }

  /**
   * Получить полную информацию об одном уроке по его ID (для экрана чтения урока)
   */
  public async getLessonById(id: number): Promise<Lesson | null> {
    const db = this.dbService.getDb()
    const result = await db.query('SELECT * FROM lessons WHERE id = ? LIMIT 1;', [id.toString()])

    if (!result.values || result.values.length === 0) {
      return null
    }

    const row = result.values[0]
    return {
      id: Number(row.id),
      categoryId: row.category_id,
      title: row.title,
      content: row.content,
      orderIndex: row.order_index,
      progress: row.progress,
      status: row.status
    }
  }

  /**
   * Обновить прогресс и статус урока (например, когда пользователь прошел тренажер)
   */
  public async updateLessonProgress(id: number, progress: string, status: string): Promise<void> {
    const db = this.dbService.getDb()
    await db.run(
      'UPDATE lessons SET progress = ?, status = ? WHERE id = ?;',
      [progress, status, id.toString()]
    )
  }

  /**
   * Метод для первичного наполнения базы данных (Seed данных)
   * Вызовется один раз при самом первом запуске приложения, чтобы залить стартовые уроки
   */
  public async seedInitialLessons(initialLessons: Omit<Lesson, 'progress' | 'status'>[]): Promise<void> {
    const db = this.dbService.getDb()
    
    // Проверяем, есть ли уже уроки в базе, чтобы не дублировать их
    const check = await db.query('SELECT COUNT(*) as count FROM lessons;')
    if (check.values && check.values[0].count > 0) return

    // Вставляем стартовые уроки в транзакции для максимальной скорости (критично для мобилок)
    await db.execute('BEGIN TRANSACTION;')
    try {
      for (const lesson of initialLessons) {
        await db.run(
          'INSERT INTO lessons (id, category_id, title, content, order_index) VALUES (?, ?, ?, ?, ?);',
          [lesson.id.toString(), lesson.categoryId, lesson.title, lesson.content, lesson.orderIndex.toString()]
        )
      }
      await db.execute('COMMIT;')
      console.log(`Successfully seeded ${initialLessons.length} starter lessons.`);
    } catch (error) {
      await db.execute('ROLLBACK;')
      console.error('Failed to seed initial lessons:', error)
    }
  }
}
