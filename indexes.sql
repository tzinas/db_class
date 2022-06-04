CREATE INDEX works_res_idx ON Works_on(researcher_id)
CREATE INDEX works_proj_idx ON Works_on(project_id)
CREATE INDEX proj_org_idx ON Project(organization_id)
CREATE INDEX conc_proj_idx ON Concerns(project_id)
