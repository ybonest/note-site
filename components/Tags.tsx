import * as React from 'react';
import { Link } from "react-router-dom";
import { Card, Tag } from '@components/styled';
import { markedSource } from '@app/context';

const colorsMap = [{
  backgroundColor: '#8080c0',
  color: ''
},{
  backgroundColor: '#e8d098',
  color: ''
},{
  backgroundColor: '#336699',
  color: ''
},{
  backgroundColor: '#b45b3e',
  color: ''
},{
  backgroundColor: '#66cccc',
  color: ''
},{
  backgroundColor: '#00b271',
  color: ''
},{
  backgroundColor: '#d7fff0',
  color: ''
},{
  backgroundColor: '#479ac7',
  color: ''
},{
  backgroundColor: '#f0dad2',
  color: ''
}]

export const TagsCard = markedSource((props) => {
  const { categoryByTag } = props;
  return (
    <Card>
        {Object.keys(categoryByTag).map(tag => {
          const colors = colorsMap[0];
          colorsMap.push(colorsMap.shift());
          console.log(colors, colorsMap.length, ":::::::")
          return (
            <Tag {...colors}>
              <Link key={tag} to={'/tags/' + tag}>
                { tag }
              </Link>
            </Tag>
          );
        })}
    </Card>);
})