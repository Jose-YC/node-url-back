CREATE OR REPLACE FUNCTION fc_RegisterUser(
    p_user_email VARCHAR(100) DEFAULT NULL,
    p_user_name TEXT DEFAULT NULL,
    p_user_password TEXT DEFAULT NULL
)
RETURNS TABLE(user_id INTEGER, user_email VARCHAR, user_name TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM "user" WHERE email = p_user_email) THEN
        RAISE EXCEPTION 'El usuario a registrar ya existe.';
    END IF;

    INSERT INTO "user" ("email", "name", "password", "updated_at") 
    VALUES (p_user_email, p_user_name, p_user_password, NOW())
    RETURNING id INTO user_id;

    INSERT INTO user_role ("user_id", "role_id")
    VALUES (user_id, 1); -- Asignar el rol "user" por defecto (id = 1)

    user_email := p_user_email;
    user_name  := p_user_name;

    RETURN NEXT;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RAISE; 
END
$$;