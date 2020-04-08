import * as React from 'react';
import { Link } from "react-router-dom";
import { Card, Tag } from '@components/styled';
import { markedSource } from '@app/context';

export const TagsCard = markedSource((props) => {
  const { categoryByTag } = props;
  return (
    <Card>
        {Object.keys(categoryByTag).map(tag => (
          <Link key={tag} to={'/tags/' + tag}>
            <Tag>{ tag }</Tag>
          </Link>
      ))}
    </Card>);
})