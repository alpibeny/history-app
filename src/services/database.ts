import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'

export class DatabaseService {
  private static instance: DatabaseService | null = null
  private sqliteConnection: SQLiteConnection | null = null
  private dbConnection: SQLiteDBConnection | null = null
  private isDbInitialized = false

  private constructor() {
    this.sqliteConnection = new SQLiteConnection(CapacitorSQLite)
  }

  // Синглтон для единой точки доступа к БД во всем приложении (SRP)
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public async initialize(): Promise<void> {
    if (this.isDbInitialized) return

    try {
      const platform = Capacitor.getPlatform()
      
      // На мобилках используем нативный SQLite, на вебе плагин автоматически подменит на IndexedDB
      this.dbConnection = await this.sqliteConnection!.createConnection(
        'history_app_db',
        false,
        'no-encryption',
        1,
        false
      )

      await this.dbConnection.open()
      await this.createTables()
      
      this.isDbInitialized = true
      console.log('SQLite Database successfully initialized.')
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw error
    }
  }

  public getDb(): SQLiteDBConnection {
    if (!this.dbConnection) {
      throw new Error('Database connection is not established. Call initialize() first.')
    }
    return this.dbConnection
  }

  private async createTables(): Promise<void> {
    // Создаем структуру таблиц: категории, уроки и карточки FSRS
    const schema = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        order_index INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        category_id TEXT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        progress TEXT DEFAULT '0/10',
        status TEXT DEFAULT 'not_started',
        FOREIGN KEY(category_id) REFERENCES categories(id)
      );

      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        lesson_id TEXT,
        type TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        stability REAL DEFAULT 0.0,
        difficulty REAL DEFAULT 0.0,
        elapsed_days INTEGER DEFAULT 0,
        scheduled_days INTEGER DEFAULT 0,
        reps INTEGER DEFAULT 0,
        lapses INTEGER DEFAULT 0,
        state INTEGER DEFAULT 0,
        last_review TEXT,
        next_review TEXT,
        FOREIGN KEY(lesson_id) REFERENCES lessons(id)
      );
    `
    await this.dbConnection!.execute(schema)
  }
}
