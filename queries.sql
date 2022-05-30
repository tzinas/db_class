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
/*scientific field by user */
WITH year_active_projects AS (
	SELECT id
	FROM Project
	WHERE ending_date>current_date AND starting_date<(current_date-365))
SELECT P.project_title, R.last_name, R.first_name
FROM Project P, Scientific_field S, Concerns C, Researcher R, Works_on W
WHERE S.id='1' AND S.id=C.scientific_id AND P.id=C.project_id AND (P.id IN (SELECT * FROM year_active_projects)) AND R.id=W.researcher_id AND W.project_id=P.id; 


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


/*3.8*/
SELECT R.last_name, R.first_name, Q.number_of_projects
FROM   Researcher R,	(SELECT R.id AS id, count(DISTINCT P.id) AS number_of_projects
			FROM Researcher R, Project P, Deliverable D, Works_on W
			WHERE R.id=W.researcher_id AND W.project_id=P.id AND (P.id NOT IN (SELECT project_id FROM Deliverable))
			GROUP BY R.id
			HAVING count(DISTINCT P.id) >= 5) AS Q
WHERE R.id=Q.id;




