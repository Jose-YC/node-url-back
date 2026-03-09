CREATE OR REPLACE PROCEDURE sp_CreateUrl(
    p_group_id INTEGER,
    p_url_original TEXT,
    p_url_short VARCHAR(30),
    p_user_id INTEGER DEFAULT NULL,
    p_url_public BOOLEAN DEFAULT TRUE,
    p_url_favorite BOOLEAN DEFAULT FALSE,
    p_url_statistic BOOLEAN DEFAULT FALSE,
    p_url_title VARCHAR(30) DEFAULT NULL,
    p_url_password TEXT DEFAULT NULL,
    p_url_expires_at BOOLEAN DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO "url" ("original_url", "short_url", "isPublic", "is_favorite", "statistic", "title", "password", "user_id", "group_id", "expires_at", "updated_at") 
    VALUES (
        p_url_original,
        p_url_short,
        COALESCE(p_url_public, TRUE),      -- si llega NULL, usa TRUE
        COALESCE(p_url_favorite, FALSE),   -- si llega NULL, usa FALSE
        COALESCE(p_url_statistic, FALSE),  -- si llega NULL, usa FALSE
        p_url_title,
        p_url_password,
        p_user_id,
        p_group_id,
        CASE 
            WHEN p_url_expires_at = TRUE THEN NOW() + INTERVAL '15 days'
            ELSE NULL
        END,
        NOW()
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RAISE; 
END
$$;


CREATE OR REPLACE PROCEDURE sp_UpdateUrl(
    p_url_id INTEGER,
    p_user_id INTEGER,
    p_url_original TEXT,
    p_group_id INTEGER DEFAULT NULL,
    p_url_public BOOLEAN DEFAULT NULL,
    p_url_statistic BOOLEAN DEFAULT NULL,
    p_url_title VARCHAR(30) DEFAULT NULL,
    p_url_password TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM "url" WHERE id = p_url_id AND user_id = p_user_id AND deleted_at IS NULL
    ) THEN 
        RAISE EXCEPTION 'La URL acortada no existe para este usuario.';
    END IF;

    IF ( p_url_original IS NOT NULL OR p_group_id IS NOT NULL OR p_url_public IS NOT NULL OR p_url_statistic IS NOT NULL OR p_url_title IS NOT NULL OR p_url_password IS NOT NULL ) THEN
        UPDATE "url"
        SET
            original_url = COALESCE(p_url_original, original_url),
            group_id = COALESCE(p_group_id, group_id),
            "isPublic" = COALESCE(p_url_public, "isPublic"),
            statistic = COALESCE(p_url_statistic, statistic),
            title = COALESCE(p_url_title, title),
            password = COALESCE(p_url_password, password),
            updated_at = NOW()
        WHERE id = p_url_id AND user_id = p_user_id AND deleted_at IS NULL;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RAISE; 
END
$$;