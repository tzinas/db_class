DROP TABLE IF EXISTS Organization;
DROP TABLE IF EXISTS Program;
DROP TABLE IF EXISTS Phone;
DROP TABLE IF EXISTS University;
DROP TABLE IF EXISTS Company;
DROP TABLE IF EXISTS Research_center;
DROP TABLE IF EXISTS Researcher;
DROP TABLE IF EXISTS Executive;
DROP TABLE IF EXISTS Project;
DROP TABLE IF EXISTS Deliverable;
DROP TABLE IF EXISTS Scientific_field;
DROP TABLE IF EXISTS Concerns;
DROP TABLE IF EXISTS Works_on;

CREATE TABLE Organization (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation VARCHAR(8),
  postal_code NUMERIC(5,0) CHECK (postal_code>0),
  city TEXT,
  street TEXT,
  street_number INT, CHECK (street_number>0)
);

CREATE TABLE Program (
  id SERIAL PRIMARY KEY,
  department TEXT NOT NULL,
  program_name TEXT NOT NULL
);

CREATE TABLE Phone(
  id SERIAL PRIMARY KEY, 
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE CASCADE ON UPDATE CASCADE,
  phone NUMERIC(10,0)
);

CREATE TABLE University(
  id SERIAL PRIMARY KEY, 
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE CASCADE ON UPDATE CASCADE,
  government_funding NUMERIC
);

CREATE TABLE Company(
  id SERIAL PRIMARY KEY, 
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE CASCADE ON UPDATE CASCADE,
  equity NUMERIC
);

CREATE TABLE Research_center(
  id SERIAL PRIMARY KEY,  
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE CASCADE ON UPDATE CASCADE,
  government_funding NUMERIC,
  private_equity NUMERIC
);

CREATE TABLE Researcher(
  id SERIAL PRIMARY KEY,
  sex TEXT CHECK(sex IN ('male', 'female')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE RESTRICT ON UPDATE CASCADE, 
  work_starting_day DATE
);

CREATE TABLE Executive(
  id SERIAL PRIMARY KEY, 
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE Project(
  id SERIAL PRIMARY KEY,
  project_title TEXT NOT NULL,
  description TEXT,
  funding_amount NUMERIC,
  starting_date DATE NOT NULL,
  ending_date DATE NOT NULL,
  program_id INT,
  FOREIGN KEY (program_id) REFERENCES Program(id) ON DELETE SET NULL ON UPDATE CASCADE,
  evaluator_id INT,
  FOREIGN KEY (evaluator_id) REFERENCES Researcher(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  supervisor_id INT,
  FOREIGN KEY (supervisor_id) REFERENCES Researcher(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  executive_id INT,
  FOREIGN KEY (executive_id) REFERENCES Executive(id) ON DELETE SET NULL ON UPDATE CASCADE,
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  evaluation_grade NUMERIC(4,2) CHECK (evaluation_grade BETWEEN 0 AND 10),
  evaluation_date DATE,
  CHECK (ending_date-starting_date BETWEEN 365 AND 1461)
);

CREATE TABLE Deliverable(
  id SERIAL PRIMARY KEY, 
  project_id INT,
  FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE ON UPDATE CASCADE,
  deliverable_title TEXT,
  description TEXT,
  delivery_date DATE
);

CREATE TABLE Scientific_field(
  id SERIAL PRIMARY KEY,
  field_name TEXT NOT NULL
);

CREATE TABLE Concerns(
  id SERIAL PRIMARY KEY, 
  scientific_id INT,
  project_id INT,
  FOREIGN KEY (scientific_id) REFERENCES Scientific_field(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Works_on(
  id SERIAL PRIMARY KEY, 
  researcher_id INT,
  project_id INT,
  FOREIGN KEY (researcher_id) REFERENCES Researcher(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE ON UPDATE CASCADE
);


