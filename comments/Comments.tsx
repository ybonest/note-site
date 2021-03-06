import * as React from 'react';
import axios from 'axios';
import { Comment, Avatar, Form, Input, Button, List, Spin, Tabs } from 'antd';
import '@scss/comments.scss';

const { TextArea } = Input;
const { TabPane } = Tabs;

const proxy = 'https://cors-anywhere.herokuapp.com/'
const headers = { Accept: 'application/vnd.github.v3.full+json' }; // 'application/vnd.github.machine-man-preview' };
const baseUrlMap = { OAuth: `${proxy}https://github.com`, api: `https://api.github.com` };

interface AjaxProps {
  type?: 'OAuth' | 'api';
  timeout?: number;
}

interface LoginParams {
  client_id: string;
  client_secret: string;
  code: string;
  redirect_uri?: string;
  state?: string;
}

interface CommentsProps {
  client_id?: string;
  client_secret?: string;
  redirect_uri?: string;
  history?: any;
  owner: string;
  repo: string;
  title?: string;
  label?: string;
  filename: string;
  code: string;
}

interface CommentsState {
  user?: any;
  value?: string;
  issue?: any;
  comments?: any;
  token?: string;
  spinningListFetcher: boolean;
  authentication?: boolean;
}

function ajax(props: AjaxProps = {}) {
  let headers: any = {};
  const token = localStorage.getItem('access_token');
  if (token) headers.Authorization = `token ${token}`;

  const instance = axios.create({
    baseURL: baseUrlMap[props.type] || baseUrlMap.api,
    timeout: props.timeout || 6000,
    headers: { Accept: 'application/json', ...headers }
  });

  instance.interceptors.response.use(function (response) {
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  }, function (error) {
    return Promise.reject(error);
  });

  return instance;
}

const api = ajax();
const oAuth = ajax({ type: 'OAuth' });

// 获取access_token
async function LoginWithCode(params: LoginParams) {
  return await oAuth({ method: 'post', url: 'login/oauth/access_token', data: params });
}

// 获取user信息
async function user(token) {
  return await api.get('/user', { headers: { Authorization: `token ${token}`} });
}

interface IssuesParams {
  labels: string;
  [key: string]: string;
}

interface CreateIssuesParams {
  title: string;
  body: string;
  labels: string[];
}

// 获取issues
async function getIssues(owner: string, repo: string, params: IssuesParams, auth: any) {
  return await api.get(`/repos/${owner}/${repo}/issues`, { params, auth });
}

async function createIssues(owner: string, repo: string, data: CreateIssuesParams, headers: any) {
  return await api.post(`/repos/${owner}/${repo}/issues`, data, { headers });
}

async function getIssuesByNumbr(owner: string, repo: string, issue_number: number) {
  return await api.get(`/repos/${owner}/${repo}/issues/${issue_number}`);
}

function stringifyQuery(search: Record<string, string>, baseURL?: string) {
  return Object.keys(search).reduce((base: string, key: string, index: number) => {
    if (index === 0) {
      return `${base}?${key}=${search[key]}`;
    }
    return `${base}&${key}=${search[key]}`;
  }, baseURL || '')
}

const Editor = ({ onChange, value, disabled }: any) => (
  <div>
    <Form.Item style={{ width: '100%' }}>
      <TextArea rows={4} disabled={disabled} onChange={onChange} value={value} />
    </Form.Item>
  </div>
);

const avatar = (url) => {
  return <Avatar src={url} />
}

const CommentsList = (props) => {
  if (Array.isArray(props.comments)) {
    return (
      <List
        className="comment-list"
        itemLayout="horizontal"
        dataSource={props.comments}
        renderItem={(item: { user: any, body: string, created_at: Date }) => (
          <li>
            <Comment
              author={item.user.login}
              avatar={avatar(item.user.avatar_url)}
              content={item.body}
              datetime={item.created_at}
            />
          </li>
        )}
      />
    );
  }
  return null;
}

export default class Comments extends React.PureComponent<CommentsProps, CommentsState> {
  public state: CommentsState = { spinningListFetcher: true, authentication: false };

  constructor(props: CommentsProps) {
    super(props);
    this.accessToken();
  }

  componentDidMount() {
    this.getCommentsByIssue();
  }
  
  componentWillReceiveProps() {
    this.accessToken();
  }

  private get label() {
    return window.location.hash.split('/').pop();
  }

  private get token() {
    return this.state.token || localStorage.getItem('access_token');
  }

  private set token(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  private async getUsers(token: string) {
    try {
      this.setState({
        user: await user(token)
      })
    } catch (error) {
      console.error(error);
    }
  }

  login = () => {
    if (!this.token) {
      const rediect = stringifyQuery({
        client_id: this.props.client_id,
        scope: 'public_repo',
        redirect_uri: window.location.href
      }, 'https://github.com/login/oauth/authorize');
      window.location.href = rediect;
    }
  }

  private async accessToken() {
    try {
      if (this.props.code && !this.token) {
        this.setState({ authentication: true })
        const result: any = await LoginWithCode({
          client_id: this.props.client_id,
          client_secret: this.props.client_secret,
          code: this.props.code
        })
        
        if (result.access_token) {
          this.setState({
            token: result.access_token
          }, () => {
            this.token = result.access_token;
            this.getUsers(result.access_token);
          })
        }
        this.setState({ authentication: false }) 
      }
    } catch (error) {
      this.setState({ authentication: false })
      console.error(error);
    }
  }

  private async issues() {
    const { owner, repo, label, client_id, client_secret, filename } = this.props;
    const result: any = await getIssues(owner, repo, { labels: this.label }, {
      username: client_id,
      password: client_secret
    });
    if (result.length) {
      return result[0];
    }
    return await createIssues(
      owner,
      repo,
      {
        labels: [label || this.label],
        title: filename,
        body: `${filename}的评论`
      },
      { Authorization: `token ${this.token}`}
    );
  }

  public async getCommentsByIssue() {
    const { client_id, client_secret } = this.props;
    try {
      const issue = await this.issues();
      if (issue && issue.comments_url) {
        const comments = await api.get(issue.comments_url, {
          headers: {
            Accept: 'application/vnd.github.v3.full+json'
          },
          auth: {
            username: client_id,
            password: client_secret
          },
          params: {
            per_page: 10,
            page: 1
          }
        });
        this.setState({ spinningListFetcher: false })
        if (comments) this.setState({ comments });
      }
    } catch (error) {
      this.setState({ spinningListFetcher: false })
    }
  }

  public get avatar() {
    const { user = {} } = this.state;
    return <Avatar src={user.avatar_url} />
  }

  handleChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  createComments = async () => {
    const { issue, value } = this.state;
    if (issue && value) {
      const result = await api.post(issue.comments_url, {
        body: value
      }, {
        headers: { Authorization: `token ${this.token}`, ...headers }
      });
      this.setState((state) => {
        return {
          comments: (state.comments || []).concat([result]),
          value: ''
        }
      })
    }
  }

  handleSubmit = () => {
    const { value, issue } = this.state;
    if (!value) return;
    if (issue) {
      this.createComments();
    } else {
      this.issues().then(issue => {
        this.setState({ issue }, this.createComments)
      });
    }
  }

  public get tabBarExtraContent() {
    return !this.token && <div style={{ padding: '0px 10px' }}><a onClick={this.login}>Login</a> with GitHub</div>;
  }

  public get comments() {
    const { value } = this.state;
    const editor = (
      <div className="card-container">
        <Tabs type="card" tabBarExtraContent={this.tabBarExtraContent}>
            <TabPane tab="评论" key="1">
              <Editor onChange={this.handleChange} value={value} disabled={!Boolean(this.token)} />
            </TabPane>
        </Tabs>
        { this.commentButton }
      </div>
    );
    return <Comment avatar={this.avatar} content={ editor } />;
  }

  public get commentButton() {
    return (
      <Form.Item>
        <Button disabled={!Boolean(this.token)} htmlType="submit" onClick={this.handleSubmit} type="primary">
          Comment
        </Button>
      </Form.Item>
    );
  }

  render() {
    const { comments, spinningListFetcher, authentication } = this.state;
    return (
      <Spin tip="Loading..." spinning={spinningListFetcher}>
        <CommentsList comments={comments} />
        <Spin tip="Loading..." spinning={authentication}>
          { this.comments }
        </Spin>
      </Spin>
    )
  }
}