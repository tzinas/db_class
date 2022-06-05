export const hidden = ['id']

export const selectable = {
  organization_id: {title: 'Organization', entity: 'organization', columns: ['name']},
  program_id: {title: 'Program', entity: 'program', columns: ['program_name']},
  evaluator_id: {title: 'Evaluator', label: 'evaluator_id', entity: 'researcher', columns: ['first_name', 'last_name']},
  supervisor_id: {title: 'Supervisor', label: 'supervisor_id', entity: 'researcher', columns: ['first_name', 'last_name']},
  executive_id: {title: 'Executive', label: 'executive_id', entity: 'researcher', columns: ['first_name', 'last_name']},
  project_id: {title: 'Project', label: 'project_id', entity: 'project', columns: ['project_title']},
  scientific_id: {title: 'Scientific Field', label: 'scientific_id', entity: 'scientific_field', columns: ['field_name']},
  researcher_id: {title: 'Researcher', label: 'researcher_id', entity: 'researcher', columns: ['first_name', 'last_name']}
}
