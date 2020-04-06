import * as React from 'react';
import axios from 'axios';
import Comment from 'antd/es/comment';
import Avatar from 'antd/es/avatar';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import List from 'antd/es/list';
// import styled from 'styled-components';

// const CommentPanel = styled(Comment)`
//   .ant-comment-avatar {
//     width: 32px;
//     height: 32px;
//     overflow: hidden;
//     border-radius: 50%;
//   }
// `;

const { TextArea } = Input;

const proxy = 'https://cors-anywhere.herokuapp.com/'
const headers = { Accept: 'application/vnd.github.v3.full+json' }; // 'application/vnd.github.machine-man-preview' };
const baseUrlMap = { OAuth: `${proxy}https://github.com`, api: `https://api.github.com` };

interface AjaxProps {
  type?: 'OAuth' | 'api' | 'imsun';
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
  owner: string;
  repo: string;
  title?: string;
  label?: string;
}

interface CommentsState {
  user?: any;
  value?: string;
  issue?: any;
  comments?: any;
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
async function user() {
  return await api.get('/user');
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

async function createIssues(owner: string, repo: string, data: CreateIssuesParams) {
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

function parserQuery(search = window.location.search):Record<string, string> {
  return search.slice(1).split('&').reduce((collect, item) => {
    const [key, value] = item.split('=');
    collect[key] = value;
    return collect;
  }, {})
}

const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
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

const AuthButton = ({ onSubmit })=> {
  return (
    <Button htmlType="submit" onClick={onSubmit} type="primary">
      auth
    </Button>
  );
}

export default class Comments extends React.PureComponent<CommentsProps, CommentsState> {
  private code: string;

  public state: CommentsState = {};

  constructor(props: CommentsProps) {
    super(props);
    this.code = parserQuery().code;
    this.accessToken();
  }

  componentWillReceiveProps() {
    this.code = parserQuery().code;
    this.accessToken();
  }

  private get label() {
    return window.location.hash.split('/').pop();
  }

  private get token() {
    return localStorage.getItem('access_token');
  }

  private set token(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  private async getUsers() {
    try {
      this.setState({
        user: await user()
      })
    } catch (error) {
      console.error(error);
    }
  }

  login = () => {
    if (!this.code && !this.token) {
      const rediect = stringifyQuery({
        client_id: this.props.client_id,
        redirect_uri: window.location.href,
      }, 'https://github.com/login/oauth/authorize');
      window.location.href = rediect;
    }
  }

  private async accessToken() {
    try {
      if (this.code && !this.token) {
        const result: any = await LoginWithCode({
          client_id: this.props.client_id,
          client_secret: this.props.client_secret,
          code: this.code
        })
        if (result.access_token) {
          this.token = result.access_token;
          this.getUsers();
        } 
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async issues() {
    const { owner, repo, label, client_id, client_secret } = this.props;
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
        title: this.label,
        body: 'test' 
      }
    );
  }
  
  componentDidMount() {
    this.getCommentsByIssue();
  }

  public async getCommentsByIssue() {
    const { client_id, client_secret } = this.props;
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
      if (comments) this.setState({ comments });
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

  render() {
    const { value, comments } = this.state;
    console.log(this.token)
    return (
      <div>
        <CommentsList comments={comments} />
        {
          this.token ?
            <Comment
              avatar={this.avatar}
              content={ <Editor onChange={this.handleChange} onSubmit={this.handleSubmit} value={value} /> }
            /> : 
            <AuthButton onSubmit={this.login} />}
      </div>
    )
  }
}