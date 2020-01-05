SELECT user_id, email, first_name, last_name, password
FROM users
WHERE email = $1; 