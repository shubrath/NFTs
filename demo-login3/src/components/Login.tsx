import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert ,Card, Toast} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { ToastContainer,toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
    } else {
      toast.success("successfull")
    }

  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <ToastContainer />
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleSubmit} className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login