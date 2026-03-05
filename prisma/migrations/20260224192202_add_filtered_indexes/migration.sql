-- This is an empty migration.

-- Índices para user
CREATE INDEX idx_users_email ON "user"(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_deleted_at ON "user"(deleted_at);

-- Índices para permission
CREATE INDEX idx_permissions_name ON "permission"(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_permissions_module ON "permission"(module) WHERE deleted_at IS NULL;
CREATE INDEX idx_permissions_deleted_at ON "permission"(deleted_at);

-- Índices para role
CREATE INDEX idx_roles_name ON "role"(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_deleted_at ON "role"(deleted_at);

-- Índices para user_role
CREATE INDEX idx_user_roles_user_id ON "user_role"(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_roles_role_id ON "user_role"(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_roles_deleted_at ON "user_role"(deleted_at);

-- Índices para role_permission
CREATE INDEX idx_role_permissions_role_id ON "role_permission"(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_role_permissions_permission_id ON "role_permission"(permission_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_role_permissions_deleted_at ON "role_permission"(deleted_at);