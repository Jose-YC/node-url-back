CREATE OR REPLACE FUNCTION fc_ListUrl(
   p_page       INTEGER,
   p_limit        INTEGER,
   p_user_id	  INTEGER DEFAULT NULL,
   p_search     TEXT DEFAULT NULL,
   p_visibility BOOLEAN DEFAULT NULL,
   p_favorite BOOLEAN DEFAULT NULL,
   p_group_id   INTEGER DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    short_url TEXT,
    original_url TEXT,
    group_name TEXT,
    "isPublic" BOOLEAN,
    is_favorite BOOLEAN,
    statistic BOOLEAN
) 
LANGUAGE sql
AS $$
    SELECT 
        U.id,
        U.title,
        U.short_url,
        U.original_url,
        COALESCE(G.name, 'No group') AS group_name,
        U."isPublic",
        U."is_favorite",
        U."statistic"
    FROM url U
    LEFT JOIN "group" G
        ON U.group_id = G.id AND G.deleted_at IS NULL
    WHERE U.deleted_at IS NULL
        AND (p_user_id IS NULL OR U.user_id = p_user_id)
        AND (p_visibility IS NULL OR U."isPublic" = p_visibility)
        AND (p_group_id IS NULL OR U.group_id = p_group_id)
        AND (p_favorite IS NULL OR U."is_favorite" = p_favorite)
        AND (
            p_search IS NULL 
            OR U.original_url ILIKE '%' || p_search || '%'
            OR U.short_url ILIKE '%' || p_search || '%'
            OR U.title ILIKE '%' || p_search || '%'
            )
    ORDER BY U.created_at DESC
    LIMIT  p_limit
    OFFSET (p_page - 1) * p_limit;
$$;



CREATE OR REPLACE FUNCTION fc_CountListUrl(
   p_user_id	  INTEGER DEFAULT NULL,
   p_search     TEXT DEFAULT NULL,
   p_visibility BOOLEAN DEFAULT NULL,
   p_favorite BOOLEAN DEFAULT NULL,
   p_group_id   INTEGER DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE sql
AS $$
    SELECT 
        COUNT(U.id) AS Total
    FROM url U
    LEFT JOIN "group" G
        ON U.group_id = G.id AND G.deleted_at IS NULL
    WHERE U.deleted_at IS NULL
        AND (p_user_id IS NULL OR U.user_id = p_user_id)
        AND (p_visibility IS NULL OR U."isPublic" = p_visibility)
        AND (p_group_id IS NULL OR U.group_id = p_group_id)
        AND (p_favorite IS NULL OR U."is_favorite" = p_favorite)
        AND (
            p_search IS NULL 
            OR U.original_url ILIKE '%' || p_search || '%'
            OR U.short_url ILIKE '%' || p_search || '%'
            OR U.title ILIKE '%' || p_search || '%'
            )
$$;


CREATE OR REPLACE FUNCTION fc_UrlById(
   p_user_id   INTEGER,
   p_url_id    INTEGER
)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    short_url TEXT,
    original_url TEXT,
    group_id INTEGER,
    group_name TEXT,
    "isPublic" BOOLEAN,
    is_favorite BOOLEAN,
    statistic BOOLEAN
)  
LANGUAGE sql
AS $$
	SELECT
	    U.id,
        U.title,
        U.short_url,
        U.original_url,
        U.group_id,
        COALESCE(G.name, 'No group') AS group_name,
        U."isPublic",
        U."is_favorite",
        U."statistic"
	FROM "url" AS U
    LEFT JOIN "group" G ON U.group_id = G.id AND G.deleted_at IS NULL
	WHERE U.deleted_at IS NULL
	AND U.user_id = p_user_id
    AND U.id = p_url_id
$$;
