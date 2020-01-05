SELECT r.role_id, r.name, r.description
FROM roles r
JOIN user_roles ur ON ur.role_id = r.role_id
WHERE ur.user_id = $1;