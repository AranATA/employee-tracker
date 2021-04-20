USE org_chart;

INSERT INTO departments (dept_name)
VALUES ("back_end"), ("dev_ops"), ("qa"), ("ux");

USE org_chart;

INSERT INTO roles (title, salary, dept_id)
VALUES ("backend_lead", 100, 1), ("developer", 85, 1), ("engineer", 80, 1), ("cloud_man", 90, 2), ("architect", 80, 2), ("admin", 75, 2), ("qa_lead", 100, 3), ("qa_analyst", 85, 3), ("tester", 75, 3), ("ux_lead", 100, 4), ("ux_designer", 85, 4), ("researcher", 75, 4);

USE org_chart;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Diana", "Peck", 1), ("Tomasa", "Lucas", 2, 1), ("Candida", "Dolan", 3, 1), ("Keitha", "Keyes", 3, 1), 

("Pratap", "Cardozo", 4), ("Shaw", "Fairbairn", 5, 2), ("Vikram", "Arreola", 6, 2), ("Ileana", "Blake", 6, 2), 

("Noemi", "Gallego", 7), ("Wiley", "Michelakis", 8, 3), ("Murdoch", "Ramsey", 9, 3), ("Mayur", "Basurto", 9, 3), 

("Patricia", "Parish", 10), ("Cano", "Rustici", 11, 4), ("Hakan", "Sayak", 12, 4), ("Leandra", "Shirazi", 12, 4);

