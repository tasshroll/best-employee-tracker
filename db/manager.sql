-- m_fname & m_lname for e_fname & e_lname
UPDATE employee
SET manager_id = (
  SELECT id FROM employee
  WHERE first_name = 'Mike' AND last_name = 'Chan'
)
WHERE first_name = 'John' AND last_name = 'Doe';
