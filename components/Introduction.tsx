import * as React from 'react';
import { Link } from "react-router-dom"
import { Synopsis } from '@components/styled';
import * as images from '@app/loadImages';

export function Introduction(props) {
  return (
    <Link to={'/' + props.namehash}>
      <Synopsis>
        <div className="note-title">
          {props.image && props.image !== '' && <img src={images[props.image]} />}
          <p>{props.title}</p>
          <p>{props.description}</p>
        </div>
      </Synopsis>
    </Link>
  )
}

export function IntroductionList(props) {
  return props.dataSource.map(item => <Introduction key={item.namehash} {...item} />)
}