import { DatabaseService } from '../services/database'

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
  
  // Хранилище в оперативной памяти исключительно для тестирования в Веб-Браузере
  private mockLessons: Lesson[] = [
    { id: 1, categoryId: 'section_1', title: 'Эволюция общества и экономики в древности.', content: 'Контент 1...', orderIndex: 1, progress: '10/10', status: 'completed' },
    { id: 2, categoryId: 'section_1', title: 'Эволюция общества и экономики в древности.', content: 'Контент 2...', orderIndex: 2, progress: '2/10', status: 'in_progress' },
    { id: 3, categoryId: 'section_1', title: 'Эволюция общества и экономики в древности.', content: 'Контент 3...', orderIndex: 3, progress: '0/10', status: 'not_started' }
  ]

  constructor() {
    this.dbService = DatabaseService.getInstance()
  }

  public async getLessonsForCarousel(): Promise<Lesson[]> {
    if (this.dbService.checkIsWeb()) {
      return this.mockLessons // В браузере мгновенно отдаем тестовые данные
    }

    // На смарфтоне тянем из реального SQLite
    const db = this.dbService.getDb()
    const result = await db.query('SELECT * FROM lessons ORDER BY order_index ASC;')
    
    if (!result.values || result.values.length === 0) return []

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

  public async getLessonById(id: number): Promise<Lesson | null> {
    if (this.dbService.checkIsWeb()) {
      return this.mockLessons.find(l => l.id === id) || null
    }

    const db = this.dbService.getDb()
    const result = await db.query('SELECT * FROM lessons WHERE id = ? LIMIT 1;', [id.toString()])

    if (!result.values || result.values.length === 0) return null

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

  public async updateLessonProgress(id: number, progress: string, status: string): Promise<void> {
    if (this.dbService.checkIsWeb()) {
      const lesson = this.mockLessons.find(l => l.id === id)
      if (lesson) {
        lesson.progress = progress
        lesson.status = status
      }
      return
    }

    const db = this.dbService.getDb()
    await db.run(
      'UPDATE lessons SET progress = ?, status = ? WHERE id = ?;',
      [progress, status, id.toString()]
    )
  }

  public async seedInitialLessons(initialLessons: Omit<Lesson, 'progress' | 'status'>[]): Promise<void> {
    if (this.dbService.checkIsWeb()) return // В браузере сидинг не нужен

    const db = this.dbService.getDb()
    const check = await db.query('SELECT COUNT(*) as count FROM lessons;')
    if (check.values && check.values[0].count > 0) return

    await db.execute('BEGIN TRANSACTION;')
    try {
      for (const lesson of initialLessons) {
        await db.run(
          'INSERT INTO lessons (id, category_id, title, content, order_index) VALUES (?, ?, ?, ?, ?);',
          [lesson.id.toString(), lesson.categoryId, lesson.title, lesson.content, lesson.orderIndex.toString()]
        )
      }
      await db.execute('COMMIT;')
    } catch (error) {
      await db.execute('ROLLBACK;')
      console.error('Failed to seed initial lessons:', error)
    }
  }
}
