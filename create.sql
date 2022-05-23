DROP TABLE IF EXISTS Organization;
DROP TABLE IF EXISTS Program;
DROP TABLE IF EXISTS Phone;
DROP TABLE IF EXISTS University;
DROP TABLE IF EXISTS Company;
DROP TABLE IF EXISTS Reesearch_center;
DROP TABLE IF EXISTS Researcher;
DROP TABLE IF EXISTS Exevutive;
DROP TABLE IF EXISTS Project;
DROP TABLE IF EXISTS Deliverable;
DROP TABLE IF EXISTS Scientific_field;
DROP TABLE IF EXISTS Concers;
DROP TABLE IF EXISTS Works_on;

CREATE TABLE Organization (
  organization_id SERIAL PRIMARY KEY,
  name TEXT,
  abbreviation VARCHAR(8),
  postal_code NUMERIC(5,0) CHECK (postal_code>0),
  city TEXT,
  street TEXT,
  street_number INT, CHECK (street_number>0)
);

CREATE TABLE Program (
  program_id SERIAL PRIMARY KEY,
  department TEXT NOT NULL,
  program_name TEXT NOT NULL
);

CREATE TABLE Phone(
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id) ON DELETE CASCADE ON UPDATE CASCADE,
  phone NUMERIC(10,0),
  PRIMARY KEY(organization_id, phone)
);

CREATE TABLE University(
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id) ON DELETE CASCADE ON UPDATE CASCADE,
  government_funding NUMERIC,
  PRIMARY KEY(organization_id)
);

CREATE TABLE Company(
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id) ON DELETE CASCADE ON UPDATE CASCADE,
  equity NUMERIC,
  PRIMARY KEY(organization_id)
);

CREATE TABLE Research_center(
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id) ON DELETE CASCADE ON UPDATE CASCADE,
  government_funding NUMERIC,
  private_equity NUMERIC,
  PRIMARY KEY(organization_id)
);

CREATE TABLE Researcher(
  researcher_id SERIAL PRIMARY KEY,
  sex TEXT CHECK(sex IN ('male', 'female')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id), 
  work_starting_day DATE
);

CREATE TABLE Executive(
  executive_id SERIAL PRIMARY KEY, 
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE Project(
  project_id SERIAL PRIMARY KEY,
  project_title TEXT,
  description TEXT,
  funding_amount NUMERIC,
  starting_date DATE,
  ending_date DATE,
  program_id INT,
  FOREIGN KEY (program_id) REFERENCES Program(program_id),
  evaluator_id INT,
  FOREIGN KEY (evaluator_id) REFERENCES Researcher(researcher_id),
  supervisor_id INT,
  FOREIGN KEY (supervisor_id) REFERENCES Researcher(researcher_id),
  executive_id INT,
  FOREIGN KEY (executive_id) REFERENCES Executive(executive_id),
  organization_id INT,
  FOREIGN KEY (organization_id) REFERENCES Organization(organization_id),
  evaluation_grade NUMERIC(4,2) CHECK (evaluation_grade BETWEEN 0 AND 10),
  evaluation_date DATE
  CHECK (ending_date-starting_date BETWEEN 365 AND 1461)
);

CREATE TABLE Deliverable(
  project_id INT,
  FOREIGN KEY (project_id) REFERENCES Project(project_id),
  deliverable_title TEXT,
  description TEXT,
  delivery_date DATE,
  PRIMARY KEY(project_id, deliverable_title)
);

CREATE TABLE Scientific_field(
  scientific_id SERIAL PRIMARY KEY,
  field_name TEXT
);

CREATE TABLE Concerns(
  scientific_id INT,
  project_id INT,
  FOREIGN KEY (scientific_id) REFERENCES Scientific_field(scientific_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (scientific_id, project_id)
);

CREATE TABLE Works_on(
  researcher_id INT,
  project_id INT,
  FOREIGN KEY (researcher_id) REFERENCES Researcher(researcher_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY(researcher_id, project_id)
);


