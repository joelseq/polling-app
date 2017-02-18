import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

import '../../../style.scss';

export default function Header() {
  return (
    <Navbar inverse>
      <Nav>
        <IndexLinkContainer to="/">
          <NavItem className="sp__brand" eventKey={0}>SimPoll</NavItem>
        </IndexLinkContainer>
      </Nav>
      <Nav pullRight>
        <LinkContainer to="create">
          <NavItem eventKey={1}>Create Poll</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>
  );
}
