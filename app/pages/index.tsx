import type { NextPage } from 'next'
import Table from '../components/Table'

import { headers, projects} from '../mock/projects'

const HomePage: NextPage = () => {
  return <Table headers={headers} data={projects}></Table>
}

export default HomePage
