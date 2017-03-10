import React from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

import '../../../style.scss';

export default function Header() {
  return (
    <Navbar inverse collapseOnSelect>
      <Nav>
        <IndexLinkContainer to="/">
          <NavItem id="sp__brand" eventKey={0}>SimPoll</NavItem>
        </IndexLinkContainer>
        <Navbar.Toggle />
      </Nav>
      <Navbar.Collapse>
        <Nav pullRight>
          <LinkContainer to="create">
            <NavItem id="sp__create-button" eventKey={1}>CREATE POLL</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
