import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    > div {
        margin: 0 auto;
    }
`

export default function () {
  return (
    <Container>
        <div className="la-ball-elastic-dots la-3x la-dark">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </Container>)
}