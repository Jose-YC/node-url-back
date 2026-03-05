CREATE OR REPLACE PROCEDURE sp_CreateGroup(
    p_user_id INTEGER,
    p_group_name VARCHAR(30),
    p_group_description TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS (
        SELECT 1 FROM "group" WHERE name = p_group_name AND user_id = p_user_id AND deleted_at IS NULL
    ) THEN 
        RAISE EXCEPTION 'El nombre del grupo ya existe para este usuario y no puedes duplicarlo.';
    END IF;

    INSERT INTO "group" ("name", "description", "user_id", "updated_at") 
    VALUES (p_group_name, p_group_description, p_user_id, NOW());

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RAISE; 
END
$$;


CREATE OR REPLACE PROCEDURE sp_UpdateGroup(
    p_user_id INTEGER,
    p_group_id INTEGER,
    p_group_name VARCHAR(30) DEFAULT NULL,
    p_group_description TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM "group" WHERE id = p_group_id AND user_id = p_user_id AND deleted_at IS NULL
    ) THEN 
        RAISE EXCEPTION 'El grupo no existe para este usuario.';
    END IF;

    IF ( p_group_name IS NOT NULL ) THEN
        IF EXISTS (
            SELECT 1 FROM "group" 
            WHERE name = p_group_name AND user_id = p_user_id AND deleted_at IS NULL AND id != p_group_id
        ) THEN 
            RAISE EXCEPTION 'El nombre del grupo ya existe para este usuario y no puedes duplicarlo.';
        END IF;
    END IF;

    IF (p_group_name IS NOT NULL OR p_group_description IS NOT NULL ) THEN
        UPDATE "group"
        SET
            name = COALESCE(p_group_name, name),
            description = COALESCE(p_group_description, description),
            updated_at = NOW()
        WHERE id = p_group_id AND user_id = p_user_id AND deleted_at IS NULL;
    END IF;
   

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RAISE; 
END
$$;