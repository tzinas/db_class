import type { NextPage } from 'next'
import Table from 'components/Table'
import Navigation from 'components/Navigation'

import { headers, projects} from 'mock/projects'

const HomePage: NextPage = () => {

  return (
    <>
      <Navigation />
      <Table headers={headers} data={projects}></Table>
    </>
  )
}

export default HomePage
