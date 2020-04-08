import * as React from 'react';
import { Link } from "react-router-dom"
import styled from 'styled-components';
import { default as AntdTree } from 'antd/es/tree';
import { CarryOutOutlined  } from '@ant-design/icons';
import { MarkedContext } from '@app/context';

interface TreeProps {
  tag: string;
  selectKey: string;
}

interface Item {
  title?: string;
  description?: string;
  image?: any;
  tag?: string;
  namehash?: string;
  name?: string;
  group?: string;
}

const TreeAliasName: any = styled(AntdTree)`
  min-width: 260px;
  border-right: 1px solid #e6e4e4;
  display: block;
  padding: 10px;
  @media (max-width: 1000px) {
    display: none;
  }
`

function createTitle({title, namehash}: Item) {
  return <Link to={'/' + namehash}>{title}</Link>
}

function buildTreeData(list: Item[], tag) {
  const rootTree = { title: tag, key: tag, icon:  <CarryOutOutlined />, children: [] };
  const grops = {};
  for (const item of list) {
    if (item.group) {
      if (grops[item.group]) {
        grops[item.group].push({
          title: createTitle(item),
          key: item.namehash,
        });
      } else {
        grops[item.group] = [{
          title: createTitle(item),
          key: item.title,
        }];
        rootTree.children.push({
          title: item.group,
          key: item.group,
          children: grops[item.group]
        })
      }
    } else {
      rootTree.children.push({
        title: createTitle(item),
        key: item.namehash,
      })
    }
  }
  return [rootTree];
}

export function Tree(props: TreeProps) {
  const { tag, selectKey } = props;
  const expandedKeys = [selectKey.slice(1)];

  return (
    <MarkedContext.Consumer>
      {({ categoryByTag }) => {
        const treeData = buildTreeData(categoryByTag[tag], tag);
        return (
          <TreeAliasName
            showLine
            selectedKeys={expandedKeys}
            blockNode
            defaultExpandAll
            treeData={treeData} />
        );
      }}
    </MarkedContext.Consumer>
  )
}