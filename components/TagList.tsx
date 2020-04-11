import * as React from 'react';
import { Switch, Route, Redirect } from "react-router-dom"
import { TagsCard } from "@components/Tags";
import { IntroductionList } from '@components/Introduction';
import { TagListPanel } from '@components/styled';
import { markedSource } from '@app/context';

export default markedSource((props) => {
  const { categoryByTag: tags } = props;
  return (
    <React.Fragment>
        <Switch>
          <Route exact path='/tags'>
            <Redirect to={'/tags/' + Object.keys(tags)[0]} />
          </Route>
          {Object.keys(tags).map(tag =>(
              <Route key={tag} path={'/tags/' + tag} >
                <TagListPanel>
                    <IntroductionList dataSource={tags[tag]} />
                </TagListPanel>
              </Route>
          ))}
        </Switch>
      <TagsCard />
    </React.Fragment>
  );
});
