import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Link from 'next/link'

const Navigation = () => {
  return (
    <Navbar sticky="top" expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">db_class</Navbar.Brand>
        <Nav className="me-auto">
          <Link href="/entities" passHref>
            <Nav.Link>Entities</Nav.Link>
          </Link>
          {Array.apply(null, Array(8)).map((_, index) => (
            <Link key={index} href={`/queries/3.${index + 1}`} passHref>
              <Nav.Link>{`3.${index + 1}`}</Nav.Link>
            </Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Navigation
