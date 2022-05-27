import React, {useEffect} from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Error from 'next/error'
import useSWR from 'swr'

import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Link from 'next/link'
import Spinner from 'react-bootstrap/Spinner'

import EditDeleteViewTable from 'components/EditDeleteViewTable'
import Navigation from 'components/Navigation'

const availableEntities: string[] = [
  'organization',
  'program',
  'phone',
  'university',
  'company',
  'research_center',
  'researcher',
  'executive',
  'project',
  'deliverable',
  'scientific_field',
  'concerns',
  'works_on'
]

const EntityNavbar = () => {
  return (
    <Navbar sticky="top" bg="light" variant="light">
      <Container>
        <Nav className="me-auto">
          {availableEntities.map(entity => (
            <Link key={entity} href={`/entities/${entity}`} passHref>
              <Nav.Link>{entity}</Nav.Link>
            </Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  )
}

const EntityPage: NextPage = () => {
  const router = useRouter()
  const { entity }: { entity?: string } = router.query

  const fetcher = async url => {
    const res = await fetch(url)

    if (!res.ok) {
      const error = {
        info: await res.json(),
        status: res.status
      }
      throw error
    }
    return res.json()
  }

  const fetchUrl = entity ? `/api/entities/${entity}`:null
  const { data, error, mutate, isValidating } = useSWR(fetchUrl, fetcher)

  if (error) return <div>failed to load: {error?.info?.err}</div>
  if (!data) return <Spinner style={{ margin: 'auto' }} animation="grow" />
  if (isValidating) return <Spinner style={{ margin: 'auto' }} animation="grow" />

  if (!availableEntities.includes(entity)) {
    return <Error statusCode={404}></Error>
  }

  console.log(data, error)
  return (
    <>
      <Navigation />
      <EntityNavbar />
      <div style={{width: '100%', height: '100%', flexGrow: 1, minHeight: '500px', display: 'flex'}}>
        <EditDeleteViewTable entity={entity} rows={data.rows} mutate={mutate}/>
      </div>
    </>
  )
}

export default EntityPage
