-- Populate the 'department' table
INSERT INTO department (name)
VALUES 
('Engineering'),
('Human Resources'),
('Sales'),
('Marketing'),
('Finance'),
('IT'),
('Customer Support'),
('Research and Development'),
('Operations'),
('Legal');

-- Populate the 'role' table
INSERT INTO role (title, salary, department_id)
VALUES 
('Software Engineer', 70000, 1),
('HR Manager', 65000, 2),
('Sales Representative', 55000, 3),
('Marketing Coordinator', 60000, 4),
('Financial Analyst', 68000, 5),
('System Administrator', 72000, 6),
('Customer Support Specialist', 50000, 7),
('R&D Scientist', 75000, 8),
('Operations Manager', 78000, 9),
('Legal Advisor', 83000, 10);

-- Populate the 'employee' table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Emily', 'Johnson', 3, 1),
('Michael', 'Brown', 4, 1),
('Alice', 'Davis', 5, NULL),
('Bob', 'Miller', 6, 5),
('Chloe', 'Wilson', 7, 5),
('David', 'Moore', 8, NULL),
('Emma', 'Taylor', 9, 8),
('Nathan', 'Anderson', 10, 8),
('Olivia', 'Thomas', 1, 1),
('Ethan', 'Jackson', 2, 1),
('Mia', 'White', 3, 1),
('Alexander', 'Harris', 4, 1),
('Sophia', 'Martin', 5, 5),
('William', 'Thompson', 6, 5),
('Isabella', 'Garcia', 7, 5),
('Jacob', 'Martinez', 8, 8),
('Ava', 'Robinson', 9, 8),
('James', 'Clark', 10, 8);
