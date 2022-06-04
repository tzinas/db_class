/* 3.1 */
/*projects per program*/
/*starting_date, duration, executive_id by user (in ui code)*/
SELECT PG.name, PJ.name
FROM Program PG, Project PJ
WHERE PJ.program_id=PG.id AND PJ.starting_date='2022-01-01' AND PJ.duration='1' AND PJ.executive_id='1'
ORDER BY PG.name, PJ.name

/*researchers per project*/
SELECT P.project_title, R.last_name, R.first_name
FROM Project P, Researcher R, Works_on
WHERE W.project_id=P.id AND W.researcher_id=R.id 
ORDER BY P.project_title, R.last_name, R.first_name

/* 3.2 */
CREATE VIEW researchers_projects AS
	SELECT R.last_name, R.first_name, P.project_title
	FROM Researcher R, Project P, Works_on W
	WHERE R.id=W.researcher_id AND W.project_id=P.id
	ORDER BY (R.last_name, R.first_name);

CREATE VIEW projects_per_rescenter AS
	SELECT O.name, count(*) as number_of_projects
	FROM Organization O, Project P, Research_center R
	WHERE O.id=P.organization_id AND O.id=R.organization_id
	GROUP BY O.name 


/* 3.3 */
/*scientific field by user (in ui code)*/
WITH year_active_projects AS (
	SELECT id
	FROM Project
	WHERE ending_date>current_date AND starting_date<(current_date-365))
SELECT P.project_title, R.last_name, R.first_name
FROM Project P, Scientific_field S, Concerns C, Researcher R, Works_on W
WHERE S.id='1' AND S.id=C.scientific_id AND P.id=C.project_id AND (P.id IN (SELECT * FROM year_active_projects)) AND R.id=W.researcher_id AND W.project_id=P.id; 

/* 3.4 */
WITH Q AS (
	SELECT O.id as org_id, EXTRACT (YEAR FROM P.starting_date) as year, count(*) AS number_of_projects
	FROM Organization O, Project P
	WHERE P.organization_id=O.id 
	GROUP BY O.id, year
)
SELECT DISTINCT O.name, least(Q1.year, Q2.year) AS year1, greatest(Q1.year, Q2.year) AS year2, Q1.number_of_projects
FROM Q AS Q1, Q AS Q2, Organization O
WHERE O.id=Q1.org_id AND Q1.org_id=Q2.org_id AND Q1.number_of_projects=Q2.number_of_projects AND ((Q1.year=Q2.year-1) OR (Q2.year=Q1.year-1)) AND Q1.number_of_projects>=10
ORDER BY O.name

/* 3.5 */
WITH Q AS (
	SELECT C1.scientific_id as id1, C2.scientific_id as id2, C1.project_id
	FROM Concerns C1, Concerns C2
	WHERE C1.project_id=C2.project_id AND C1.scientific_id<>C2.scientific_id)
SELECT S1.field_name, S2.field_name
FROM 	(SELECT DISTINCT least(sid1, sid2) AS sid1, greatest(sid1, sid2) AS sid2, allmax.times
	FROM 	(SELECT Q.id1 as sid1, Q.id2 as sid2, count(*) as times
		FROM Q
		GROUP BY (Q.id1, Q.id2)) AS allmax ORDER BY allmax.times DESC) AS F, Scientific_field S1, Scientific_field S2
WHERE S2.id=F.sid2 AND S1.id=F.sid1
LIMIT 3;
	
	
/* 3.6 */
WITH active_projects AS (
	SELECT id
	FROM Project
	WHERE ending_date>current_date),
	
	young_researchers AS (
	SELECT R.id as ID, R.last_name, R.first_name, count(*) as numberofprojects
	FROM Researcher R, Project P, Works_on W
	WHERE R.id=W.researcher_id AND W.project_id=P.id AND (P.id IN (SELECT * FROM active_projects)) AND current_date-R.date_of_birth<14600 
	GROUP BY R.id)
(SELECT R.last_name, R.first_name, Q.numberofprojects
FROM Researcher R, young_researchers Q
WHERE R.id=Q.ID)
EXCEPT
(SELECT R.last_name, R.first_name, Q1.numberofprojects
FROM Researcher R, young_researchers Q1, young_researchers Q2
WHERE Q1.numberofprojects < Q2.numberofprojects AND R.id=Q1.ID);

/* 3.7 */
SELECT E.last_name, E.first_name, O.name, Q.sum
FROM	(SELECT DISTINCT ON (E.id) E.id AS ex_id, C.id AS comp_id, sum(P.funding_amount)
		FROM Executive E, Company C, Project P
		WHERE E.id=P.executive_id AND P.organization_id=C.organization_id
		GROUP BY E.id, C.id
		ORDER BY E.id, sum DESC) AS Q, Executive E, Organization O
WHERE E.id=Q.ex_id AND O.id=(SELECT organization_id FROM Company WHERE id=Q.comp_id)
ORDER BY Q.sum DESC
LIMIT 5;

/* 3.8 */
SELECT R.last_name, R.first_name, Q.number_of_projects
FROM   Researcher R,	(SELECT R.id AS id, count(DISTINCT P.id) AS number_of_projects
			FROM Researcher R, Project P, Deliverable D, Works_on W
			WHERE R.id=W.researcher_id AND W.project_id=P.id AND (P.id NOT IN (SELECT project_id FROM Deliverable))
			GROUP BY R.id
			HAVING count(DISTINCT P.id) >= 5) AS Q
WHERE R.id=Q.id;




