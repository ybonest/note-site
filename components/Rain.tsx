import * as React from 'react';
import { rain } from '@plug/rain';
import styled from 'styled-components';

const canvasRef = React.createRef<HTMLCanvasElement>();

const CanvasPanel = styled.canvas`
  width: 100% !important;
  height: 100% !important;
  margin-top: 0px !important;
  background:url('../static/maxresdefault.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  z-index: -1;
`

export default function Rain() {
  React.useEffect(() => {
    rain(canvasRef.current)
  }, [])
  return <CanvasPanel ref={canvasRef} />
}