import * as React from 'react';
import { Link } from "react-router-dom";
import { Synopsis } from '@components/styled';
import * as images from '@app/loadImages';

export function Introduction(props) {
  return (
    <Link to={'/' + props.namehash}>
      <Synopsis>
        <div className="note-title">
          <div>
            <p>{props.title}{props.date && <span>({props.date})</span>}</p>
            <p>{props.description}</p>
          </div>
          {props.image && props.image !== '' && <img src={images[props.image]} />}
        </div>
      </Synopsis>
    </Link>
  )
}

export function IntroductionList(props) {
  return props.dataSource.map(item => <Introduction key={item.namehash} {...item} />)
}