import React from 'react'
import Container from 'react-bootstrap/Container';
import { Navbar } from 'react-bootstrap';
import { ConnectButton } from '@mysten/dapp-kit';
import { Link } from 'react-router-dom';
const Nav = () => {

    const styles = {
        navbar: {
          backgroundColor: "black", // Similar to bg-body-tertiary
          padding: "10px",
          width: "430px", // Set a fixed width
          margin: "0 auto", // Center the navbar horizontally
        //   borderRadius: "8px", // Optional: Add rounded corners
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Optional: Add a subtle shadow
        },
        connectButton: {
          marginRight: "10px",
          width:"150px"
        },
        justifyContentEnd: {
          display: "flex",
          justifyContent: "flex-end",
        },
        link: {
          textDecoration: "none",
          color: "#007bff", // Bootstrap link blue color
          marginLeft: "10px",
        },
      };
      return (
        <Navbar style={styles.navbar}>
          <Container>
            <ConnectButton style={styles.connectButton} />
            <Navbar.Collapse style={styles.justifyContentEnd}>
              <Navbar.Text>
                {/* <Link to="/login" style={styles.link}>
                  Login
                </Link> */}
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    };
    
    export default Nav;