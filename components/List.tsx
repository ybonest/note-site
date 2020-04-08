import * as React from 'react';
import { Switch, Route, Redirect, useHistory } from "react-router-dom"
import { TagsCard } from "@components/Tags";
import { IntroductionList } from '@components/Introduction';
import { Details, Card, TagListPanel } from '@components/styled';
import { Tree } from '@components/Tree';
import Comments from '@comments/Comments';
import { markedSource } from '@app/context';

function getClient() {
  const host = window.location.host;
  const options = { owner: 'ybonest', repo: 'note-site' };
  if (host === 'localhost:8080') {
    Object.assign(options, {
      client_id: 'f67c609c5ee466c83cd2',
      client_secret: 'e956d15ba2761abad52e534424f52ba07ffbdbad',
      redirect_uri: 'http://localhost:8080/'
    }); 
  }
  if (host === 'me.ybonote.cn') {
    Object.assign(options, {
      client_id: '5962d91e68425e69e653',
      client_secret: '3231ff558fe41ba150fb868effdc099b7ac8d864',
      redirect_uri: 'https://me.ybonote.cn/'
    })
  }
  return options;
}

function parserQuery(search = window.location.search):Record<string, string> {
  return search.slice(1).split('&').reduce((collect, item) => {
    const [key, value] = item.split('=');
    collect[key] = value;
    return collect;
  }, {})
}

export const TagList = markedSource((props) => {
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

function markdown(markdown): React.FunctionComponent  {
  return () => {
    return <div dangerouslySetInnerHTML={{ __html: markdown }} />
  }
};

function RightContent() {
  return (
    <Card>
    </Card>
  );
}

export const List = markedSource((props) => {
  const { flatList: sources } = props;
  const options = getClient();
  const history = useHistory();
  let code;
  React.useEffect(() => {
    const { origin, search, hash } = window.location;
    code = parserQuery(search).code;
    if (code) {
      sessionStorage.setItem('code', code);
      window.location.href = `${origin}/${hash}`;
    }
  })
  if (!code) {
    code = sessionStorage.getItem('code');
  }
  return (
    <React.Fragment>
      <Switch>
        <Route exact path='/'>
          <TagListPanel>
            <IntroductionList dataSource={sources} />
          </TagListPanel>
          <RightContent />
        </Route>
      </Switch>
        <Switch>
          {sources.map(source => (
            <Route key={source.namehash} exact path={'/' + source.namehash}>
              <Tree tag={source.tag} selectKey={history.location.pathname} />
              <Details key="details">
                {React.createElement(markdown(source.content), { key: source.namehash })}
                <Comments {...options} filename={source.name} history={history} code={code} />
              </Details>
              <TagsCard />
            </Route>
          ))}
        </Switch>
    </React.Fragment>
  );
});
