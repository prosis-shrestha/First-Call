import React from 'react'
import styled from 'styled-components'


const Button = styled.button`
    min-width: 16rem;
    background: #FC5C5E ;
    border-radius: 24px;
    border: 3px solid #FC5C5E;
    color: white;
    margin-top: 2rem;
    padding: 1rem 2rem;
    cursor:pointer;
    font-weight: semi-bold;
    font-size: larger;
    letter-spacing: 2px;
    transition: background 0.3s ease;
    &:hover {
      background: transparent;
    }
  `;

export default Button