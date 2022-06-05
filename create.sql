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

CREATE TYPE ORG AS ENUM ('University', 'Company', 'Research center');

CREATE TABLE Organization (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation VARCHAR(8),
  postal_code NUMERIC(5,0) CHECK (postal_code>0),
  city TEXT,
  street TEXT,
  street_number INT, CHECK (street_number>0),
  organization_type ORG NOT NULL
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
  phone NUMERIC(10,0) UNIQUE
);

CREATE TABLE University(
  id SERIAL PRIMARY KEY, 
  organization_id INT UNIQUE,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE CASCADE ON UPDATE CASCADE,
  government_funding NUMERIC
);

CREATE TABLE Company(
  id SERIAL PRIMARY KEY, 
  organization_id INT UNIQUE,
  FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE CASCADE ON UPDATE CASCADE,
  equity NUMERIC
);

CREATE TABLE Research_center(
  id SERIAL PRIMARY KEY,  
  organization_id INT UNIQUE,
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
  duration NUMERIC GENERATED ALWAYS AS (ROUND(CAST(ending_date - starting_date AS DECIMAL) / 365)) STORED,
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
  CHECK (ending_date > starting_date),
  CHECK (duration BETWEEN 1 AND 4),
  CHECK (evaluation_date < starting_date),
  CHECK (funding_amount BETWEEN 100000 AND 1000000)
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


CREATE OR REPLACE FUNCTION create_org_type() RETURNS TRIGGER AS $Org_type_insert$
BEGIN
  IF (NEW.organization_type = 'University') THEN
    INSERT INTO University(organization_id) values (NEW.id);
  ELSIF (NEW.organization_type = 'Company') THEN
    INSERT INTO Company(organization_id) values (NEW.id);
  ELSIF (NEW.organization_type = 'Research center') THEN
    INSERT INTO Research_center(organization_id) values (NEW.id);
  END IF;
  RETURN NEW;
END;
$Org_type_insert$ LANGUAGE plpgsql;

CREATE TRIGGER Org_type_insert AFTER INSERT ON Organization 
FOR EACH ROW 
EXECUTE FUNCTION create_org_type();


CREATE RULE delete_protect1 AS ON DELETE TO University DO INSTEAD NOTHING;
CREATE RULE delete_protect2 AS ON DELETE TO Company DO INSTEAD NOTHING;
CREATE RULE delete_protect3 AS ON DELETE TO Research_center DO INSTEAD NOTHING;


CREATE FUNCTION update_org_type() RETURNS TRIGGER AS $Org_type_update$
BEGIN
  IF (NEW.organization_id <> OLD.organization_id) THEN 
    RAISE EXCEPTION 'Cannot update';
  END IF;
  RETURN NEW;
END;
$Org_type_update$ LANGUAGE plpgsql;

CREATE TRIGGER Org_type_update BEFORE UPDATE ON University
FOR EACH ROW 
EXECUTE FUNCTION update_org_type();

CREATE TRIGGER Org_type_update BEFORE UPDATE ON Company
FOR EACH ROW 
EXECUTE FUNCTION update_org_type();

CREATE TRIGGER Org_type_update BEFORE UPDATE ON Research_center
FOR EACH ROW 
EXECUTE FUNCTION update_org_type();


CREATE FUNCTION Check_works_on() RETURNS TRIGGER AS $Check_works_on$
BEGIN
  IF ((SELECT work_starting_day FROM Researcher WHERE id=NEW.researcher_id)>=(SELECT ending_date FROM Project WHERE id=NEW.project_id)) OR
  ((SELECT organization_id FROM Researcher WHERE id=NEW.researcher_id)<>(SELECT organization_id FROM Project WHERE id=NEW.project_id))  THEN
    RAISE EXCEPTION 'Invalid relation';
  END IF;
  RETURN NEW;
END;
$Check_works_on$ LANGUAGE plpgsql;

CREATE TRIGGER Check_works_on BEFORE INSERT OR UPDATE ON Works_on
FOR EACH ROW 
EXECUTE FUNCTION check_works_on();


CREATE FUNCTION check_dates() RETURNS TRIGGER AS $Del_date$ 
BEGIN
  IF ((NEW.delivery_date<(SELECT starting_date FROM Project WHERE id=NEW.project_id)) OR 
  (NEW.delivery_date>(SELECT ending_date FROM Project WHERE id=NEW.project_id))) THEN 
    RAISE EXCEPTION 'Invalid date';
  END IF;
  RETURN NEW;
END;
$Del_date$ LANGUAGE plpgsql;

CREATE TRIGGER Del_date BEFORE INSERT OR UPDATE ON Deliverable
FOR EACH ROW
EXECUTE FUNCTION check_dates();


CREATE FUNCTION check_supervisor() RETURNS TRIGGER AS $Supervisor_in_org$
BEGIN
  IF (NEW.organization_id<>(SELECT organization_id FROM Researcher WHERE id=NEW.supervisor_id)) THEN
    RAISE EXCEPTION 'Invalid relation';
  END IF;
  RETURN NEW;
END;
$Supervisor_in_org$ LANGUAGE plpgsql;

CREATE TRIGGER Supervisor_in_org BEFORE INSERT OR UPDATE ON Project
FOR EACH ROW
EXECUTE FUNCTION check_supervisor();


CREATE FUNCTION check_evaluator() RETURNS TRIGGER AS $Evaluator_in_org$
BEGIN
  IF (NEW.organization_id=(SELECT organization_id FROM Researcher WHERE id=NEW.evaluator_id)) THEN
    RAISE EXCEPTION 'Invalid relation';
  END IF;
  RETURN NEW;
END;
$Evaluator_in_org$ LANGUAGE plpgsql;

CREATE TRIGGER Evaluator_in_org BEFORE INSERT OR UPDATE ON Project
FOR EACH ROW
EXECUTE FUNCTION check_evaluator();

CREATE FUNCTION update_org_id() RETURNS TRIGGER AS $Res_org_id_update$
BEGIN
  IF (NEW.organization_id <> OLD.organization_id) THEN 
    RAISE EXCEPTION 'Cannot update';
  END IF;
  RETURN NEW;
END;
$Res_org_id_update$ LANGUAGE plpgsql;

CREATE TRIGGER Res_org_id_update BEFORE UPDATE ON Researcher
FOR EACH ROW 
EXECUTE FUNCTION update_org_id();

CREATE FUNCTION update_org_id() RETURNS TRIGGER AS $Res_org_id_update$
BEGIN
  IF (NEW.organization_id <> OLD.organization_id) THEN 
    RAISE EXCEPTION 'Cannot update';
  END IF;
  RETURN NEW;
END;
$Res_org_id_update$ LANGUAGE plpgsql;

CREATE TRIGGER Res_org_id_update BEFORE UPDATE ON Researcher
FOR EACH ROW 

CREATE FUNCTION no_update_org_type() RETURNS TRIGGER AS $No_org_type_update$
BEGIN
  IF (NEW.organization_type <> OLD.organization_type) THEN 
    RAISE EXCEPTION 'Cannot update';
  END IF;
  RETURN NEW;
END;
$No_org_type_update$ LANGUAGE plpgsql;

CREATE TRIGGER No_org_type_update BEFORE UPDATE ON Organization
FOR EACH ROW 
EXECUTE FUNCTION no_update_org_type();

/* views from 3.2 */
CREATE VIEW researchers_projects AS
	SELECT R.last_name, R.first_name, P.project_title
	FROM Researcher R, Project P, Works_on W
	WHERE R.id=W.researcher_id AND W.project_id=P.id
	ORDER BY (R.last_name, R.first_name);

CREATE VIEW projects_per_rescenter AS
	SELECT O.name, count(*) as number_of_projects
	FROM Organization O, Project P, Research_center R
	WHERE O.id=P.organization_id AND O.id=R.organization_id
	GROUP BY O.name;