import React from 'react'
import Container from 'react-bootstrap/Container';
import { Navbar } from 'react-bootstrap';
import { ConnectButton } from '@mysten/dapp-kit';
import { Link } from 'react-router-dom';
const Nav = () => {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <ConnectButton/>
          <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          <Link to="/login">Login</Link>
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Nav