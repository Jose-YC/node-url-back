import { AsyncLocalStorage } from 'async_hooks';
import { UserPermissions } from '../../modules/user/dto';

class UserContextManager {
  private static instance: UserContextManager;
  private asyncLocalStorage: AsyncLocalStorage<UserPermissions>;

  private constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage<UserPermissions>();
  }

  public static getInstance(): UserContextManager {
    if (!UserContextManager.instance) {
      UserContextManager.instance = new UserContextManager();
    }
    return UserContextManager.instance;
  }

  public run<T>(context: UserPermissions, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  public getContext(): UserPermissions | null {
    const context = this.asyncLocalStorage.getStore();
    return context ?? null;
  }

  public hasContext(): boolean {
    return this.getContext() !== null;
  }

  public getUserId(): number | null {
    const context = this.getContext();
    return context?.id ?? null;
  }

  public getValue<K extends keyof UserPermissions>(key: K): UserPermissions[K] | undefined {
    const context = this.getContext();
    return context?.[key] ?? undefined;
  }
}

// Exportar instancia única para usar en toda la aplicación
export const userContextManager = UserContextManager.getInstance();
