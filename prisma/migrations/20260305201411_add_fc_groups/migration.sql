CREATE OR REPLACE FUNCTION fc_ListGroups(
    p_user_id   INTEGER,
    p_page      INTEGER,
    p_limit     INTEGER,           
    p_search    TEXT DEFAULT NULL 
)
RETURNS TABLE (
    id          INTEGER,
    name        VARCHAR(100),
    description TEXT   
)
LANGUAGE sql
AS $$
    SELECT
        G.id,                   
        G.name,
        G.description
    FROM "group" AS G
    WHERE
        G.deleted_at IS NULL
        AND G.user_id = p_user_id
        AND ( 
            p_search IS NULL 
            OR G.name LIKE '%' || p_search || '%' 
        )
    GROUP BY G.id, G.name, G.description, G.created_at
    ORDER BY G.created_at DESC
    LIMIT  p_limit
    OFFSET (p_page - 1) * p_limit; 
$$;



CREATE OR REPLACE FUNCTION fc_CountListGroups(
   p_user_id   INTEGER,
   p_search    TEXT DEFAULT NULL
)
RETURNS INTEGER 
LANGUAGE sql
AS $$
	SELECT
	    COUNT(*) AS total
	FROM "group" AS G
	WHERE G.deleted_at IS NULL
	AND G.user_id = p_user_id
	AND ( 
        p_search IS NULL 
        OR G.name LIKE '%' || p_search || '%'
    )
$$;
