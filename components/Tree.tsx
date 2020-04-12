import * as React from 'react';
import { Link } from "react-router-dom"
import styled from 'styled-components';
import { Tree as AntdTree } from 'antd';
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
  width: 260px;
  border-right: 1px solid #e6e4e4;
  display: block;
  position: ${({ fixStatus }: any) => (fixStatus ? 'fixed': 'relative' )};
  top: 0px;
  height: 100vh;
  margin-left: -260px;
  padding: 10px !important;
  @media (max-width: 1000px) {
    display: none;
  }
`

function createTitle({title, namehash}: Item) {
  return <Link style={{ display: 'block', width: '100%', height: '100%' }} to={'/' + namehash}>{title}</Link>
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
  const [fixStatus, setTreeFix] = React.useState(false);
  React.useEffect(() => {
    function handleScroll(e) {
        setTreeFix(e.target.documentElement.scrollTop > 84);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  })

  return (
    <MarkedContext.Consumer>
      {({ categoryByTag }) => {
        const treeData = buildTreeData(categoryByTag[tag], tag);
        return (
          <TreeAliasName
            showLine
            fixStatus={fixStatus}
            selectedKeys={expandedKeys}
            blockNode
            defaultExpandAll
            treeData={treeData} />
        );
      }}
    </MarkedContext.Consumer>
  )
}